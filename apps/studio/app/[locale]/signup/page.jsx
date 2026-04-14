import AuthForm from '../signin/AuthForm.jsx';

export default function SignUpPage({ params }) {
  return <AuthForm locale={params.locale} mode="signup" />;
}
