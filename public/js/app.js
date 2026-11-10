// Atlas Inc. INDUSTRIAL — Main Entry Point
import { initDB, isDemo, getWishlist, addWishlistItem, removeWishlistItem } from './db.js';
import { getState, setState, subscribe, setTheme, toggleTheme } from './store.js';
import { registerRoute, navigate, initRouter, setBeforeEach } from './router.js';
import { t, getLang, setLang } from './i18n.js';
import { showToast, showModal, closeModal, icons } from './ui.js';
import { renderLogin, renderRegister, renderForgotPassword, checkSession, signOut, updateProfile, changePassword, deleteUserData } from './auth.js';
import { initFormValidation, handleSubmit, showSuccessModal, validateField } from './form.js';
import { initMap, destroyMap, CENTERS, renderCenterInfo } from './map.js';
import { PARTS, CATEGORIES, filterParts, getPartBySku } from './parts.js';
import { initPWA, promptInstall, isInstalled, isIOS } from './pwa.js';

const $ = sel => document.querySelector(sel);
const main = () => document.getElementById('main-content');
const guard = fn => (p) => {
  if (!getState().user) {
    navigate('#/login');
    return;
  }
  fn(p);
};

// ===== HEADER =====
function renderHeader() {
  const header = document.getElementById('top-header');
  if (!header) return;

  const state = getState();

  header.innerHTML = `
    <button class="header-back hidden" id="header-back" aria-label="Back">${icons.back}</button>
    <a href="#/home" class="header-brand">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      Atlas Inc.
    </a>
    <span class="header-spacer"></span>
    <div class="header-actions">
      <div class="lang-toggle">
        <button class="${getLang() === 'gr' ? 'active' : ''}" data-lang="gr">GR</button>
        <button class="${getLang() === 'en' ? 'active' : ''}" data-lang="en">EN</button>
      </div>
      <button class="theme-toggle" aria-label="Toggle theme">${state.theme === 'dark' ? icons.sun : icons.moon}</button>
      <a href="#/wishlist" class="avatar-btn" aria-label="${t('nav.wishlist')}">${icons.heart}</a>
      <a href="${state.user ? '#/settings' : '#/login'}" id="profile-btn" class="avatar-btn" aria-label="${state.user ? t('nav.settings') : t('nav.login')}">${icons.user}</a>
    </div>`;

  header.querySelector('.theme-toggle')?.addEventListener('click', () => {
    toggleTheme();
    renderHeader();
    renderNav();
  });

  header.querySelectorAll('.lang-toggle button').forEach(button => {
    button.addEventListener('click', () => {
      setLang(button.dataset.lang);
      setState({ lang: button.dataset.lang });
      renderHeader();
      renderNav();
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  });

  const backBtn = header.querySelector('#header-back');
  backBtn?.addEventListener('click', () => history.back());
}

// ===== NAV =====
function renderNav() {
  const state = getState();
  const wc = state.wishlist?.length || 0;
  const loggedIn = !!state.user;

  ['top-header', 'bottom-nav', 'sidebar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = loggedIn ? '' : 'none';
  });

  const items = [
    { route: '#/home', icon: icons.home, label: t('nav.home') },
    { route: '#/services', icon: icons.wrench, label: t('nav.services') },
    { route: '#/map', icon: icons.mapPin, label: t('nav.map') },
    { route: '#/request', icon: icons.clipboard, label: t('nav.request') },
    { route: '#/parts', icon: icons.package, label: t('nav.parts'), badge: wc > 0 ? wc : null },
  ];

  const html = items.map(item =>
    `<a href="${item.route}" class="nav-item" data-route="${item.route}">${item.icon}<span>${item.label}</span>${item.badge ? `<span class="badge">${item.badge}</span>` : ''}</a>`
  ).join('');

  const bottomNav = document.getElementById('bottom-nav');
  const sidebar = document.getElementById('sidebar');

  if (bottomNav) bottomNav.innerHTML = html;

  if (sidebar) {
    const extra = state.user
      ? `<a href="#/wishlist" class="nav-item" data-route="#/wishlist">${icons.heart}<span>${t('nav.wishlist')}</span>${wc > 0 ? `<span class="badge">${wc}</span>` : ''}</a><a href="#/settings" class="nav-item" data-route="#/settings">${icons.settings}<span>${t('nav.settings')}</span></a>`
      : `<a href="#/login" class="nav-item" data-route="#/login">${icons.user}<span>${t('nav.login')}</span></a>`;

    sidebar.innerHTML = html + '<div style="flex:1"></div>' + extra;
  }
}

// ===== PAGES =====
function renderHome(container) {
  container.innerHTML = `
    <div class="page">
      <div class="hero-section">
        <div class="hero-text">
          <p class="eyebrow fade-up">${t('home.eyebrow')}</p>
          <h1 class="fade-up" style="margin-top:8px">${t('home.title')}</h1>
          <p style="color:var(--secondary);margin-top:12px;font-size:17px" class="fade-up">${t('home.subtitle')}</p>
          <p class="caption fade-up" style="margin-top:16px">${t('home.badge')}</p>
          <a href="#/request" class="btn btn-primary fade-up" style="margin-top:24px">${t('home.cta')}</a>
        </div>
        <div class="hero-illustration fade-up">
          <svg viewBox="0 0 300 260" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:360px;opacity:.85">
            <circle cx="150" cy="130" r="80" stroke="var(--accent)" stroke-width="3" opacity=".3"/>
            <circle cx="150" cy="130" r="55" stroke="var(--accent)" stroke-width="2" opacity=".5"/>
            <circle cx="150" cy="130" r="20" fill="var(--accent)" opacity=".8"/>
            <rect x="146" y="30" width="8" height="30" rx="4" fill="var(--accent)" opacity=".6"/>
            <rect x="146" y="200" width="8" height="30" rx="4" fill="var(--accent)" opacity=".6"/>
            <rect x="50" y="126" width="30" height="8" rx="4" fill="var(--accent)" opacity=".6"/>
            <rect x="220" y="126" width="30" height="8" rx="4" fill="var(--accent)" opacity=".6"/>
            <rect x="85" y="60" width="8" height="25" rx="4" fill="var(--accent)" opacity=".4" transform="rotate(-45 89 72)"/>
            <rect x="207" y="175" width="8" height="25" rx="4" fill="var(--accent)" opacity=".4" transform="rotate(-45 211 187)"/>
            <rect x="207" y="60" width="8" height="25" rx="4" fill="var(--accent)" opacity=".4" transform="rotate(45 211 72)"/>
            <rect x="85" y="175" width="8" height="25" rx="4" fill="var(--accent)" opacity=".4" transform="rotate(45 89 187)"/>
          </svg>
        </div>
      </div>
      <div class="grid-3" style="margin-top:40px">
        <a href="#/services" class="card card-clickable fade-up" style="text-decoration:none;color:var(--text)">
          <div style="color:var(--accent);margin-bottom:12px">${icons.wrench}</div>
          <h3>${t('home.card.services')}</h3>
          <p class="caption" style="margin-top:4px">${t('svc.1.desc').split(',')[0]}</p>
        </a>
        <a href="#/map" class="card card-clickable fade-up" style="text-decoration:none;color:var(--text)">
          <div style="color:var(--accent);margin-bottom:12px">${icons.mapPin}</div>
          <h3>${t('home.card.map')}</h3>
          <p class="caption" style="margin-top:4px">4 ${getLang() === 'gr' ? 'κέντρα σε όλη την Ελλάδα' : 'centers across Greece'}</p>
        </a>
        <a href="#/parts" class="card card-clickable fade-up" style="text-decoration:none;color:var(--text)">
          <div style="color:var(--accent);margin-bottom:12px">${icons.package}</div>
          <h3>${t('home.card.parts')}</h3>
          <p class="caption" style="margin-top:4px">${PARTS.length}+ ${getLang() === 'gr' ? 'ανταλλακτικά' : 'spare parts'}</p>
        </a>
      </div>
    </div>
  `;
}

function renderServices(container) {
  const services = [
    { key: '1', icon: icons.settings },
    { key: '2', icon: icons.wrench },
    { key: '3', icon: icons.search },
  ];

  container.innerHTML = `<div class="page">
    <h2 class="fade-up">${t('svc.title')}</h2>
    <div class="grid-3" style="margin-top:24px">
      ${services.map(service => `
        <div class="accordion fade-up">
          <button class="accordion-header">
            <span style="color:var(--accent)">${service.icon}</span>
            <span style="font-weight:600">${t('svc.' + service.key + '.title')}</span>
            <span class="accordion-icon">${icons.chevDown}</span>
          </button>
          <div class="accordion-body"><div class="accordion-body-inner">
            <ul style="list-style:none;padding:0;margin:0 0 16px">
              ${t('svc.' + service.key + '.desc').split(', ').map(description => `<li style="padding:6px 0;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px"><span style="color:var(--accent)">${icons.check}</span>${description}</li>`).join('')}
            </ul>
            <a href="#/request?service=${service.key}" class="btn btn-primary" style="width:100%">${t('svc.request')}</a>
          </div></div>
        </div>`).join('')}
    </div>
  </div>`;

  container.querySelectorAll('.accordion-header').forEach(button =>
    button.addEventListener('click', () => button.closest('.accordion')?.classList.toggle('open'))
  );
}

function renderRequest(container, params) {
  const state = getState();
  const preService = params?.get('service') || '';
  const equipOptions = ['pump', 'motor', 'compressor', 'conveyor', 'cnc', 'other']
    .map(key => `<option value="${key}">${t('equip.' + key)}</option>`).join('');
  const serviceTypes = [
    { k: '1', l: t('svc.1.title') },
    { k: '2', l: t('svc.2.title') },
    { k: '3', l: t('svc.3.title') }
  ];
  const priorities = [
    { k: 'low', l: t('pri.low') },
    { k: 'medium', l: t('pri.medium') },
    { k: 'urgent', l: t('pri.urgent') }
  ];

  container.innerHTML = `<div class="page"><div class="split-layout">
    <div>
      <h2 class="fade-up">${t('req.title')}</h2>
      <form id="req-form" style="margin-top:24px">
        <div class="input-group fade-up"><label>${t('req.equipment')}</label><select class="input-field" id="req-equip" required><option value="">${t('req.select')}</option>${equipOptions}</select><div class="input-error"></div></div>
        <div class="input-group fade-up"><label>${t('req.service')}</label><div class="chip-group" data-name="service">${serviceTypes.map(service => `<button type="button" class="chip${preService === service.k ? ' active' : ''}" data-value="${service.k}">${service.l}</button>`).join('')}</div><div class="input-error"></div></div>
        <div class="input-group fade-up"><label>${t('req.desc')}</label><textarea class="input-field" id="req-desc" required minlength="10" rows="4"></textarea><div class="input-error"></div></div>
        <div class="input-group fade-up"><label>${t('req.priority')}</label><div class="chip-group" data-name="priority">${priorities.map(priority => `<button type="button" class="chip" data-value="${priority.k}">${priority.l}</button>`).join('')}</div><div class="input-error"></div></div>
        <div class="input-group fade-up"><label>${t('req.name')}</label><input class="input-field" id="req-name" required value="${state.user?.full_name || ''}"><div class="input-error"></div></div>
        <div class="input-group fade-up"><label>${t('req.email')}</label><input type="email" class="input-field" id="req-email" required value="${state.user?.email || ''}"><div class="input-error"></div></div>
        <div class="input-group fade-up"><label>${t('req.phone')}</label><input type="tel" class="input-field" id="req-phone" required><div class="input-error"></div></div>
        <div class="input-group fade-up"><label>${t('req.company')}</label><input class="input-field" id="req-company"><div class="input-error"></div></div>
        <button type="submit" class="btn btn-primary fade-up" style="width:100%" id="req-submit">${t('req.submit')}</button>
      </form>
    </div>
    <div class="sticky-summary" style="display:none"></div>
  </div></div>`;

  container.querySelectorAll('.chip-group').forEach(group => {
    group.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => {
      group.querySelectorAll('.chip').forEach(item => item.classList.remove('active'));
      chip.classList.add('active');
      chip.closest('.input-group')?.classList.remove('has-error');
    }));
  });

  const form = container.querySelector('#req-form');
  initFormValidation(form);

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!handleSubmit(form)) return;

    const button = container.querySelector('#req-submit');
    button.disabled = true;
    button.innerHTML = '<span class="spinner"></span>';

    await new Promise(resolve => setTimeout(resolve, 1500));

    button.disabled = false;
    button.textContent = t('req.submit');
    form.reset();
    showSuccessModal();
  });
}

