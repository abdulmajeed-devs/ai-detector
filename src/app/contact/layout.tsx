import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact AI Detector Free – Support, Feedback & Partnerships',
  description: 'Need help or have a partnership idea? Contact AI Detector Free for support, feature requests, press, or API inquiries. We usually reply within 1–2 business days.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact AI Detector Free – Support, Feedback & Partnerships',
    description: 'Need help or have a partnership idea? Contact AI Detector Free for support, feature requests, press, or API inquiries. We usually reply within 1–2 business days.',
    url: 'https://aidetectorfree.app/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact AI Detector Free – Support, Feedback & Partnerships',
    description: 'Need help or have a partnership idea? Contact AI Detector Free for support, feature requests, press, or API inquiries. We usually reply within 1–2 business days.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
