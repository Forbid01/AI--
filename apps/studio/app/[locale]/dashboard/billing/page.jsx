import BillingForm from './BillingForm.jsx';

export default function BillingPage({ params, searchParams }) {
  return (
    <BillingForm
      locale={params.locale}
      initialPackageId={searchParams?.plan}
      initialAmount={searchParams?.amount}
    />
  );
}
