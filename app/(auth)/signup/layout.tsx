import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopitect | Signup",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
