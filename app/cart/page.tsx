'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchCartThunk, removeFromCartThunk, updateCartItemThunk } from '@/store/cartSlice';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}

function CartContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { cart, isLoading } = useAppSelector((s) => s.cart);

  useEffect(() => { dispatch(fetchCartThunk()); }, [dispatch]);

  const handleRemove = async (uuid: string, name: string) => {
    await dispatch(removeFromCartThunk(uuid));
    showToast(`${name} removed from cart`, 'info');
  };

  const handleQuantity = async (uuid: string, qty: number) => {
    if (qty < 1) return;
    await dispatch(updateCartItemThunk({ itemUuid: uuid, quantity: qty }));
  };

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <>
      <Navbar />
      <div className="pt-20 min-h-screen bg-surface">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Editorial Header */}
          <section className="mb-12">
            <h1 className="font-headline text-5xl font-light text-primary mb-2">Your Selection</h1>
            <p className="text-on-surface-variant font-body tracking-wide flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified</span>
              CLINICALLY REVIEWED ITEMS FOR YOUR WELLNESS JOURNEY
            </p>
          </section>

          {isLoading && !cart ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : isEmpty ? (
            <div className="text-center py-24 space-y-4">
              <ShoppingBag size={64} className="mx-auto text-outline-variant" />
              <h3 className="font-headline text-2xl text-primary">Your cart is empty</h3>
              <p className="text-on-surface-variant text-sm">Browse our curated selection of medicines and wellness products.</p>
              <Link href="/products" className="btn-primary inline-flex mt-4">Browse Medicines <ArrowRight size={16} /></Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Items */}
              <div className="lg:col-span-8 space-y-8">
                {cart.requiresPrescription && !cart.prescriptionValidated && (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Prescription Required</p>
                      <p className="text-xs text-amber-700 mt-0.5">One or more items require a prescription. Please upload it before checkout.</p>
                      <Link href="/prescriptions" className="text-xs text-amber-800 font-semibold underline mt-1 inline-block">Upload Prescription →</Link>
                    </div>
                  </div>
                )}

                {cart.items.map((item) => (
                  <div key={item.uuid} className="group bg-surface-container-lowest rounded-xl p-6 shadow-[0_32px_48px_-12px_rgba(0,65,130,0.04)] border border-outline-variant/10 transition-all hover:scale-[1.005]">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-48 h-48 bg-surface-container rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-outline-variant">medication</span>
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h2 className="font-headline text-3xl text-primary">{item.productName}</h2>
                              <p className="section-label text-[10px] mt-0.5">Schedule {item.scheduleType}</p>
                            </div>
                            <span className="text-xl font-medium text-primary">{formatCurrency(item.lineTotal)}</span>
                          </div>
                          {item.prescriptionRequired && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary/10 text-tertiary rounded-full mb-4">
                              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>prescriptions</span>
                              <span className="text-[10px] uppercase font-bold tracking-widest">Prescription Required</span>
                            </div>
                          )}
                          {item.priceChanged && (
                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><AlertTriangle size={12} /> Price updated</p>
                          )}
                          {item.nearExpiry && (
                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><AlertTriangle size={12} /> Expires {formatDate(item.expiryDate)}</p>
                          )}
                          {item.drugInteractionWarning && (
                            <p className="text-xs text-error mt-1 flex items-center gap-1"><AlertTriangle size={12} /> {item.drugInteractionWarning}</p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/10 pt-6">
                          <div className="flex items-center bg-surface-container rounded-lg px-2">
                            <button onClick={() => handleQuantity(item.uuid, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-container-high rounded-md transition-colors">
                              <Minus size={14} />
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button onClick={() => handleQuantity(item.uuid, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-container-high rounded-md transition-colors">
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="flex gap-6">
                            <button className="text-sm font-label uppercase tracking-widest text-outline hover:text-primary transition-colors flex items-center gap-2">
                              <span className="material-symbols-outlined text-lg">bookmark</span> Save
                            </button>
                            <button onClick={() => handleRemove(item.uuid, item.productName)} className="text-sm font-label uppercase tracking-widest text-error/80 hover:text-error transition-colors flex items-center gap-2">
                              <Trash2 size={16} /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <aside className="lg:col-span-4 sticky top-32">
                <div className="bg-white rounded-2xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-outline-variant/5">
                  <h3 className="font-headline text-2xl text-primary mb-6">Order Summary</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-on-surface-variant">
                      <span className="font-label text-sm uppercase tracking-wider">Subtotal</span>
                      <span className="font-medium">{formatCurrency(cart.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span className="font-label text-sm uppercase tracking-wider">Estimated Shipping</span>
                      <span className="text-tertiary font-medium">FREE</span>
                    </div>
                    <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-end">
                      <span className="font-headline text-xl text-primary">Total Amount</span>
                      <span className="text-3xl font-headline text-primary">{formatCurrency(cart.totalPrice)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/checkout')}
                    disabled={cart.requiresPrescription && !cart.prescriptionValidated}
                    className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-5 rounded-md font-label uppercase tracking-[0.2em] text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-lg">lock</span>
                    Secure Checkout
                  </button>

                  <p className="mt-6 text-[10px] text-center text-on-surface-variant uppercase tracking-widest leading-relaxed">
                    By clicking checkout, you agree to our clinical terms and pharmacist consultation protocols.
                  </p>

                  {/* Trust Badges */}
                  <div className="mt-12 pt-8 border-t border-outline-variant/10 grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center text-center p-3 rounded-xl bg-surface-container-low/50">
                      <span className="material-symbols-outlined text-secondary mb-2">verified_user</span>
                      <span className="text-[9px] font-bold uppercase tracking-tighter text-on-surface-variant">Verified Pharmacy</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-3 rounded-xl bg-surface-container-low/50">
                      <span className="material-symbols-outlined text-secondary mb-2">shield</span>
                      <span className="text-[9px] font-bold uppercase tracking-tighter text-on-surface-variant">Secure Payment</span>
                    </div>
                  </div>
                </div>

                {/* Consultation Promo */}
                <div className="mt-6 p-6 bg-secondary-container/20 rounded-xl border border-secondary-container/30 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h4 className="font-headline text-lg text-on-secondary-container mb-1">Need medical advice?</h4>
                    <p className="text-xs text-on-secondary-container/80 mb-4">Chat with a licensed pharmacist in under 5 minutes.</p>
                    <Link href="/ai-assistant" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Start Consultation</Link>
                  </div>
                  <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-secondary-container text-8xl opacity-30 rotate-12 group-hover:rotate-0 transition-transform">medical_services</span>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
