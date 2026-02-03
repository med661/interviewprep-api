'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Loader2, Mail } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'signin' | 'signup';
}

export default function LoginModal({ isOpen, onClose, mode = 'signin' }: LoginModalProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { sendOtp, login } = useAuth();
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep('email');
      setError('');
      setOtp(new Array(6).fill(''));
    }
  }, [isOpen]);

  // Focus first input when step changes to OTP
  useEffect(() => {
    if (step === 'otp') {
      // Small timeout to allow render
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendOtp(email);
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const otpCode = otp.join('');
      if (otpCode.length !== 6) {
        throw new Error('Please enter complete code');
      }
      await login(email, otpCode);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Take the last character entered (handling overwrite)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      pastedData.forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const getTitle = () => {
    if (step === 'otp') return 'Verify Email';
    return mode === 'signup' ? 'Create Account' : 'Welcome Back';
  };

  const getButtonText = () => {
    if (loading) return <Loader2 className="animate-spin w-5 h-5" />;
    return mode === 'signup' ? 'Sign Up with Email' : 'Sign In with Email';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
          {getTitle()}
        </h2>

        {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                {error}
            </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {getButtonText()}
            </button>
            
            <p className="text-center text-sm text-slate-500 mt-4">
              {mode === 'signup' ? "Already have an account?" : "Don't have an account?"} We use magic codes for both!
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
             <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    We sent a code to
                </p>
                <p className="font-medium text-slate-900 dark:text-white">{email}</p>
             </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-center text-slate-700 dark:text-slate-300">Enter Verification Code</label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center text-xl font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Verify & Login'}
            </button>
            <button 
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
                Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
