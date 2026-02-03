import { Metadata } from 'next';
import ContactUsClient from './ContactUsClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact the Interview Preparation Platform team for support, feedback, or inquiries.',
};

export default function ContactUs() {
  return <ContactUsClient />;
}
