import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(undefined);

export function SettingsProvider({ children }) {
  // Carregar configurações salvas do localStorage
  const [settings, setSettings] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        darkMode: false,
        autoTheme: false,
        fontSize: 'medium',
        lineHeight: 'normal',
        highContrast: false,
        reduceMotion: false,
        screenReader: false,
        language: 'pt-BR',
        soundNotifications: true,
        pushNotifications: true,
        emailNotifications: true,
        dataSaver: false,
        colorTheme: 'default'
      };
    }
    
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      darkMode: false,
      autoTheme: false, // Seguir o sistema
      fontSize: 'medium', // small, medium, large, xlarge
      lineHeight: 'normal', // compact, normal, relaxed
      highContrast: false,
      reduceMotion: false,
      screenReader: false,
      language: 'pt-BR',
      soundNotifications: true,
      pushNotifications: true,
      emailNotifications: true,
      dataSaver: false,
      colorTheme: 'default' // default, blue, green, purple, orange
    };
  });

  // Salvar no localStorage quando mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      applySettings(settings);
    }
  }, [settings]);

  // Detectar preferência do sistema para modo escuro
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (settings.autoTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const root = document.documentElement;
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      
      handleChange(mediaQuery);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.autoTheme]);

  // Aplicar configurações ao documento
  const applySettings = (settings) => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    
    // Modo Escuro (apenas se não estiver em modo automático)
    if (!settings.autoTheme) {
      if (settings.darkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Tamanho de Fonte
    root.setAttribute('data-font-size', settings.fontSize);
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px'
    };
    root.style.fontSize = fontSizes[settings.fontSize];

    // Espaçamento de Linha
    root.setAttribute('data-line-height', settings.lineHeight);
    const lineHeights = {
      compact: '1.4',
      normal: '1.6',
      relaxed: '1.8'
    };
    root.style.lineHeight = lineHeights[settings.lineHeight];

    // Alto Contraste
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduzir Animações
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Economia de Dados
    if (settings.dataSaver) {
      root.classList.add('data-saver');
    } else {
      root.classList.remove('data-saver');
    }

    // Tema de Cor
    root.setAttribute('data-color-theme', settings.colorTheme);
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetSettings = () => {
    const defaults = {
      darkMode: false,
      autoTheme: false,
      fontSize: 'medium',
      lineHeight: 'normal',
      highContrast: false,
      reduceMotion: false,
      screenReader: false,
      language: 'pt-BR',
      soundNotifications: true,
      pushNotifications: true,
      emailNotifications: true,
      dataSaver: false,
      colorTheme: 'default'
    };
    setSettings(defaults);
  };

  const increaseFontSize = () => {
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    if (currentIndex < sizes.length - 1) {
      updateSetting('fontSize', sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    if (currentIndex > 0) {
      updateSetting('fontSize', sizes[currentIndex - 1]);
    }
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      resetSettings,
      increaseFontSize,
      decreaseFontSize
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}