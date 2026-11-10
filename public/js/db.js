// Database layer — Supabase or localStorage demo
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

let supabase = null;
export let isDemo = true;

export async function initDB() {
  if (SUPABASE_URL && !SUPABASE_URL.startsWith('YOUR_') && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.startsWith('YOUR_')) {
    try {
      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      isDemo = false;
    } catch (e) { console.warn('Supabase init failed, using demo mode', e); }
  }
  if (isDemo) seedDemoData();
}

function seedDemoData() {
  if (!localStorage.getItem('atlas-users')) {
    const users = [{ id: 'demo-1', email: 'demo@atlas.gr', full_name: 'Demo User', vat: '094259216', salt: '', hash: '' }];
    localStorage.setItem('atlas-users', JSON.stringify(users));
  }
}

// --- Auth helpers ---
async function hashPw(password, salt) {
  const enc = new TextEncoder();
  const data = enc.encode(salt + password);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function genSalt() { return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2); }

export async function signUp({ email, password, full_name, vat }) {
  if (!isDemo) {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name, vat } } });
    if (error) throw error;
    return data.user;
  }
  // Demo mode
  const users = JSON.parse(localStorage.getItem('atlas-users') || '[]');
  if (users.find(u => u.email === email)) throw new Error('User already exists');
  const salt = genSalt();
  const hash = await hashPw(password, salt);
  const user = { id: 'user-' + Date.now(), email, full_name, vat, salt, hash };
  users.push(user);
  localStorage.setItem('atlas-users', JSON.stringify(users));
  return user;
}

export async function signIn({ email, password }) {
  if (!isDemo) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }
  const users = JSON.parse(localStorage.getItem('atlas-users') || '[]');
  const user = users.find(u => u.email === email);
  if (!user) throw new Error('User not found');
  // First login for demo user (no hash set yet)
  if (!user.hash && email === 'demo@atlas.gr' && password === 'Demo1234!') {
    user.salt = genSalt();
    user.hash = await hashPw(password, user.salt);
    localStorage.setItem('atlas-users', JSON.stringify(users));
    localStorage.setItem('atlas-session', JSON.stringify(user));
    return user;
  }
  const hash = await hashPw(password, user.salt);
  if (hash !== user.hash) throw new Error('Invalid password');
  localStorage.setItem('atlas-session', JSON.stringify(user));
  return user;
}

export async function signOut() {
  if (!isDemo) { await supabase.auth.signOut(); return; }
  localStorage.removeItem('atlas-session');
}

export function getSession() {
  if (!isDemo) return supabase.auth.getSession().then(({ data }) => data?.session);
  const u = localStorage.getItem('atlas-session');
  return Promise.resolve(u ? JSON.parse(u) : null);
}

export function getUser() {
  if (!isDemo) return supabase.auth.getUser().then(({ data }) => data?.user);
  const u = localStorage.getItem('atlas-session');
  return Promise.resolve(u ? JSON.parse(u) : null);
}

export async function updateProfile({ full_name }) {
  if (!isDemo) {
    const { error } = await supabase.from('profiles').update({ full_name }).eq('id', (await getUser()).id);
    if (error) throw error;
    return;
  }
  const session = JSON.parse(localStorage.getItem('atlas-session') || 'null');
  if (!session) return;
  session.full_name = full_name;
  localStorage.setItem('atlas-session', JSON.stringify(session));
  const users = JSON.parse(localStorage.getItem('atlas-users') || '[]');
  const u = users.find(x => x.id === session.id);
  if (u) { u.full_name = full_name; localStorage.setItem('atlas-users', JSON.stringify(users)); }
}

export async function changePassword({ currentPassword, newPassword }) {
  if (!isDemo) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return;
  }
  const session = JSON.parse(localStorage.getItem('atlas-session') || 'null');
  if (!session) throw new Error('Not logged in');
  const users = JSON.parse(localStorage.getItem('atlas-users') || '[]');
  const user = users.find(u => u.id === session.id);
  if (!user) throw new Error('User not found');
  const hash = await hashPw(currentPassword, user.salt);
  if (hash !== user.hash) throw new Error('Current password is incorrect');
  user.salt = genSalt();
  user.hash = await hashPw(newPassword, user.salt);
  localStorage.setItem('atlas-users', JSON.stringify(users));
}

export async function deleteUserData() {
  if (!isDemo) {
    const user = await getUser();
    await supabase.from('wishlist_items').delete().eq('user_id', user.id);
    await supabase.from('profiles').delete().eq('id', user.id);
    await signOut();
    return;
  }
  const session = JSON.parse(localStorage.getItem('atlas-session') || 'null');
  if (!session) return;
  const users = JSON.parse(localStorage.getItem('atlas-users') || '[]').filter(u => u.id !== session.id);
  localStorage.setItem('atlas-users', JSON.stringify(users));
  localStorage.removeItem('atlas-session');
  localStorage.removeItem('atlas-wishlist-' + session.id);
}

// --- Wishlist ---
export async function getWishlist(userId) {
  if (!isDemo) {
    const { data } = await supabase.from('wishlist_items').select('part_sku').eq('user_id', userId);
    return (data || []).map(d => d.part_sku);
  }
  return JSON.parse(localStorage.getItem('atlas-wishlist-' + userId) || '[]');
}

export async function addWishlistItem(userId, sku) {
  if (!isDemo) {
    await supabase.from('wishlist_items').upsert({ user_id: userId, part_sku: sku });
    return;
  }
  const list = JSON.parse(localStorage.getItem('atlas-wishlist-' + userId) || '[]');
  if (!list.includes(sku)) { list.push(sku); localStorage.setItem('atlas-wishlist-' + userId, JSON.stringify(list)); }
}

export async function removeWishlistItem(userId, sku) {
  if (!isDemo) {
    await supabase.from('wishlist_items').delete().eq('user_id', userId).eq('part_sku', sku);
    return;
  }
  const list = JSON.parse(localStorage.getItem('atlas-wishlist-' + userId) || '[]').filter(s => s !== sku);
  localStorage.setItem('atlas-wishlist-' + userId, JSON.stringify(list));
}

// Forgot password (demo only, Supabase uses its own flow)
let demoOTP = null;
export function sendDemoOTP(email) {
  const users = JSON.parse(localStorage.getItem('atlas-users') || '[]');
  if (!users.find(u => u.email === email)) throw new Error('User not found');
  demoOTP = { email, code: String(Math.floor(100000 + Math.random() * 900000)) };
  return demoOTP.code;
}

export function verifyDemoOTP(code) {
  if (!demoOTP || demoOTP.code !== code) throw new Error('Invalid code');
  return demoOTP.email;
}

export async function resetDemoPassword(email, newPassword) {
  const users = JSON.parse(localStorage.getItem('atlas-users') || '[]');
  const user = users.find(u => u.email === email);
  if (!user) throw new Error('User not found');
  user.salt = genSalt();
  user.hash = await hashPw(newPassword, user.salt);
  localStorage.setItem('atlas-users', JSON.stringify(users));
  demoOTP = null;
}
