import BillingForm from './BillingForm.jsx';

export default function BillingPage({ params }) {
  return <BillingForm locale={params.locale} />;
}
