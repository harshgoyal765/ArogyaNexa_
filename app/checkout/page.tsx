'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, CreditCard, Truck } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { ordersApi } from '@/lib/api/orders';
import { paymentsApi } from '@/lib/api/payments';
import { formatCurrency, cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit mobile number'),
  addressLine1: z.string().min(5, 'Address required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  pincode: z.string().regex(/^\d{6}$/, '6-digit pincode'),
});
type FormData = z.infer<typeof schema>;

type PaymentMethod = 'RAZORPAY' | 'COD';

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const cart = useAppSelector((s) => s.cart.cart);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('RAZORPAY');
  const [placing, setPlacing] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setPlacing(true);
    try {
      const { data: orderRes } = await ordersApi.place({
        shippingAddress: { ...data },
        paymentMethod,
      });
      const order = orderRes.data;

      if (paymentMethod === 'COD') {
        showToast('Order placed successfully!', 'success');
        router.push(`/orders/${order.uuid}`);
        return;
      }

      // Razorpay flow
      const { data: payRes } = await paymentsApi.initiate(order.uuid, order.totalAmount, 'RAZORPAY');
      const payment = payRes.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: payment.amount * 100,
        currency: payment.currency || 'INR',
        name: 'ArogyaNexa Pharmacy',
        description: `Order ${order.orderNumber}`,
        order_id: payment.gatewayOrderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          await paymentsApi.verify(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
          showToast('Payment successful!', 'success');
          router.push(`/orders/${order.uuid}?payment=success`);
        },
        theme: { color: '#004182' },
      };

      const rzp = new (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void; on: (event: string, cb: unknown) => void } }).Razorpay(options);
      rzp.on('payment.failed', () => {
        showToast('Payment failed. Please try again.', 'error');
        router.push(`/orders/${order.uuid}?payment=failed`);
      });
      rzp.open();
    } catch {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-surface">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-headline text-4xl text-primary mb-8">Checkout</h1>

          {/* Progress Stepper */}
          <nav className="mb-12 flex justify-center items-center gap-4 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</div>
              <span className="text-xs md:text-sm font-label uppercase tracking-widest text-primary font-bold">Shipping</span>
            </div>
            <div className="h-[1px] w-8 md:w-16 bg-outline-variant/30" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-outline text-outline flex items-center justify-center text-xs font-bold">2</div>
              <span className="text-xs md:text-sm font-label uppercase tracking-widest text-outline">Payment</span>
            </div>
            <div className="h-[1px] w-8 md:w-16 bg-outline-variant/30" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-outline text-outline flex items-center justify-center text-xs font-bold">3</div>
              <span className="text-xs md:text-sm font-label uppercase tracking-widest text-outline">Review</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
              {/* Clinical Notice */}
              {cart?.requiresPrescription && (
                <section className="bg-tertiary-fixed/20 border-l-4 border-tertiary p-6 rounded-r-xl flex gap-4">
                  <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <div>
                    <h4 className="font-bold text-tertiary text-sm font-label uppercase tracking-wide">Pharmacist Review Required</h4>
                    <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                      Your order contains prescription items. A licensed pharmacist will review your medical profile before the order is finalized and shipped.
                    </p>
                  </div>
                </section>
              )}

              {/* Shipping */}
              <div className="card p-6 space-y-5">
                <div className="flex justify-between items-end">
                  <h2 className="font-headline text-3xl text-primary">Shipping Address</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-on-surface mb-1.5">Full Name</label>
                    <input {...register('name')} placeholder="Recipient name" className={cn('input-field', errors.name && 'ring-2 ring-error')} />
                    {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1.5">Mobile Number</label>
                    <input {...register('phone')} placeholder="9XXXXXXXXX" className={cn('input-field', errors.phone && 'ring-2 ring-error')} />
                    {errors.phone && <p className="text-xs text-error mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1.5">Pincode</label>
                    <input {...register('pincode')} placeholder="6-digit pincode" maxLength={6} className={cn('input-field', errors.pincode && 'ring-2 ring-error')} />
                    {errors.pincode && <p className="text-xs text-error mt-1">{errors.pincode.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-on-surface mb-1.5">Address Line 1</label>
                    <input {...register('addressLine1')} placeholder="House/Flat no., Street" className={cn('input-field', errors.addressLine1 && 'ring-2 ring-error')} />
                    {errors.addressLine1 && <p className="text-xs text-error mt-1">{errors.addressLine1.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-on-surface mb-1.5">Address Line 2 <span className="text-outline">(optional)</span></label>
                    <input {...register('addressLine2')} placeholder="Landmark, Area" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1.5">City</label>
                    <input {...register('city')} placeholder="City" className={cn('input-field', errors.city && 'ring-2 ring-error')} />
                    {errors.city && <p className="text-xs text-error mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1.5">State</label>
                    <input {...register('state')} placeholder="State" className={cn('input-field', errors.state && 'ring-2 ring-error')} />
                    {errors.state && <p className="text-xs text-error mt-1">{errors.state.message}</p>}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="card p-6 space-y-4">
                <h2 className="font-headline text-3xl text-primary">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {([
                    { id: 'RAZORPAY', label: 'Pay Online', sub: 'Cards, UPI, Net Banking', icon: <CreditCard size={20} /> },
                    { id: 'COD', label: 'Cash on Delivery', sub: 'Pay when delivered', icon: <Truck size={20} /> },
                  ] as { id: PaymentMethod; label: string; sub: string; icon: React.ReactNode }[]).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
                        paymentMethod === m.id ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant hover:border-primary/40'
                      )}
                    >
                      <div className={cn('p-2 rounded-lg', paymentMethod === m.id ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant')}>
                        {m.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-on-surface">{m.label}</p>
                        <p className="text-xs text-on-surface-variant">{m.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-12 py-8 border-t border-outline-variant/20">
                <div className="flex items-center gap-2 text-outline grayscale opacity-60">
                  <span className="material-symbols-outlined">verified</span>
                  <span className="text-[10px] font-label uppercase tracking-tighter">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-outline grayscale opacity-60">
                  <span className="material-symbols-outlined">security</span>
                  <span className="text-[10px] font-label uppercase tracking-tighter">AES-256 Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-outline grayscale opacity-60">
                  <span className="material-symbols-outlined">local_pharmacy</span>
                  <span className="text-[10px] font-label uppercase tracking-tighter">Licensed Pharmacy</span>
                </div>
              </div>

              <button type="submit" disabled={placing} className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-label font-bold uppercase tracking-widest text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                {placing ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                    Place Secure Order
                  </>
                )}
              </button>
            </form>

            {/* Summary */}
            <div className="card p-6 space-y-4 h-fit sticky top-24">
              <h3 className="font-headline text-xl text-primary">Order Summary</h3>
              {cart?.items.map((item) => (
                <div key={item.uuid} className="flex justify-between text-sm">
                  <span className="text-on-surface-variant line-clamp-1 flex-1 mr-2">{item.productName} × {item.quantity}</span>
                  <span className="font-medium text-on-surface flex-shrink-0">{formatCurrency(item.lineTotal)}</span>
                </div>
              ))}
              <div className="border-t border-outline-variant/20 pt-4 flex justify-between font-semibold">
                <span className="text-on-surface">Total</span>
                <span className="text-primary font-headline text-xl">{formatCurrency(cart?.totalPrice ?? 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
