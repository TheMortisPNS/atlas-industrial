// App State Store
const listeners = new Set();

const state = {
  user: null,
  wishlist: [],
  theme: localStorage.getItem('atlas-theme') || 'dark',
  lang: localStorage.getItem('atlas-lang') || 'gr',
};

export function getState() { return state; }

export function setState(partial) {
  Object.assign(state, partial);
  listeners.forEach(fn => { try { fn(state); } catch(e) { console.error(e); } });
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem('atlas-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  listeners.forEach(fn => { try { fn(state); } catch(e) { console.error(e); } });
}

export function toggleTheme() {
  setTheme(state.theme === 'dark' ? 'light' : 'dark');
}
