import AuthForm from './AuthForm.jsx';

export default function SignInPage({ params }) {
  return <AuthForm locale={params.locale} mode="signin" />;
}
