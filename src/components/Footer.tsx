import Link from 'next/link';
import { Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white mb-4">
              <div className="bg-gradient-to-tr from-blue-600 to-violet-600 p-1.5 rounded-lg text-white">
                <Terminal className="w-5 h-5" />
              </div>
              InterviewPrep
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Master your technical interview with our curated questions and expert answers.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/categories" className="hover:text-blue-600 transition-colors">Categories</Link></li>
              <li><Link href="/#featured" className="hover:text-blue-600 transition-colors">Featured Questions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/about-us" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact-us" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} InterviewPrep. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}