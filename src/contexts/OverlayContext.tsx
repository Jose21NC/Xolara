import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

interface OverlayContextType {
  hasOverlay: boolean;
  pushOverlay: (id: string) => void;
  popOverlay: (id: string) => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Set<string>>(new Set());

  const pushOverlay = useCallback((id: string) => {
    setStack(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const popOverlay = useCallback((id: string) => {
    setStack(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (stack.size === 0) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const last = Array.from(stack).pop();
        if (last) popOverlay(last);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [stack, popOverlay]);

  return (
    <OverlayContext.Provider
      value={{ hasOverlay: stack.size > 0, pushOverlay, popOverlay }}
    >
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error('useOverlay debe usarse dentro de OverlayProvider');
  return ctx;
}

export function useOverlayModal(id: string, isOpen: boolean) {
  const { pushOverlay, popOverlay } = useOverlay();
  useEffect(() => {
    if (isOpen) {
      pushOverlay(id);
      return () => popOverlay(id);
    }
  }, [isOpen, id, pushOverlay, popOverlay]);
}
