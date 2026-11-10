// Spare parts data and logic
import { t } from './i18n.js';

export const PARTS = [
  { sku: 'PMP-001', name: 'Αντλία Κυκλοφορίας 2"', nameEn: 'Circulation Pump 2"', category: 'Αντλίες', price: 285, avail: 'available' },
  { sku: 'PMP-002', name: 'Αντλία Υψηλής Πίεσης 4"', nameEn: 'High Pressure Pump 4"', category: 'Αντλίες', price: 520, avail: 'limited' },
  { sku: 'MOT-001', name: 'Τριφασικός Κινητήρας 5.5kW', nameEn: 'Three-phase Motor 5.5kW', category: 'Κινητήρες', price: 890, avail: 'available' },
  { sku: 'MOT-002', name: 'Σερβοκινητήρας AC 2.2kW', nameEn: 'AC Servo Motor 2.2kW', category: 'Κινητήρες', price: 1240, avail: 'order' },
  { sku: 'CMP-001', name: 'Κοχλιωτός Συμπιεστής 11kW', nameEn: 'Screw Compressor 11kW', category: 'Συμπιεστές', price: 3200, avail: 'available' },
  { sku: 'CMP-002', name: 'Αεροσυμπιεστής Πιστονιών 7.5kW', nameEn: 'Piston Air Compressor 7.5kW', category: 'Συμπιεστές', price: 1850, avail: 'available' },
  { sku: 'CNV-001', name: 'Ταινία Μεταφοράς PVC 500mm', nameEn: 'PVC Conveyor Belt 500mm', category: 'Μεταφορικές ταινίες', price: 420, avail: 'available' },
  { sku: 'CNV-002', name: 'Κυλινδρική Ταινία Inox 300mm', nameEn: 'Inox Roller Conveyor 300mm', category: 'Μεταφορικές ταινίες', price: 680, avail: 'limited' },
  { sku: 'CNC-001', name: 'Τσοκ CNC Τόρνου 200mm', nameEn: 'CNC Lathe Chuck 200mm', category: 'CNC', price: 340, avail: 'available' },
  { sku: 'CNC-002', name: 'Σετ Εργαλείων Κοπής CNC', nameEn: 'CNC Cutting Tool Set', category: 'CNC', price: 195, avail: 'available' },
  { sku: 'GEN-001', name: 'Ρουλεμάν FAG 6205-2Z', nameEn: 'FAG 6205-2Z Bearing', category: 'Γενικά', price: 28.50, avail: 'available' },
  { sku: 'GEN-002', name: 'Ταινία Τεφλόν 25mm', nameEn: 'Teflon Tape 25mm', category: 'Γενικά', price: 12, avail: 'available' },
  { sku: 'GEN-003', name: 'Ελαστικός Σύνδεσμος Αξόνων', nameEn: 'Flexible Shaft Coupling', category: 'Γενικά', price: 85, avail: 'order' },
  { sku: 'MOT-003', name: 'Μειωτήρας Στροφών 1:20', nameEn: 'Speed Reducer 1:20', category: 'Κινητήρες', price: 645, avail: 'available' },
];

export const CATEGORIES = ['Όλα', 'Αντλίες', 'Κινητήρες', 'Συμπιεστές', 'Μεταφορικές ταινίες', 'CNC', 'Γενικά'];

export function filterParts(search = '', category = 'Όλα') {
  return PARTS.filter(p => {
    const matchCat = category === 'Όλα' || p.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.nameEn && p.nameEn.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });
}

export function getPartBySku(sku) {
  return PARTS.find(p => p.sku === sku) || null;
}
