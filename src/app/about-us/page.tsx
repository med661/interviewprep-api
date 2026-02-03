import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'About Interview Preparation Platform. Our mission is to help developers master technical interviews.',
};

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">About Us</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Our Mission</h2>
          <p>
            InterviewPrep was founded with a single mission: to democratize access to high-quality technical interview preparation resources. 
            We believe that every developer, regardless of their background, deserves a fair shot at landing their dream job.
          </p>

          <h2>Who We Are</h2>
          <p>
            We are a team of experienced software engineers, hiring managers, and educators who have been on both sides of the interview table. 
            We understand the anxiety and uncertainty that comes with technical interviews, and we're here to help you navigate it with confidence.
          </p>

          <h2>What We Offer</h2>
          <ul>
            <li><strong>Curated Questions:</strong> Hand-picked questions from top tech companies.</li>
            <li><strong>Expert Answers:</strong> Detailed, verified solutions with explanations.</li>
            <li><strong>Practical Tips:</strong> Insider advice on how to approach problems and communicate effectively.</li>
          </ul>

          <h2>Join Our Community</h2>
          <p>
            Whether you're a fresh graduate or a seasoned pro, InterviewPrep is your companion in your career journey. 
            Start practicing today and take the next step towards your professional goals.
          </p>
        </div>
      </div>
    </div>
  );
}