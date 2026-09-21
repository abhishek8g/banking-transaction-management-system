import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface Settings {
  immersiveMode: boolean;
  reduceMotion: boolean;
  disable3D: boolean;
  standardCursor: boolean;
  highContrast: boolean;
  soundEnabled: boolean;
  onboardingDone: boolean;
}

interface SettingsContextType {
  settings: Settings;
  set: (key: keyof Settings, value: boolean) => void;
  toggle: (key: keyof Settings) => void;
}

const defaults: Settings = {
  immersiveMode: false,
  reduceMotion: false,
  disable3D: false,
  standardCursor: false,
  highContrast: false,
  soundEnabled: false,
  onboardingDone: false,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const s = localStorage.getItem('bankingSettings');
      return s ? { ...defaults, ...JSON.parse(s) } : defaults;
    } catch { return defaults; }
  });

  useEffect(() => {
    localStorage.setItem('bankingSettings', JSON.stringify(settings));
    // Apply reduce-motion to document
    if (settings.reduceMotion) {
      document.documentElement.style.setProperty('--motion-duration', '0ms');
    } else {
      document.documentElement.style.setProperty('--motion-duration', '400ms');
    }
  }, [settings]);

  const set = (key: keyof Settings, value: boolean) =>
    setSettings(s => ({ ...s, [key]: value }));

  const toggle = (key: keyof Settings) =>
    setSettings(s => ({ ...s, [key]: !s[key] }));

  return (
    <SettingsContext.Provider value={{ settings, set, toggle }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
