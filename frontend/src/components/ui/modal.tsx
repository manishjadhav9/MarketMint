'use client';

import { useCallback, useRef, useEffect, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function Modal({ children }: { children: React.ReactNode }) {
  const overlay = useRef(null);
  const wrapper = useRef(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick = useCallback(
    (e: MouseEvent) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-3xl bg-background/95 backdrop-blur-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-300"
      >
        <button
          onClick={onDismiss}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="p-6 sm:p-8 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
