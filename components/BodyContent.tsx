'use client';

import { ReactNode, useEffect, useState } from 'react';

export default function BodyContent({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render children after mounting to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}
