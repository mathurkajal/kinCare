import { useEffect } from 'react';

/**
 * Hook to handle Escape key press for accessible dialogs and overlays.
 * Conforms to WCAG 2.1 AA dialog keyboard requirements.
 */
export function useEscapeKey(onEscape: () => void, isActive: boolean = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEscape, isActive]);
}
