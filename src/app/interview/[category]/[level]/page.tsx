import { Metadata } from 'next';
import CategoryPageClient from './CategoryPageClient';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ category: string; level: string }> 
}): Promise<Metadata> {
  const { category, level } = await params;
  
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  const formattedLevel = level.charAt(0).toUpperCase() + level.slice(1);
  const title = `${formattedCategory} ${formattedLevel} Interview Questions`;
  const description = `Prepare for your ${formattedCategory} interview with our curated list of ${level} level questions and answers.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'website',
    },
  };
}

export default async function Page({ 
  params 
}: { 
  params: Promise<{ category: string; level: string }> 
}) {
  const { category, level } = await params;
  
  return <CategoryPageClient category={category} level={level} />;
}
