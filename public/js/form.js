// Request form logic
import { t } from './i18n.js';
import { showModal, icons } from './ui.js';
import { navigate } from './router.js';

export function validateField(input) {
  const group = input.closest('.input-group');
  if (!group) return true;
  const errEl = group.querySelector('.input-error');
  let msg = '';
  const val = input.value.trim();
  if (input.required && !val) msg = t('req.required');
  else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = t('req.invalidEmail');
  else if (input.type === 'tel' && val && !/^(\+30|0030)?[\s-]?[26][0-9]{2,4}[\s-]?[0-9]{3,7}$/.test(val.replace(/\s/g,''))) msg = t('req.invalidPhone');
  else if (input.tagName === 'TEXTAREA' && input.minLength && val.length < input.minLength) msg = t('req.min10');
  if (msg) {
    group.classList.add('has-error');
    input.classList.add('error');
    if (errEl) errEl.textContent = msg;
    return false;
  }
  group.classList.remove('has-error');
  input.classList.remove('error');
  return true;
}

export function initFormValidation(form) {
  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('blur', () => validateField(el));
  });
}

export function handleSubmit(form) {
  let valid = true;
  let firstInvalid = null;
  form.querySelectorAll('input[required], textarea[required], select[required]').forEach(el => {
    if (!validateField(el)) { valid = false; if (!firstInvalid) firstInvalid = el; }
  });
  // Check chips selections
  const serviceChips = form.querySelector('[data-name="service"]');
  const priorityChips = form.querySelector('[data-name="priority"]');
  if (serviceChips && !serviceChips.querySelector('.chip.active')) {
    valid = false;
    const g = serviceChips.closest('.input-group');
    if (g) { g.classList.add('has-error'); const e = g.querySelector('.input-error'); if(e) e.textContent = t('req.required'); }
  }
  if (priorityChips && !priorityChips.querySelector('.chip.active')) {
    valid = false;
    const g = priorityChips.closest('.input-group');
    if (g) { g.classList.add('has-error'); const e = g.querySelector('.input-error'); if(e) e.textContent = t('req.required'); }
  }
  if (!valid) {
    if (firstInvalid) firstInvalid.focus();
    return false;
  }
  return true;
}

export function showSuccessModal() {
  const overlay = showModal(`
    <div style="color:var(--success);margin-bottom:16px">${icons.check.replace('width="24"','width="48"').replace('height="24"','height="48"')}</div>
    <h2 style="margin-bottom:8px">${t('req.success')}</h2>
    <button class="btn btn-primary" style="margin-top:24px;width:100%" id="modal-home-btn">${t('req.back')}</button>
  `);
  const btn = overlay.querySelector('#modal-home-btn');
  if (btn) btn.addEventListener('click', () => { overlay.classList.remove('active'); setTimeout(() => overlay.remove(), 300); navigate('#/home'); });
}
