// Hash-based SPA router
const routes = {};
let currentRoute = null;
let beforeEach = null;

export function registerRoute(hash, handler) {
  routes[hash] = handler;
}

export function setBeforeEach(fn) { beforeEach = fn; }

export function navigate(hash) {
  window.location.hash = hash;
}

function resolve() {
  const raw = window.location.hash || '#/home';
  const [path, query] = raw.split('?');
  const params = new URLSearchParams(query || '');
  const handler = routes[path] || routes['#/home'];
  if (!handler) return;
  if (beforeEach) {
    const result = beforeEach(path, params);
    if (result === false) return;
  }
  currentRoute = path;
  handler(params);
  window.scrollTo(0, 0);
  updateNav(path);
}

function updateNav(path) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.route === path);
  });
  // back button visibility
  const backBtn = document.getElementById('header-back');
  if (backBtn) {
    backBtn.classList.toggle('hidden', path === '#/home');
  }
}

export function getCurrentRoute() { return currentRoute; }

export function initRouter() {
  window.addEventListener('hashchange', resolve);
  resolve();
}
