"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { JobListing } from "@/types/referral";
import JobListingCard from "@/components/careers/JobListingCard";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ReferralsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        
        const { data, error } = await supabase
          .from('jobs')
          .select('id, company_name, role, about_role, experience_required, created_at, job_type, location, salary_range, skills_required, responsibilities, benefits')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        console.log('Supabase response:', { data, error });
        
        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }
        
        setJobs(data || []);
      } catch (error) {
        const err = error as Error & { code?: string; details?: string; hint?: string; table?: string };
        console.error('Error details:', {
          message: err.message,
          name: err.name,
          stack: err.stack,
          code: err.code,
          details: err.details,
          hint: err.hint,
          table: err.table
        });
        setError('Failed to load job listings. Please check the console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Job Referrals</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Explore exciting career opportunities at top companies. Apply through our referral program for better visibility.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobListingCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No job listings available at the moment. Please check back later.</p>
              </div>
            )}

            <div className="mt-16 text-center">
              <h2 className="text-2xl font-semibold mb-4">Can't find what you're looking for?</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Submit your resume and we'll notify you when matching positions become available.
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfHatDy7QkpDsmUYN7vVL1OvKECrZVzEjY5mvGerHn9_SJcLQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Submit Your Application
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
