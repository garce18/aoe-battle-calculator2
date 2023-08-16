'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

import Motion from '../components/motion';

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  return (
    <Motion
      initial="up"
      animate="visible"
      transition={{ duration: 0.4 }}
      key={path}
    >
      {children}
    </Motion>
  );
}
