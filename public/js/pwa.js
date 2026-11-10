// PWA: service worker registration + install prompt
let deferredPrompt = null;

export function initPWA() {
  // Register SW
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.warn('SW registration failed:', err));
  }
  // Install prompt
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById('install-btn');
    if (btn) btn.style.display = '';
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    const btn = document.getElementById('install-btn');
    if (btn) btn.style.display = 'none';
  });
}

export async function promptInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  }
}

export function isInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
}

export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
