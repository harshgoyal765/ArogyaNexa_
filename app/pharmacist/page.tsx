import { redirect } from 'next/navigation';

// /pharmacist → redirect to the prescriptions queue (the main pharmacist workspace)
export default function PharmacistRootPage() {
  redirect('/pharmacist/prescriptions');
}
