// Leaflet map initialization
import { t, getLang } from './i18n.js';
import { navigate } from './router.js';
import { icons } from './ui.js';

export const CENTERS = [
  { id: 'ath', name: 'Κέντρο Υπηρεσιών Αθήνας', nameEn: 'Athens Service Center', addr: 'Ιερά Οδός 120, Αιγάλεω 12241', phone: '+30 210 000 0140', lat: 37.9988, lng: 23.6799 },
  { id: 'thes', name: 'Κέντρο Υπηρεσιών Θεσσαλονίκης', nameEn: 'Thessaloniki Service Center', addr: 'Μοναστηρίου 85, Θεσσαλονίκη 54627', phone: '+30 2310 000 140', lat: 40.6401, lng: 22.9269 },
  { id: 'pat', name: 'Κέντρο Υπηρεσιών Πάτρας', nameEn: 'Patras Service Center', addr: 'Λεωφόρος Αμαλίας 10, Πάτρα 26222', phone: '+30 2610 000 140', lat: 38.2444, lng: 21.7345 },
  { id: 'her', name: 'Κέντρο Υπηρεσιών Ηρακλείου', nameEn: 'Heraklion Service Center', addr: 'Λεωφόρος Κνωσού 15, Ηράκλειο 71409', phone: '+30 2810 000 140', lat: 35.3387, lng: 25.1442 },
];

let map = null;

export function initMap(containerId) {
  if (typeof L === 'undefined') { console.warn('Leaflet not loaded'); return; }
  if (map) { map.remove(); map = null; }
  map = L.map(containerId, { zoomControl: true, scrollWheelZoom: true }).setView([38.5, 23.5], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  const amberIcon = L.divIcon({
    className: 'atlas-marker',
    html: `<div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:#F5A623;border-radius:50%;border:3px solid #0F1316;box-shadow:0 2px 8px rgba(0,0,0,.3)">${icons.mapPin.replace('currentColor','#0F1316')}</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44]
  });

  CENTERS.forEach(c => {
    const marker = L.marker([c.lat, c.lng], { icon: amberIcon }).addTo(map);
    marker.bindPopup(`<div style="font-family:Inter,sans-serif;min-width:200px"><strong>${c.name}</strong><br>${c.addr}<br>${c.phone}<br><small>${t('map.hours')}</small></div>`);
    marker.on('click', () => {
      const panel = document.getElementById('center-info');
      if (panel) renderCenterInfo(panel, c);
    });
  });

  setTimeout(() => map?.invalidateSize(), 200);
}

export function renderCenterInfo(el, center) {
  el.innerHTML = `
    <div class="card fade-up" style="margin-bottom:16px">
      <h3>${center.name}</h3>
      <p style="margin-top:8px;color:var(--secondary)">${center.addr}</p>
      <p style="margin-top:4px;display:flex;align-items:center;gap:8px">${icons.phone} ${center.phone}</p>
      <p style="margin-top:4px;display:flex;align-items:center;gap:8px">${icons.clock} ${t('map.hours')}</p>
      <button class="btn btn-primary" style="margin-top:16px;width:100%" onclick="location.hash='#/request'">
        ${t('map.request')}
      </button>
    </div>`;
}

export function destroyMap() {
  if (map) { map.remove(); map = null; }
}
