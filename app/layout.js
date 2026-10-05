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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="hi" 
      translate="no" 
      data-scroll-behavior="smooth" 
      className={`notranslate ${inter.variable} ${poppins.variable} ${notoDevanagari.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google" content="notranslate" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
