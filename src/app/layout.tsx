import Providers from "@/app/Providers";

export const metadata = {
  title: "Shopitect",
  description: "An architect of shop management application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <Providers>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
