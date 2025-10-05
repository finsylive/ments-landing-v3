"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/navbar";
import Footer from "@/components/footer";

export default function DeleteAccount() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    reason: "",
    feedback: "",
    confirmation: false
  });

  // No need to fetch user data since this is a landing page without authentication

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [error, setError] = useState("");

  // Handle scroll events to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.confirmation) {
      setError('Please confirm that you understand the consequences of deleting your account.');
      return;
    }

    setError('');
    setShowConfirmDialog(true);
  };

  const confirmDeletion = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      const response = await fetch('/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          reason: formData.reason,
          feedback: formData.feedback,
        }),
      });

      // Handle the response
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.details || 'Failed to submit deletion request');
      }

      // Handle successful submission or duplicate request
      if (responseData.isDuplicate) {
        setFormData(prev => ({
          ...prev,
          feedback: 'A deletion request is already being processed for your account.'
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          feedback: 'Your account deletion request has been received and is being processed.'
        }));
      }

      // Handle successful submission
      setFormData(prev => ({
        ...prev,
        feedback: responseData?.isDuplicate
          ? 'A request is already being processed for your account.'
          : 'Your account deletion request has been received and is being processed.'
      }));

      setIsSubmitted(true);
      setShowConfirmDialog(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (err) {
      console.error('Error submitting deletion request:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      // Keep the form open if there's an error
      setIsSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setShowConfirmDialog(false);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">Confirm Account Deletion</h3>
              <div className="text-center mb-6">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete your account?
                </p>
                <p className="text-sm text-gray-600">
                  This action cannot be undone. All your data will be permanently removed from our systems.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={confirmDeletion}
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-2.5 px-4 text-base font-medium text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg shadow-sm disabled:opacity-50 transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting Account...
                    </>
                  ) : 'Yes, Delete My Account'}
                </button>
                <button
                  onClick={handleCloseDialog}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                Need help? Contact our <a href="mailto:support@ments.app" className="text-emerald-600 hover:text-emerald-700 font-medium">support team</a>.
              </p>
            </div>
          </div>
        </div>
      )}

      <Header />
      
      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-emerald-600 text-white shadow-lg transition-all duration-300 hover:bg-emerald-700 transform hover:scale-110 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      
      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="w-full max-w-lg">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                  Delete Your Account
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 max-w-lg mx-auto">
                  We're sorry to see you go. Before you leave, we'd appreciate it if you could share your feedback to help us improve.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-xl p-6 md:p-8 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-white/5 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Leaving <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="reason"
                        name="reason"
                        required
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 cursor-pointer appearance-none"
                      >
                        <option value="" className="text-gray-400">Select a reason...</option>
                        <option value="not-useful" className="text-gray-800">Not finding it useful</option>
                        <option value="complex" className="text-gray-800">Too complicated to use</option>
                        <option value="better-alternative" className="text-gray-800">Found a better alternative</option>
                        <option value="privacy" className="text-gray-800">Privacy concerns</option>
                        <option value="temporary" className="text-gray-800">Taking a break, will be back</option>
                        <option value="other" className="text-gray-800">Other reason</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {!formData.reason && (
                      <p className="mt-1 text-sm text-gray-500">
                        Please select a reason to help us improve our service.
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                      Any feedback you'd like to share? (Optional)
                    </label>
                    <textarea
                      id="feedback"
                      name="feedback"
                      rows={4}
                      value={formData.feedback}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none"
                      placeholder="Your feedback helps us improve..."
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">
                      Your feedback is valuable to us. Please let us know how we can improve.
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${error && !formData.confirmation ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} transition-colors duration-200`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center h-5 mt-0.5">
                        <input
                          id="confirmation"
                          name="confirmation"
                          type="checkbox"
                          required
                          checked={formData.confirmation}
                          onChange={handleChange}
                          className={`h-4 w-4 rounded ${error && !formData.confirmation ? 'border-red-300 text-red-600 focus:ring-red-500' : 'border-gray-300 text-emerald-600 focus:ring-emerald-500'} focus:ring-2 focus:ring-offset-0`}
                        />
                      </div>
                      <div className="text-sm">
                        <label htmlFor="confirmation" className={`font-medium ${error && !formData.confirmation ? 'text-red-700' : 'text-gray-800'}`}>
                          I understand that this action is irreversible and all my data will be permanently deleted.
                        </label>
                        <p className={`text-xs mt-1 ${error && !formData.confirmation ? 'text-red-600' : 'text-gray-600'}`}>
                          Note: This action cannot be undone. All your data, including your profile, posts, and connections will be permanently removed.
                        </p>
                        {error && !formData.confirmation && (
                          <p className="mt-2 text-sm text-red-600 flex items-start">
                            <svg className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.confirmation}
                      className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting Account...
                        </>
                      ) : (
                        'Delete My Account Permanently'
                      )}
                    </button>
                    
                    <Link 
                      href="/" 
                      className="block text-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Cancel and return to home
                    </Link>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl w-full mx-auto border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 transform transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {formData.feedback?.includes('already being processed') 
                    ? 'Request Already Received' 
                    : 'Request Under Process'}
                </h2>
                <p className="text-blue-100 text-opacity-90">
                  {formData.feedback?.includes('already being processed')
                    ? 'Your previous request is being processed'
                    : 'We\'ve received your request'}
                </p>
              </div>
              
              {/* Content */}
              <div className="p-8">
                {formData.feedback?.includes('already being processed') ? (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Request Already Exists</h3>
                        <div className="mt-1 text-sm text-yellow-700">
                          <p>We've already received your request for <span className="font-semibold">{formData.email}</span> and it's currently being processed.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center mb-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Request Received</h3>
                    <p className="text-gray-600 mb-6">
                      We've received your account deletion request for <span className="font-semibold text-gray-900">{formData.email}</span>.
                    </p>
                    
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-left">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        What happens next?
                      </h4>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>You'll receive a confirmation email at <span className="font-medium">{formData.email}</span></span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Your request will be processed within 24-48 hours</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>All your data will be permanently removed from our systems</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600">
                      <p className="flex items-center justify-center">
                        <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Processing time: 24-48 hours
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-4">
                        If you didn't request this or need assistance, please contact our support team at{' '}
                        <a href="mailto:support@ments.app" className="text-blue-600 hover:text-blue-700 font-medium">support@ments.app</a>.
                      </p>
                      <Link 
                        href="/" 
                        className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        Return to Homepage
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}