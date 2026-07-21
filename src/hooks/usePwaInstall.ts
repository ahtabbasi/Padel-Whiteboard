import { useCallback, useEffect, useState } from 'preact/hooks';
import {
  canShowAutoPrompt,
  recordDismiss,
  recordPromptShown,
  resetInstallPromptState,
} from '../lib/installPromptStorage';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_TOAST =
  'You can add this app to your home screen anytime from the Boards menu.';

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isMobileDevice(): boolean {
  return window.matchMedia('(pointer: coarse)').matches;
}

function isIos(): boolean {
  const ua = navigator.userAgent;
  const isAppleMobile = /iPad|iPhone|iPod/.test(ua);
  const isIpadOs =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isAppleMobile || isIpadOs;
}

export function usePwaInstall() {
  const [isInstalled, setIsInstalled] = useState(isStandalone);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [iosInstructionsOpen, setIosInstructionsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isMobile = isMobileDevice();
  const ios = isIos();
  const canInstall = isMobile && !isInstalled && (!!deferredPrompt || ios);
  const showAutoPrompt =
    canInstall && canShowAutoPrompt() && !bannerDismissed;

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setBannerDismissed(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    recordPromptShown();
    setBannerDismissed(true);

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      return;
    }

    if (ios) {
      setIosInstructionsOpen(true);
    }
  }, [deferredPrompt, ios]);

  const dismissAutoPrompt = useCallback(() => {
    recordDismiss();
    setBannerDismissed(true);
    setToastMessage(DISMISS_TOAST);
  }, []);

  const resetPromptState = useCallback(() => {
    resetInstallPromptState();
    setBannerDismissed(false);
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const closeIosInstructions = useCallback(() => {
    setIosInstructionsOpen(false);
  }, []);

  return {
    showInstallOption: canInstall,
    showAutoPrompt,
    install,
    dismissAutoPrompt,
    resetPromptState,
    iosInstructionsOpen,
    closeIosInstructions,
    toastMessage,
    clearToast,
  };
}
