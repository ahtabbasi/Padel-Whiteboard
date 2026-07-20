import { useCallback, useEffect, useState } from 'preact/hooks';
import type { DisplaySettings } from '../types';
import { loadSettings, saveSettings } from '../lib/settingsStorage';

export function useDisplaySettings() {
  const [settings, setSettings] = useState<DisplaySettings>(() => loadSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const toggle = useCallback((key: keyof DisplaySettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return { settings, toggle };
}
