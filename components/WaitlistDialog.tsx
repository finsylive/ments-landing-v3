'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import WaitlistForm from './WaitlistForm';

interface WaitlistDialogProps {
  children?: React.ReactNode;
  /** When provided, the dialog is controlled from the parent (needed for mobile so it stays open when menu closes) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function WaitlistDialog({ children, open: controlledOpen, onOpenChange: controlledOnOpenChange }: WaitlistDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (controlledOnOpenChange ?? (() => {})) : setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
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
