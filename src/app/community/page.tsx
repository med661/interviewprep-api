import { Metadata } from 'next';
import CommunityClient from './CommunityClient';

export const metadata: Metadata = {
  title: 'Community Contributors | Interview Prep',
  description: 'Meet the amazing developers and experts who contribute to our interview preparation platform.',
};

export default function CommunityPage() {
  return <CommunityClient />;
}
