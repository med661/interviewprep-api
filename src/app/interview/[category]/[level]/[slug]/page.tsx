import { Metadata } from 'next';
import QuestionDetailClient from './QuestionDetailClient';

// Helper to fetch data on the server
async function getQuestion(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/questions/${slug}`, {
      cache: 'no-store', // Ensure fresh data, or use 'force-cache' / revalidate for static benefits
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const question = await getQuestion(slug);

  if (!question) {
    return {
      title: 'Question Not Found',
    };
  }

  // Extract a snippet from the answer for description if possible, or use a default
  const description = `Learn how to answer: ${question.title}. Comprehensive interview question guide for ${question.category.name} (${question.level} level).`;

  return {
    title: `${question.title} - ${question.category.name} Interview Question`,
    description: description,
    openGraph: {
      title: question.title,
      description: description,
      type: 'article',
      publishedTime: question.created_at,
      section: question.category.name,
      tags: [question.category.name, question.level, 'Interview Questions'],
      images: [
        {
          url: '/globe.svg', // Fallback image, replace with dynamic OG image generation if available
          width: 800,
          height: 600,
          alt: question.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: question.title,
      description: description,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const question = await getQuestion(slug);

  return <QuestionDetailClient slug={slug} initialQuestion={question} />;
}
