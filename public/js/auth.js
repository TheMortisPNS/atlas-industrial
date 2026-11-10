// Auth UI logic
import { t } from './i18n.js';
import { getState, setState } from './store.js';
import { signIn, signUp, signOut, getUser, isDemo, sendDemoOTP, verifyDemoOTP, resetDemoPassword, updateProfile, changePassword, deleteUserData, getWishlist } from './db.js';
import { showToast, icons } from './ui.js';
import { navigate } from './router.js';

export function validateAFM(afm) {
  return /^\d{9}$/.test(afm) && afm !== '000000000';
}

function pwStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-zA-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  return s;
}

export async function checkSession() {
  try {
    const user = await getUser();
    if (user) {
      setState({ user });
      const wl = await getWishlist(user.id);
      setState({ wishlist: wl || [] });
    }
  } catch(e) { console.warn('Session check failed', e); }
}

export { signOut, updateProfile, changePassword, deleteUserData };

export function renderLogin(container) {
  container.innerHTML = `
    <div class="page" style="max-width:420px;margin:0 auto">
      <h2 class="fade-up">${t('auth.login')}</h2>
      <p class="caption fade-up" style="margin:8px 0 24px">${isDemo ? t('auth.demoMode') : t('auth.supaMode')}</p>
      <form id="login-form">
        <div class="input-group fade-up">
          <label for="login-email">${t('auth.email')}</label>
          <input type="email" id="login-email" class="input-field" required autocomplete="email">
          <div class="input-error"></div>
        </div>
        <div class="input-group fade-up">
          <label for="login-pw">${t('auth.password')}</label>
          <div style="position:relative">
            <input type="password" id="login-pw" class="input-field" required autocomplete="current-password">
            <button type="button" class="btn-ghost" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);padding:8px" id="login-pw-toggle">${icons.eye}</button>
          </div>
          <div class="input-error"></div>
        </div>
        <button type="submit" class="btn btn-primary fade-up" style="width:100%;margin-top:8px" id="login-submit">${t('auth.login')}</button>
      </form>
      <button class="btn btn-secondary fade-up" style="width:100%;margin-top:12px" id="demo-btn">${t('auth.demo')}</button>
      <div style="text-align:center;margin-top:16px" class="fade-up">
        <a href="#/register" style="font-size:14px">${t('auth.noAccount')} ${t('auth.register')}</a>
      </div>
      <div style="text-align:center;margin-top:8px" class="fade-up">
        <a href="#/forgot-password" style="font-size:14px">${t('auth.forgot')}</a>
      </div>
    </div>`;
  const form = container.querySelector('#login-form');
  const pwToggle = container.querySelector('#login-pw-toggle');
  const pwInput = container.querySelector('#login-pw');
  pwToggle?.addEventListener('click', () => { pwInput.type = pwInput.type === 'password' ? 'text' : 'password'; pwToggle.innerHTML = pwInput.type === 'password' ? icons.eye : icons.eyeOff; });
  container.querySelector('#demo-btn')?.addEventListener('click', () => {
    container.querySelector('#login-email').value = 'demo@atlas.gr';
    pwInput.value = 'Demo1234!';
  });
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = container.querySelector('#login-submit');
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
    try {
      const user = await signIn({ email: container.querySelector('#login-email').value, password: pwInput.value });
      setState({ user });
      const wl = await getWishlist(user.id);
      setState({ wishlist: wl || [] });
      showToast(t('auth.login') + ' ✓', 'success');
      const ret = new URLSearchParams(location.hash.split('?')[1] || '').get('return');
      navigate(ret || '#/home');
    } catch(err) {
      showToast(err.message || 'Error', 'error');
    } finally { btn.disabled = false; btn.textContent = t('auth.login'); }
  });
}

