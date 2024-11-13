import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopitect | Login',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
