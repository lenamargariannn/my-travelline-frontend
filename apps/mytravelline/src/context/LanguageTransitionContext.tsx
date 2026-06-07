import { createContext, useContext, useCallback, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

interface LangTransitionCtx {
  triggerChange: (lang: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  busy: boolean;
}

const Ctx = createContext<LangTransitionCtx>({
  triggerChange: () => {},
  containerRef: { current: null },
  busy: false,
});

export function LanguageTransitionProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const triggerChange = useCallback(
    async (lang: string) => {
      if (busyRef.current || lang === i18n.language) return;

      const root = containerRef.current;
      if (!root) {
        await i18n.changeLanguage(lang);
        localStorage.setItem('i18n_language', lang);
        return;
      }

      busyRef.current = true;
      setBusy(true);

      // Spread all elements evenly across a 160ms stagger window for the in-animation.
      // Adaptive step means every element participates — no cluster at the end.
      const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-translatable]'));
      const count = elements.length;
      const step = count > 1 ? Math.min(160 / (count - 1), 10) : 0;
      elements.forEach((el, i) => {
        el.style.setProperty('--lang-delay', `${Math.round(i * step)}ms`);
      });

      // Fade all elements out simultaneously (no stagger on out — clean unified exit)
      root.setAttribute('data-lang-out', 'true');

      // Wait for out-animation to complete (150ms + small buffer)
      await new Promise((r) => setTimeout(r, 165));

      // Change language while everything is invisible
      await i18n.changeLanguage(lang);
      localStorage.setItem('i18n_language', lang);
      queryClient.invalidateQueries();

      // One frame for React to flush new translations into the DOM
      await new Promise((r) => requestAnimationFrame(r));

      // Switch to in-animation. Sync ops — no repaint between.
      // fill-mode:both on langIn keeps each element at opacity 0 during its delay.
      root.removeAttribute('data-lang-out');
      root.setAttribute('data-lang-in', 'true');

      // Wait for last element: 160ms stagger + 220ms anim + buffer
      await new Promise((r) => setTimeout(r, 400));
      root.removeAttribute('data-lang-in');
      elements.forEach((el) => el.style.removeProperty('--lang-delay'));

      busyRef.current = false;
      setBusy(false);
    },
    [i18n, queryClient]
  );

  return (
    <Ctx.Provider value={{ triggerChange, containerRef, busy }}>
      <div ref={containerRef} style={{ display: 'contents' }}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLangTransition = () => useContext(Ctx);
