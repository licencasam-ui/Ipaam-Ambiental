import type {Metadata} from 'next';
import {Public_Sans, Inter} from 'next/font/google';
import './globals.css';

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-headline',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'IPAAM Licenças Ambientais - Portal de Consulta',
  description: 'Consulte licenças, processos e autorizações ambientais do Estado do Amazonas.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${publicSans.variable} ${inter.variable}`}>
      <body suppressHydrationWarning className="bg-background font-body text-on-background min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