function renderMap(container) {
  container.innerHTML = `<div class="page" style="max-width:100%;padding:0">
    <div style="padding:16px 16px 0"><h2 class="fade-up">${t('map.title')}</h2><p class="caption fade-up" style="margin-top:4px">${t('map.illustrative')}</p></div>
    <div class="map-layout" style="margin-top:16px">
      <div id="map-container"></div>
      <div id="center-info" class="info-panel">
        <h3 style="margin-bottom:16px">${t('map.title')}</h3>
        ${CENTERS.map(center => `<div class="card fade-up" style="margin-bottom:12px;cursor:pointer" data-center="${center.id}">
          <h3 style="font-size:15px">${center.name}</h3>
          <p class="caption">${center.addr}</p>
          <p class="caption">${center.phone}</p>
        </div>`).join('')}
      </div>
    </div>
  </div>`;

  container.querySelectorAll('[data-center]').forEach(element => element.addEventListener('click', () => {
    const center = CENTERS.find(item => item.id === element.dataset.center);
    if (center) renderCenterInfo(document.getElementById('center-info'), center);
  }));

  setTimeout(() => initMap('map-container'), 100);
}

function renderParts(container) {
  const state = getState();
  let search = '';
  let category = 'Όλα';

  function render() {
    const parts = filterParts(search, category);
    const partsList = parts.map(part => {
      const inWish = state.wishlist?.includes(part.sku);
      const availClass = part.avail === 'available' ? 'available' : part.avail === 'limited' ? 'limited' : 'order';
      const availLabel = t('parts.' + part.avail);

      return `<div class="card fade-up" style="position:relative">
        <button class="heart-btn" aria-pressed="${inWish}" data-sku="${part.sku}" aria-label="Wishlist" style="position:absolute;top:12px;right:12px">${icons.heart}</button>
        <p class="caption" style="margin-bottom:4px">${part.sku}</p>
        <h3 style="font-size:16px;padding-right:48px">${getLang() === 'gr' ? part.name : (part.nameEn || part.name)}</h3>
        <p class="caption" style="margin-top:4px">${part.category}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px">
          <span style="font-size:18px;font-weight:700;color:var(--accent)">€${part.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</span>
          <span class="avail-badge ${availClass}">${availLabel}</span>
        </div>
      </div>`;
    }).join('');

    const categoryChips = CATEGORIES.map(item =>
      `<button class="chip${item === category ? ' active' : ''}" data-cat="${item}">${item}</button>`
    ).join('');

    container.innerHTML = `<div class="page">
      <h2 class="fade-up">${t('parts.title')}</h2>
      <div class="input-group fade-up" style="margin-top:16px;margin-bottom:8px;position:relative">
        <span style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:var(--secondary)">${icons.search}</span>
        <input class="input-field" id="parts-search" placeholder="${t('parts.search')}" style="padding-left:48px" value="${search}">
      </div>
      <div class="chip-group fade-up" style="margin-bottom:16px" id="cat-chips">${categoryChips}</div>
      <div class="grid-3" id="parts-grid">${partsList || '<p class="empty-state">' + t('parts.search') + '</p>'}</div>
    </div>`;

    container.querySelector('#parts-search')?.addEventListener('input', event => {
      search = event.target.value;
      render();
    });

    container.querySelectorAll('#cat-chips .chip').forEach(chip =>
      chip.addEventListener('click', () => {
        category = chip.dataset.cat;
        render();
      })
    );

    container.querySelectorAll('.heart-btn').forEach(button => button.addEventListener('click', async () => {
      if (!state.user) {
        navigate('#/login?return=%23/parts');
        return;
      }

      const sku = button.dataset.sku;

      if (state.wishlist?.includes(sku)) {
        await removeWishlistItem(state.user.id, sku);
        setState({ wishlist: state.wishlist.filter(item => item !== sku) });
      } else {
        await addWishlistItem(state.user.id, sku);
        setState({ wishlist: [...(state.wishlist || []), sku] });
      }

      render();
      renderNav();
    }));
  }

  render();
}

