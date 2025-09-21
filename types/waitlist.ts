export interface WaitlistEntry {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  message?: string;
  created_at?: string;
  updated_at?: string;
  status?: 'pending' | 'contacted' | 'approved' | 'rejected';
}

export interface WaitlistResponse {
  data: WaitlistEntry | null;
  error: Error | null;
  isDuplicate?: boolean;
}
