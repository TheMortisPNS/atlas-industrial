// i18n — GR/EN dictionary
const dict = {
  // Nav
  'nav.home': { gr: 'Αρχική', en: 'Home' },
  'nav.services': { gr: 'Υπηρεσίες', en: 'Services' },
  'nav.map': { gr: 'Χάρτης', en: 'Map' },
  'nav.request': { gr: 'Αίτημα', en: 'Request' },
  'nav.parts': { gr: 'Ανταλλακτικά', en: 'Parts' },
  'nav.wishlist': { gr: 'Αγαπημένα', en: 'Wishlist' },
  'nav.settings': { gr: 'Ρυθμίσεις', en: 'Settings' },
  'nav.login': { gr: 'Σύνδεση', en: 'Login' },
  'nav.register': { gr: 'Εγγραφή', en: 'Register' },
  // Home
  'home.eyebrow': { gr: 'ΤΕΧΝΟΛΟΓΙΚΕΣ ΥΠΗΡΕΣΙΕΣ', en: 'TECHNOLOGY SERVICES' },
  'home.title': { gr: 'Συντήρηση Βιομηχανικού Εξοπλισμού', en: 'Industrial Equipment Maintenance' },
  'home.subtitle': { gr: 'Προληπτική συντήρηση, επισκευές και τεχνική διάγνωση για την εγκατάστασή σας.', en: 'Preventive maintenance, repairs and technical diagnostics for your facility.' },
  'home.cta': { gr: 'Αίτημα Υποστήριξης', en: 'Support Request' },
  'home.badge': { gr: 'ΤΕΧΝΙΚΗ ΕΞΕΙΔΙΚΕΥΣΗ 01/03', en: 'TECHNICAL EXPERTISE 01/03' },
  'home.card.services': { gr: 'Υπηρεσίες Συντήρησης', en: 'Maintenance Services' },
  'home.card.map': { gr: 'Κέντρα Εξυπηρέτησης', en: 'Service Centers' },
  'home.card.parts': { gr: 'Ανταλλακτικά', en: 'Spare Parts' },
  // Services
  'svc.title': { gr: 'Υπηρεσίες Συντήρησης', en: 'Maintenance Services' },
  'svc.1.title': { gr: '01 Προληπτική Συντήρηση', en: '01 Preventive Maintenance' },
  'svc.1.desc': { gr: 'Περιοδικοί έλεγχοι, Λίπανση, Βαθμονόμηση, Μείωση χρόνου διακοπής', en: 'Periodic inspections, Lubrication, Calibration, Downtime reduction' },
  'svc.2.title': { gr: '02 Επισκευές', en: '02 Repairs' },
  'svc.2.desc': { gr: 'Αποκατάσταση βλαβών, Αντικατάσταση ανταλλακτικών, Επιτόπια επέμβαση', en: 'Fault restoration, Parts replacement, On-site intervention' },
  'svc.3.title': { gr: '03 Τεχνική Διάγνωση', en: '03 Technical Diagnostics' },
  'svc.3.desc': { gr: 'Ανάλυση βλαβών, Μετρήσεις κραδασμών και θερμοκρασίας, Τεχνική έκθεση', en: 'Fault analysis, Vibration & temperature measurements, Technical report' },
  'svc.request': { gr: 'Αίτημα για αυτή την υπηρεσία', en: 'Request this service' },
  // Request form
  'req.title': { gr: 'Αίτημα Υποστήριξης', en: 'Support Request' },
  'req.equipment': { gr: 'Τύπος εξοπλισμού', en: 'Equipment type' },
  'req.service': { gr: 'Τύπος υπηρεσίας', en: 'Service type' },
  'req.desc': { gr: 'Περιγραφή προβλήματος', en: 'Problem description' },
  'req.priority': { gr: 'Προτεραιότητα', en: 'Priority' },
  'req.name': { gr: 'Ονοματεπώνυμο', en: 'Full name' },
  'req.email': { gr: 'Email', en: 'Email' },
  'req.phone': { gr: 'Τηλέφωνο', en: 'Phone' },
  'req.company': { gr: 'Εταιρεία (προαιρετικά)', en: 'Company (optional)' },
  'req.submit': { gr: 'Υποβολή Αιτήματος', en: 'Submit Request' },
  'req.success': { gr: 'Το αίτημά σας υποβλήθηκε επιτυχώς (Προσομοίωση)', en: 'Your request was submitted successfully (Simulation)' },
  'req.back': { gr: 'Επιστροφή στην Αρχική', en: 'Back to Home' },
  'req.select': { gr: 'Επιλέξτε...', en: 'Select...' },
  'req.required': { gr: 'Υποχρεωτικό πεδίο', en: 'Required field' },
  'req.min10': { gr: 'Τουλάχιστον 10 χαρακτήρες', en: 'Minimum 10 characters' },
  'req.invalidEmail': { gr: 'Μη έγκυρο email', en: 'Invalid email' },
  'req.invalidPhone': { gr: 'Μη έγκυρο τηλέφωνο', en: 'Invalid phone' },
  // Equipment
  'equip.pump': { gr: 'Αντλία', en: 'Pump' },
  'equip.motor': { gr: 'Κινητήρας', en: 'Motor' },
  'equip.compressor': { gr: 'Συμπιεστής', en: 'Compressor' },
  'equip.conveyor': { gr: 'Μεταφορική ταινία', en: 'Conveyor belt' },
  'equip.cnc': { gr: 'CNC', en: 'CNC' },
  'equip.other': { gr: 'Άλλο', en: 'Other' },
  // Priority
  'pri.low': { gr: 'Χαμηλή', en: 'Low' },
  'pri.medium': { gr: 'Μεσαία', en: 'Medium' },
  'pri.urgent': { gr: 'Επείγουσα', en: 'Urgent' },
  // Map
  'map.title': { gr: 'Κέντρα Εξυπηρέτησης', en: 'Service Centers' },
  'map.hours': { gr: 'Δευ-Παρ 08:00-18:00', en: 'Mon-Fri 08:00-18:00' },
  'map.request': { gr: 'Αίτημα Υποστήριξης εδώ', en: 'Support Request here' },
  'map.illustrative': { gr: 'Ενδεικτικά δεδομένα', en: 'Illustrative data' },
  // Parts
  'parts.title': { gr: 'Ανταλλακτικά', en: 'Spare Parts' },
  'parts.search': { gr: 'Αναζήτηση ανταλλακτικών...', en: 'Search parts...' },
  'parts.all': { gr: 'Όλα', en: 'All' },
  'parts.available': { gr: 'Διαθέσιμο', en: 'Available' },
  'parts.limited': { gr: 'Περιορισμένο', en: 'Limited' },
  'parts.order': { gr: 'Κατ\'παραγγελία', en: 'Made to order' },
  'parts.quote': { gr: 'Αίτημα προσφοράς', en: 'Request quote' },
  // Wishlist
  'wish.title': { gr: 'Αγαπημένα', en: 'Wishlist' },
  'wish.empty': { gr: 'Δεν έχετε αγαπημένα ακόμα.', en: 'No favorites yet.' },
  'wish.remove': { gr: 'Αφαίρεση', en: 'Remove' },
  'wish.login': { gr: 'Συνδεθείτε για να δείτε τα αγαπημένα σας.', en: 'Login to see your favorites.' },
  // Auth
  'auth.login': { gr: 'Σύνδεση', en: 'Login' },
  'auth.register': { gr: 'Εγγραφή', en: 'Register' },
  'auth.logout': { gr: 'Αποσύνδεση', en: 'Logout' },
  'auth.email': { gr: 'Email', en: 'Email' },
  'auth.password': { gr: 'Κωδικός', en: 'Password' },
  'auth.confirmPw': { gr: 'Επιβεβαίωση κωδικού', en: 'Confirm password' },
  'auth.name': { gr: 'Ονοματεπώνυμο', en: 'Full name' },
  'auth.vat': { gr: 'ΑΦΜ', en: 'VAT number' },
  'auth.noAccount': { gr: 'Δεν έχετε λογαριασμό;', en: 'No account?' },
  'auth.hasAccount': { gr: 'Έχετε λογαριασμό;', en: 'Have an account?' },
  'auth.forgot': { gr: 'Ξεχάσατε τον κωδικό;', en: 'Forgot password?' },
  'auth.demo': { gr: 'Χρήση demo λογαριασμού', en: 'Use demo account' },
  'auth.demoMode': { gr: 'Λειτουργία Demo (τοπικά δεδομένα)', en: 'Demo mode (local data)' },
  'auth.supaMode': { gr: 'Λειτουργία Supabase', en: 'Supabase mode' },
  'auth.vatInvalid': { gr: 'Μη έγκυρο ΑΦΜ', en: 'Invalid VAT' },
  'auth.pwMismatch': { gr: 'Οι κωδικοί δεν ταιριάζουν', en: 'Passwords do not match' },
  'auth.pwWeak': { gr: 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες, 1 γράμμα και 1 αριθμό', en: 'Password must have at least 8 characters, 1 letter and 1 number' },
  // Settings
  'set.title': { gr: 'Ρυθμίσεις', en: 'Settings' },
  'set.name': { gr: 'Αλλαγή ονόματος', en: 'Change name' },
  'set.changePw': { gr: 'Αλλαγή κωδικού', en: 'Change password' },
  'set.currentPw': { gr: 'Τρέχων κωδικός', en: 'Current password' },
  'set.newPw': { gr: 'Νέος κωδικός', en: 'New password' },
  'set.lang': { gr: 'Γλώσσα', en: 'Language' },
  'set.theme': { gr: 'Θέμα', en: 'Theme' },
  'set.dark': { gr: 'Σκοτεινό', en: 'Dark' },
  'set.light': { gr: 'Φωτεινό', en: 'Light' },
  'set.install': { gr: 'Εγκατάσταση εφαρμογής', en: 'Install app' },
  'set.delete': { gr: 'Διαγραφή δεδομένων', en: 'Delete my data' },
  'set.save': { gr: 'Αποθήκευση', en: 'Save' },
  'set.deleteConfirm': { gr: 'Είστε σίγουροι; Αυτή η ενέργεια είναι μη αναστρέψιμη.', en: 'Are you sure? This action cannot be undone.' },
  'set.confirm': { gr: 'Επιβεβαίωση', en: 'Confirm' },
  'set.cancel': { gr: 'Άκυρο', en: 'Cancel' },
  // Forgot password
  'forgot.title': { gr: 'Επαναφορά κωδικού', en: 'Password recovery' },
  'forgot.send': { gr: 'Αποστολή κωδικού', en: 'Send code' },
  'forgot.code': { gr: 'Κωδικός επαλήθευσης', en: 'Verification code' },
  'forgot.verify': { gr: 'Επαλήθευση', en: 'Verify' },
  'forgot.newPw': { gr: 'Νέος κωδικός', en: 'New password' },
  'forgot.reset': { gr: 'Αλλαγή κωδικού', en: 'Change password' },
  'forgot.demo': { gr: 'Ο κωδικός επαλήθευσης είναι:', en: 'Verification code is:' },
  // General
  'general.illustrative': { gr: 'Ενδεικτικά δεδομένα', en: 'Illustrative data' },
  'general.loading': { gr: 'Φόρτωση...', en: 'Loading...' },
};

let currentLang = localStorage.getItem('atlas-lang') || 'gr';

export function t(key) {
  const entry = dict[key];
  if (!entry) return key;
  return entry[currentLang] || entry['gr'] || key;
}

export function getLang() { return currentLang; }

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('atlas-lang', lang);
}
