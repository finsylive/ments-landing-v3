'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import WaitlistForm from './WaitlistForm';

export default function WaitlistDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black/90 backdrop-blur-md border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Join Our Waitlist</DialogTitle>
          <DialogDescription className="text-gray-300">
            Be the first to know when we launch. No spam, just updates.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <WaitlistForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