export function renderRegister(container) {
  container.innerHTML = `
    <div class="page" style="max-width:420px;margin:0 auto">
      <h2 class="fade-up">${t('auth.register')}</h2>
      <p class="caption fade-up" style="margin:8px 0 24px">${isDemo ? t('auth.demoMode') : t('auth.supaMode')}</p>
      <form id="reg-form">
        <div class="input-group fade-up"><label>${t('auth.name')}</label><input type="text" class="input-field" id="reg-name" required><div class="input-error"></div></div>
        <div class="input-group fade-up"><label>${t('auth.email')}</label><input type="email" class="input-field" id="reg-email" required><div class="input-error"></div></div>
        <div class="input-group fade-up"><label>${t('auth.vat')} (ΑΦΜ)</label><input type="text" class="input-field" id="reg-vat" required maxlength="9" pattern="[0-9]{9}" inputmode="numeric"><div class="input-error"></div></div>
        <div class="input-group fade-up">
          <label>${t('auth.password')}</label>
          <div style="position:relative">
            <input type="password" class="input-field" id="reg-pw" required minlength="8">
            <button type="button" class="btn-ghost" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);padding:8px" id="reg-pw-toggle">${icons.eye}</button>
          </div>
          <div class="pw-meter" data-level="0"><span></span><span></span><span></span><span></span></div>
          <div class="input-error"></div>
        </div>
        <div class="input-group fade-up"><label>${t('auth.confirmPw')}</label><input type="password" class="input-field" id="reg-pw2" required><div class="input-error"></div></div>
        <button type="submit" class="btn btn-primary fade-up" style="width:100%;margin-top:8px" id="reg-submit">${t('auth.register')}</button>
      </form>
      <div style="text-align:center;margin-top:16px" class="fade-up">
        <a href="#/login" style="font-size:14px">${t('auth.hasAccount')} ${t('auth.login')}</a>
      </div>
    </div>`;
  const pw = container.querySelector('#reg-pw');
  const meter = container.querySelector('.pw-meter');
  pw?.addEventListener('input', () => { meter.dataset.level = pwStrength(pw.value); });
  const pwToggle = container.querySelector('#reg-pw-toggle');
  pwToggle?.addEventListener('click', () => { pw.type = pw.type === 'password' ? 'text' : 'password'; pwToggle.innerHTML = pw.type === 'password' ? icons.eye : icons.eyeOff; });
  container.querySelector('#reg-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const name = container.querySelector('#reg-name').value.trim();
    const email = container.querySelector('#reg-email').value.trim();
    const vat = container.querySelector('#reg-vat').value.trim();
    const pw1 = pw.value;
    const pw2 = container.querySelector('#reg-pw2').value;
    if (!validateAFM(vat)) { showToast(t('auth.vatInvalid'), 'error'); return; }
    if (pw1 !== pw2) { showToast(t('auth.pwMismatch'), 'error'); return; }
    if (pwStrength(pw1) < 2) { showToast(t('auth.pwWeak'), 'error'); return; }
    const btn = container.querySelector('#reg-submit');
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
    try {
      const user = await signUp({ email, password: pw1, full_name: name, vat });
      // Auto-login after registration
      const loggedIn = await signIn({ email, password: pw1 });
      setState({ user: loggedIn });
      showToast(t('auth.register') + ' ✓', 'success');
      navigate('#/home');
    } catch(err) { showToast(err.message || 'Error', 'error'); }
    finally { btn.disabled = false; btn.textContent = t('auth.register'); }
  });
}

export function renderForgotPassword(container) {
  let step = 1, otpEmail = '', demoCode = '';
  function render() {
    if (step === 1) {
      container.innerHTML = `<div class="page" style="max-width:420px;margin:0 auto">
        <h2 class="fade-up">${t('forgot.title')}</h2>
        <form id="forgot-form" style="margin-top:24px">
          <div class="input-group fade-up"><label>${t('auth.email')}</label><input type="email" class="input-field" id="forgot-email" required><div class="input-error"></div></div>
          <button type="submit" class="btn btn-primary fade-up" style="width:100%">${t('forgot.send')}</button>
        </form></div>`;
      container.querySelector('#forgot-form')?.addEventListener('submit', e => {
        e.preventDefault();
        otpEmail = container.querySelector('#forgot-email').value.trim();
        try { demoCode = sendDemoOTP(otpEmail); step = 2; render(); } catch(err) { showToast(err.message, 'error'); }
      });
    } else if (step === 2) {
      container.innerHTML = `<div class="page" style="max-width:420px;margin:0 auto">
        <h2 class="fade-up">${t('forgot.code')}</h2>
        ${isDemo ? `<div class="card fade-up" style="margin:16px 0;text-align:center;border-color:var(--accent)"><p class="eyebrow">${t('forgot.demo')}</p><p style="font-size:28px;font-weight:700;letter-spacing:8px;margin-top:8px">${demoCode}</p></div>` : ''}
        <form id="otp-form" style="margin-top:24px">
          <div class="input-group fade-up"><label>${t('forgot.code')}</label><input type="text" class="input-field" id="otp-code" required maxlength="6" inputmode="numeric" style="text-align:center;letter-spacing:8px;font-size:24px"><div class="input-error"></div></div>
          <button type="submit" class="btn btn-primary fade-up" style="width:100%">${t('forgot.verify')}</button>
        </form></div>`;
      container.querySelector('#otp-form')?.addEventListener('submit', e => {
        e.preventDefault();
        try { verifyDemoOTP(container.querySelector('#otp-code').value.trim()); step = 3; render(); } catch(err) { showToast(err.message, 'error'); }
      });
    } else {
      container.innerHTML = `<div class="page" style="max-width:420px;margin:0 auto">
        <h2 class="fade-up">${t('forgot.newPw')}</h2>
        <form id="reset-form" style="margin-top:24px">
          <div class="input-group fade-up"><label>${t('forgot.newPw')}</label><input type="password" class="input-field" id="reset-pw" required minlength="8"><div class="input-error"></div></div>
          <div class="input-group fade-up"><label>${t('auth.confirmPw')}</label><input type="password" class="input-field" id="reset-pw2" required><div class="input-error"></div></div>
          <button type="submit" class="btn btn-primary fade-up" style="width:100%">${t('forgot.reset')}</button>
        </form></div>`;
      container.querySelector('#reset-form')?.addEventListener('submit', async e => {
        e.preventDefault();
        const pw1 = container.querySelector('#reset-pw').value;
        const pw2 = container.querySelector('#reset-pw2').value;
        if (pw1 !== pw2) { showToast(t('auth.pwMismatch'), 'error'); return; }
        try { await resetDemoPassword(otpEmail, pw1); showToast('✓', 'success'); navigate('#/login'); } catch(err) { showToast(err.message, 'error'); }
      });
    }
  }
  render();
}
