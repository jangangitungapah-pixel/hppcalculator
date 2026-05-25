export const getAuthErrorMessage = (error) => {
  if (!error || !error.code) return 'Terjadi kesalahan sistem. Silakan coba lagi.';

  switch (error.code) {
    case 'auth/invalid-email':
      return 'Format email tidak valid.';
    case 'auth/weak-password':
      return 'Kata sandi terlalu lemah. Minimal 6 karakter.';
    case 'auth/email-already-in-use':
      return 'Email ini sudah terdaftar. Silakan login.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email atau kata sandi salah.';
    case 'auth/popup-closed-by-user':
      return 'Login dibatalkan oleh pengguna.';
    case 'auth/network-request-failed':
      return 'Gagal terhubung ke server. Periksa koneksi internet Anda.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan gagal. Silakan coba lagi nanti.';
    default:
      console.warn('Unhandled Auth Error:', error.code, error.message);
      return `Login gagal (${error.code}).`;
  }
};
