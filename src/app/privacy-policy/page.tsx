import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Interview Preparation Platform. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>Introduction</h2>
          <p>
            At InterviewPrep ("we", "our", or "us"), we are committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>

          <h2>Data We Collect</h2>
          <p>
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul>
            <li>Register on the website</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact us via email or forms</li>
          </ul>

          <h2>Cookies and Tracking Technologies</h2>
          <p>
            We use cookies to enhance your browsing experience. Cookies are small data files stored on your device. 
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2>Google AdSense & DoubleClick Cookie</h2>
          <p>
            Google, as a third-party vendor, uses cookies to serve ads on our service. 
            Google's use of the DoubleClick cookie enables it and its partners to serve ads to our users based on their visit to our service or other websites on the Internet.
          </p>
          <ul>
            <li>
              You may opt out of the use of the DoubleClick Cookie for interest-based advertising by visiting the 
              <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer"> Google Ads Settings</a> web page.
            </li>
            <li>
              We have no access to or control over these cookies that are used by third-party advertisers.
            </li>
          </ul>

          <h2>Third-Party Privacy Policies</h2>
          <p>
            Our Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>

          <h2>Information Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your data. 
            However, please note that no method of transmission over the Internet is 100% secure.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: 
            <a href="mailto:support@interviewprep.com"> support@interviewprep.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}