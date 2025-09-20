import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Linear Equation Solver',
  description: 'Sign in to save and view your equation solving history',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
