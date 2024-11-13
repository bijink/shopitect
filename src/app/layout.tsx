import theme from '@/theme';
import { AppRouterCacheProvider as MuiCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import MuiCssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shopitect',
  description: 'An architect of shop management application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MuiCacheProvider options={{ enableCssLayer: true }}>
          <MuiThemeProvider theme={theme}>
            <MuiCssBaseline />
            {children}
          </MuiThemeProvider>
        </MuiCacheProvider>
      </body>
    </html>
  );
}
