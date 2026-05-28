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
1. Cek Firebase CLI:
   `npx -y firebase-tools@latest --version`
2. Login:
   `npx -y firebase-tools@latest login`
3. Pilih project:
   `npx -y firebase-tools@latest use modalinhppsystem`
4. Build aplikasi:
   `npm run build`
5. Deploy:
   `npx -y firebase-tools@latest deploy --only firestore:rules,hosting`

Atau jalankan langsung:
- `npm run deploy:hosting` untuk publish UI saja.
- `npm run deploy:firebase` untuk publish UI dan Firestore rules.

Firebase Hosting secara native akan melayani halaman fallback `index.html` berdasarkan pengaturan `rewrites` di `firebase.json` untuk SPA.

Catatan penting: jangan menaruh template default Firebase di `public/index.html`. Vite memakai `index.html` di root repo dan Firebase Hosting harus melayani hasil build dari folder `dist`. Template default Firebase memuat `/__/firebase/init.js` dan dapat menampilkan pesan `Error loading the Firebase SDK, check the console.` ketika dibuka di luar konteks yang sesuai.
