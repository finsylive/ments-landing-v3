export type JobListing = {
  id: string;
  company_name: string;
  role: string;
  about_role: string;
  experience_required: string;
  created_at: string;
  form_link?: string;
  // Additional fields from the jobs table
  job_type?: string;
  location?: string;
  salary_range?: string;
  skills_required?: string[];
  responsibilities?: string[];
  benefits?: string[];
  is_active?: boolean;
};
