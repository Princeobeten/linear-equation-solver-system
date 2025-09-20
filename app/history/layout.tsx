import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'History - Linear Equation Solver',
  description: 'View your saved equation solving history',
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
