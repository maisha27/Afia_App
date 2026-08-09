import type { Metadata } from 'next';
import { SignUpForm } from './SignUpForm';

export const metadata: Metadata = { title: 'Create account' };

export default function SignUpPage() {
  return <SignUpForm />;
}
