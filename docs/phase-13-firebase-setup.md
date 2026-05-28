# Setup Firebase Project

## Prasyarat
- Project: `modalinhppsystem`
- Domain: `modalin.web.app`

## 1. Authentication
Buka **Firebase Console > Authentication**:
- Aktifkan **Email/Password**.
- Aktifkan **Google**.

## 2. Firestore Database
Buka **Firebase Console > Firestore Database**:
- Buat database dalam mode production.
- Pasang rules dari `docs/firebase-firestore-rules-phase-13.rules`.

## 3. Konfigurasi Environment Lokal
- Salin `.env.example` ke `.env.local`.
- Isi seluruh variabel `VITE_FIREBASE_*` sesuai dengan credentials dari project settings.
- **Penting:** File `.env.local` sengaja diabaikan di `.gitignore` untuk mencegah kebocoran env credential milik dev environment. 

## 4. Firebase Hosting Deploy
1. Install Firebase CLI secara global jika belum ada:
   `npm install -g firebase-tools`
2. Login:
   `firebase login`
3. Pilih project:
   `firebase use modalinhppsystem`
4. Build aplikasi:
   `npm run build`
5. Deploy:
   `firebase deploy --only firestore:rules,hosting`

Firebase Hosting secara native akan melayani halaman fallback `index.html` berdasarkan pengaturan `rewrites` di `firebase.json` untuk SPA.