function renderWishlist(container) {
  const state = getState();

  if (!state.user) {
    navigate('#/login?return=%23/wishlist');
    return;
  }

  const items = (state.wishlist || []).map(sku => getPartBySku(sku)).filter(Boolean);

  if (!items.length) {
    container.innerHTML = `<div class="page"><h2 class="fade-up">${t('wish.title')}</h2><div class="empty-state fade-up"><div style="font-size:48px;margin-bottom:16px">${icons.heart}</div><p>${t('wish.empty')}</p><a href="#/parts" class="btn btn-secondary" style="margin-top:16px">${t('parts.title')}</a></div></div>`;
    return;
  }

  container.innerHTML = `<div class="page"><h2 class="fade-up">${t('wish.title')}</h2><div style="margin-top:16px">
    ${items.map(part => `<div class="card fade-up" style="display:flex;align-items:center;gap:16px;margin-bottom:12px">
      <div style="flex:1">
        <p class="caption">${part.sku}</p>
        <h3 style="font-size:16px">${getLang() === 'gr' ? part.name : (part.nameEn || part.name)}</h3>
        <span style="font-weight:700;color:var(--accent)">€${part.price.toLocaleString('el-GR', { minimumFractionDigits: 2 })}</span>
      </div>
      <div style="display:flex;gap:8px">
        <a href="#/request" class="btn btn-secondary" style="height:40px;font-size:13px">${t('parts.quote')}</a>
        <button class="btn btn-ghost" data-remove="${part.sku}" style="height:40px;color:var(--error)">${icons.trash}</button>
      </div>
    </div>`).join('')}
  </div></div>`;

  container.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', async () => {
    await removeWishlistItem(state.user.id, button.dataset.remove);
    setState({ wishlist: state.wishlist.filter(sku => sku !== button.dataset.remove) });
    renderWishlist(container);
    renderNav();
  }));
}

