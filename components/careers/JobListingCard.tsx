import { useState } from "react";
import { JobListing } from "@/types/referral";
import { Button } from "@/components/ui/button";
import JobDetailsModal from "./JobDetailsModal";

export default function JobListingCard({ job }: { job: JobListing }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{job.role}</h3>
            <p className="text-gray-600 dark:text-gray-300">{job.company_name}</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {job.experience_required}
          </span>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2">About the Role:</h4>
          <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{job.about_role}</p>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t">
        <div className="text-sm text-gray-500 mb-3">
          Posted on {new Date(job.created_at).toLocaleDateString()}
        </div>
        <Button 
          size="lg" 
          className="w-full" 
          variant="outline"
          onClick={() => setIsModalOpen(true)}
        >
          View Details
        </Button>
        <JobDetailsModal 
          job={job} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </div>
  );
}
