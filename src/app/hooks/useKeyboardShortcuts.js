import { useEffect } from 'react';
import { useSettings } from '@/app/contexts/SettingsContext';

export function useKeyboardShortcuts() {
  const { updateSetting, increaseFontSize, decreaseFontSize, settings } = useSettings();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + Plus: Aumentar fonte
      if ((event.ctrlKey || event.metaKey) && event.key === '+') {
        event.preventDefault();
        increaseFontSize();
      }

      // Ctrl/Cmd + Minus: Diminuir fonte
      if ((event.ctrlKey || event.metaKey) && event.key === '-') {
        event.preventDefault();
        decreaseFontSize();
      }

      // Ctrl/Cmd + D: Toggle modo escuro
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        updateSetting('darkMode', !settings.darkMode);
      }

      // Alt + N: Foco na navegação
      if (event.altKey && event.key === 'n') {
        event.preventDefault();
        const nav = document.querySelector('[role="navigation"]');
        if (nav) nav.focus();
      }

      // Alt + C: Foco no conteúdo principal
      if (event.altKey && event.key === 'c') {
        event.preventDefault();
        const main = document.querySelector('main');
        if (main) main.focus();
      }

      // ESC: Fechar modais
      if (event.key === 'Escape') {
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          const closeButton = modal.querySelector('[aria-label="Close"]');
          if (closeButton) closeButton.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings, updateSetting, increaseFontSize, decreaseFontSize]);
}