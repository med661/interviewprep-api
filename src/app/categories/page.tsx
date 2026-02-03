import { Metadata } from 'next';
import CategoriesClient from './CategoriesClient';

export const metadata: Metadata = {
  title: 'All Categories - Interview Preparation Platform',
  description: 'Browse interview questions by category. Find questions for Javascript, React, Node.js, System Design, and more.',
  openGraph: {
    title: 'Browse Interview Questions by Category',
    description: 'Explore our comprehensive list of interview categories to find the perfect practice questions for your next technical interview.',
    type: 'website',
  },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
