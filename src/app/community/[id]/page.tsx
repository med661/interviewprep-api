import { Metadata } from 'next';
import ContributorDetail from './ContributorDetail';

interface Props {
  params: Promise<{ id: string }>;
}

async function getContributor(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/contributors/${id}`, {
    cache: 'no-store', // Always fetch fresh data
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const contributor = await getContributor(id);

  if (!contributor) {
    return {
      title: 'Contributor Not Found',
    };
  }

  const title = `${contributor.name} - ${contributor.role} | Community`;
  const description = contributor.bio || `Check out ${contributor.name}'s profile on our community page.`;
  
  // Handle image for OG
  // If image_url is a base64 string, we might want to fallback to a default image or try to use it if short enough (but usually not recommended)
  // Ideally, we use a public URL. If it's base64, some platforms ignore it.
  const images = contributor.image_url && contributor.image_url.startsWith('http') 
    ? [contributor.image_url] 
    : []; 

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}

export default async function ContributorPage({ params }: Props) {
  const { id } = await params;
  const contributor = await getContributor(id);

  if (!contributor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-slate-500">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p>Contributor not found.</p>
        </div>
      </div>
    );
  }

  return <ContributorDetail contributor={contributor} />;
}
