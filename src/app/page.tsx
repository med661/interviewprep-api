import HomeClient from './HomeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interview Preparation Platform - Master Technical Interviews',
  description: 'Access curated coding interview questions, expert answers, and tips for frontend, backend, and system design interviews.',
  openGraph: {
    title: 'Interview Preparation Platform',
    description: 'Master your next technical interview with our curated collection of questions.',
    type: 'website',
  },
};

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/categories?limit=4`, {
      cache: 'no-store' // or revalidate for static generation
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data;
  } catch (error) {
    return [];
  }
}

async function getFeaturedQuestions() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/questions?featured=true&limit=6`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data;
  } catch (error) {
    return [];
  }
}

async function getPartners() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/partners?limit=20`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data;
  } catch (error) {
    return [];
  }
}

export default async function Page() {
  const [categories, featured, partners] = await Promise.all([
    getCategories(),
    getFeaturedQuestions(),
    getPartners()
  ]);

  return <HomeClient categories={categories} featured={featured} partners={partners} />;
}
