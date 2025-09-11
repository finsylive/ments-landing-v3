"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { JobListing } from "@/types/referral";
import { ExternalLink } from "lucide-react";

type JobDetailsModalProps = {
  job: JobListing | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function JobDetailsModal({ job, isOpen, onClose }: JobDetailsModalProps) {
  if (!job) return null;

  // Function to format the about_role text with proper paragraph breaks
  const formatAboutRole = (text: string) => {
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph.trim()}
      </p>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{job.role} at {job.company_name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">About the Role</h3>
            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              {formatAboutRole(job.about_role)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Experience Required</h4>
              <p className="text-gray-700 dark:text-gray-300">{job.experience_required}</p>
            </div>
            {job.job_type && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Job Type</h4>
                <p className="text-gray-700 dark:text-gray-300">{job.job_type}</p>
              </div>
            )}
            {job.location && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Location</h4>
                <p className="text-gray-700 dark:text-gray-300">{job.location}</p>
              </div>
            )}
            {job.salary_range && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Salary Range</h4>
                <p className="text-gray-700 dark:text-gray-300">{job.salary_range}</p>
              </div>
            )}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Posted On</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {new Date(job.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {Array.isArray(job.skills_required) && job.skills_required.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-3">Skills Required</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-3">Responsibilities</h4>
                <ul className="space-y-2 pl-5 list-disc text-gray-700 dark:text-gray-300">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="pl-2">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(job.benefits) && job.benefits.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-3">Benefits</h4>
                <ul className="space-y-2 pl-5 list-disc text-gray-700 dark:text-gray-300">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="pl-2">{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button asChild>
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSfHatDy7QkpDsmUYN7vVL1OvKECrZVzEjY5mvGerHn9_SJcLQ/viewform" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Apply Now <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
