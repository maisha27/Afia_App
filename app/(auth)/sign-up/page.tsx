import type { Metadata } from 'next';
import { SignUpForm } from './SignUpForm';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create your Afia account to save your reflection and start your personalised self-help plan.',
};

export default function SignUpPage() {
  return <SignUpForm />;
}
