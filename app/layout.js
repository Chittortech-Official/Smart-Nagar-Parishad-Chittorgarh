import { Inter, Poppins, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700','800'], variable: '--font-poppins' });
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-devanagari',
  display: 'swap',
});

export const metadata = {
  title: 'Smart Chittorgarh | Nagar Parishad Digital Platform',
  description: 'Digital municipal management platform for Chittorgarh Nagar Parishad — connecting citizens, employees, councillors, officers and the Chairman.',
  keywords: 'Chittorgarh, Nagar Parishad, municipal, complaints, civic, smart city',
  authors: [{ name: 'Chittorgarh Nagar Parishad' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi" className={`${inter.variable} ${poppins.variable} ${notoDevanagari.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏛️</text></svg>" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
