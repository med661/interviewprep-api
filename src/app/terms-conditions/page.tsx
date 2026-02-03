import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for using the Interview Preparation Platform.',
};

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Terms & Conditions</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing and using InterviewPrep, you agree to be bound by these Terms and Conditions. 
            If you disagree with any part of these terms, you may not access the service.
          </p>

          <h2>2. Intellectual Property</h2>
          <p>
            The content, features, and functionality of InterviewPrep are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
          </p>

          <h2>3. User Account</h2>
          <p>
            When you create an account with us, you guarantee that the information you provide is accurate, complete, and current. 
            You are responsible for maintaining the confidentiality of your account and password.
          </p>

          <h2>4. Content Liability</h2>
          <p>
            We strive to provide accurate and up-to-date information, but we make no warranties regarding the accuracy, reliability, or completeness of the content. 
            You use the information on this site at your own risk.
          </p>

          <h2>5. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.
          </p>

          <h2>6. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <a href="mailto:support@interviewprep.com"> support@interviewprep.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}