function renderSettings(container) {
  const state = getState();

  if (!state.user) {
    navigate('#/login?return=%23/settings');
    return;
  }

  container.innerHTML = `<div class="page" style="max-width:520px;margin:0 auto">
    <h2 class="fade-up">${t('set.title')}</h2>
    <div class="card fade-up" style="margin-top:24px">
      <h3>${t('set.name')}</h3>
      <div class="input-group" style="margin-top:12px"><input class="input-field" id="set-name" value="${state.user?.full_name || ''}"></div>
      <button class="btn btn-primary" id="save-name" style="width:100%">${t('set.save')}</button>
    </div>
    <div class="card fade-up" style="margin-top:16px">
      <h3>${t('set.changePw')}</h3>
      <div class="input-group" style="margin-top:12px"><label>${t('set.currentPw')}</label><input type="password" class="input-field" id="set-curpw"></div>
      <div class="input-group"><label>${t('set.newPw')}</label><input type="password" class="input-field" id="set-newpw"></div>
      <div class="input-group"><label>${t('auth.confirmPw')}</label><input type="password" class="input-field" id="set-newpw2"></div>
      <button class="btn btn-primary" id="save-pw" style="width:100%">${t('set.save')}</button>
    </div>
    <div class="card fade-up" style="margin-top:16px;display:flex;align-items:center;justify-content:space-between">
      <div><h3>${t('set.theme')}</h3><p class="caption">${state.theme === 'dark' ? t('set.dark') : t('set.light')}</p></div>
      <button class="btn btn-secondary" id="toggle-theme-btn">${state.theme === 'dark' ? icons.sun : icons.moon}</button>
    </div>
    <div class="card fade-up" style="margin-top:16px;display:flex;align-items:center;justify-content:space-between">
      <div><h3>${t('set.lang')}</h3><p class="caption">${getLang() === 'gr' ? 'Ελληνικά' : 'English'}</p></div>
      <button class="btn btn-secondary" id="toggle-lang-btn">${getLang() === 'gr' ? 'EN' : 'GR'}</button>
    </div>
    <button class="btn btn-secondary fade-up" id="install-btn" style="width:100%;margin-top:16px;display:${isInstalled() ? 'none' : ''}">${icons.download} ${t('set.install')}</button>
    ${isIOS() && !isInstalled() ? '<p class="caption fade-up" style="text-align:center;margin-top:8px">iOS: Share → Add to Home Screen</p>' : ''}
    <button class="btn btn-secondary fade-up" id="logout-btn" style="width:100%;margin-top:16px">${icons.user} ${t('auth.logout')}</button>
    <button class="btn btn-danger fade-up" id="delete-btn" style="width:100%;margin-top:12px">${icons.trash} ${t('set.delete')}</button>
  </div>`;

  container.querySelector('#save-name')?.addEventListener('click', async () => {
    const name = container.querySelector('#set-name').value.trim();
    if (!name) return;

    await updateProfile({ full_name: name });
    state.user.full_name = name;
    setState({ user: state.user });
    showToast('✓', 'success');
  });

  container.querySelector('#save-pw')?.addEventListener('click', async () => {
    const currentPassword = container.querySelector('#set-curpw').value;
    const newPassword = container.querySelector('#set-newpw').value;
    const confirmPassword = container.querySelector('#set-newpw2').value;

    if (newPassword !== confirmPassword) {
      showToast(t('auth.pwMismatch'), 'error');
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      showToast('✓', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  container.querySelector('#toggle-theme-btn')?.addEventListener('click', () => {
    toggleTheme();
    renderSettings(container);
    renderHeader();
    renderNav();
  });

  container.querySelector('#toggle-lang-btn')?.addEventListener('click', () => {
    const newLanguage = getLang() === 'gr' ? 'en' : 'gr';
    setLang(newLanguage);
    setState({ lang: newLanguage });
    renderSettings(container);
    renderHeader();
    renderNav();
  });

  container.querySelector('#install-btn')?.addEventListener('click', promptInstall);

  container.querySelector('#logout-btn')?.addEventListener('click', async () => {
    await signOut();
    setState({ user: null, wishlist: [] });
    navigate('#/home');
    renderNav();
    renderHeader();
  });

  container.querySelector('#delete-btn')?.addEventListener('click', () => {
    const overlay = showModal(`<h3>${t('set.delete')}</h3><p style="margin:12px 0;color:var(--secondary)">${t('set.deleteConfirm')}</p><div style="display:flex;gap:12px;margin-top:20px"><button class="btn btn-secondary" style="flex:1" id="del-cancel">${t('set.cancel')}</button><button class="btn btn-danger" style="flex:1" id="del-confirm">${t('set.confirm')}</button></div>`);

    overlay.querySelector('#del-cancel')?.addEventListener('click', () => closeModal(overlay));

    overlay.querySelector('#del-confirm')?.addEventListener('click', async () => {
      await deleteUserData();
      setState({ user: null, wishlist: [] });
      closeModal(overlay);
      navigate('#/home');
      renderNav();
      renderHeader();
    });
  });
}

// ===== INIT =====
async function init() {
  setTheme(getState().theme);
  await initDB();
  await checkSession();

  renderHeader();
  renderNav();

  registerRoute('#/home', guard(() => renderHome(main())));
