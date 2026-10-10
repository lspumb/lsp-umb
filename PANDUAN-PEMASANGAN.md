# Panduan Pemasangan Website LSP UMB

Perkiraan waktu: 45 sampai 60 menit untuk pemasangan awal. Anda tidak perlu menulis kode. Semua halaman sudah jadi.

## 0. Isi paket

| Bagian | Fungsi |
|---|---|
| `index.html`, `tentang.html`, `skema.html`, `prosedur.html`, `jadwal.html`, `berita.html`, `kontak.html` | Halaman publik |
| `daftar.html`, `apl.html` | Formulir pendaftaran dan hasil FR.APL.01 / FR.APL.02 |
| `admin.html` | Dashboard admin (jadwal, lokasi, berita, pengaturan, pendaftar) |
| `js/config.js` | **Satu-satunya file yang Anda ubah di sisi website** (alamat API) |
| `gas/Code.gs` | Kode backend Google Apps Script |
| `docs/` | 11 PDF dokumen skema (bisa diunduh dari halaman skema) |
| `blogspot/tempel-di-tema-blogspot.html` | Kode yang ditempel di tema Blogspot (bingkai) |
| `tools/CNAME-untuk-nanti.txt` | Disimpan untuk saat domain `lsp.umb.ac.id` kelak dipindah ke GitHub Pages |

## 1. Siapkan Google Sheet dan backend (Google Apps Script)

Gunakan akun Google resmi yang akan menjadi pemilik data (disarankan akun `lsp@umb.ac.id` bila berbasis Google Workspace, agar kuota email 1.500/hari dan data tidak terikat akun pribadi).

1. Buka https://sheets.google.com, buat Spreadsheet kosong, beri nama **LSP UMB - Database**.
2. Menu **Ekstensi > Apps Script**.
3. Hapus isi `Code.gs`, tempel seluruh isi file `gas/Code.gs` dari paket ini. Simpan (ikon disket).
4. Pada daftar fungsi di bagian atas, pilih **setup**, klik **Jalankan**. Izinkan akses saat diminta (pilih akun, Lanjutan, "Buka ... (tidak aman)", Izinkan). Layar akan menampilkan **passcode admin awal**. Catat. Setup membuat tab: Jadwal, Berita, Pengurus, Galeri, Config, UnitElemen, Pendaftar.
5. Klik **Deploy > Deployment baru**. Jenis: **Aplikasi web**. Isi:
   - Jalankan sebagai: **Saya**
   - Yang memiliki akses: **Siapa saja**
6. Klik **Deploy**, salin **URL aplikasi web** (berakhiran `/exec`).
7. Uji: tempel `URL/exec?action=public` di browser. Harus tampil teks JSON berawalan `{"ok":true`.

**Aturan penting.** Setiap kali kode `Code.gs` diubah, buka **Deploy > Kelola deployment > ikon pensil > Versi: Versi baru > Deploy**. Tanpa ini perubahan tidak berlaku. Memberi deployment baru (bukan versi baru) akan mengubah URL dan membuat situs berhenti tersambung.

## 2. Hubungkan website ke backend

1. Buka `js/config.js`.
2. Isi `API_URL: ""` menjadi `API_URL: "URL-/exec-ANDA"`. Simpan.

## 3. Pasang di GitHub Pages

1. Buat akun/organisasi GitHub, lalu **New repository** bernama `lsp-umb` (Public).
2. **Add file > Upload files**: unggah seluruh isi folder website (bukan folder pembungkusnya). Pastikan file `.nojekyll` ikut. Commit.
3. **Settings > Pages**: Source = **Deploy from a branch**, Branch = `main`, folder `/ (root)`. Simpan.
4. Setelah 1-3 menit situs aktif di `https://NAMA-AKUN.github.io/lsp-umb/`. **Uji seluruh alur di alamat ini dulu**, sebelum memindahkan domain.

## 4. Tampilkan di lsp.umb.ac.id (Blogspot) tanpa ubah DNS

Blogspot tidak bisa menampung file situs ini, jadi Blogspot dijadikan "bingkai": tema Blogspot menampilkan situs GitHub Pages memenuhi layar. Alamat di browser tetap `lsp.umb.ac.id`. Tidak perlu TIK.

1. Pastikan situs sudah jalan di `https://NAMA-AKUN.github.io/lsp-umb/` dan lolos uji (langkah 1 sampai 3 dan 6). Paket ini sengaja **tanpa file `CNAME`**, karena file itu akan membuat alamat github.io dialihkan ke domain yang masih Blogspot.
2. Buka file `blogspot/tempel-di-tema-blogspot.html`. Ganti semua `NAMA-AKUN` dengan nama akun GitHub Anda (huruf kecil).
3. Blogspot: **Tema** > panah di samping **Sesuaikan** > **Cadangkan** (simpan cadangan tema lama) > **Edit HTML**.
4. Cari baris `<head>`, tempel seluruh isi file tadi tepat di bawahnya. Pertahankan baris `//<![CDATA[` dan `//]]>`. Simpan.
5. **Penting untuk ponsel:** Tema > ikon roda gigi di samping **Sesuaikan** > pada "Tema seluler" pilih **Tidak, tampilkan tema desktop di perangkat seluler**. Bila tidak, ponsel mahasiswa memakai tema seluler bawaan Blogspot dan tetap melihat blog lama.
6. Uji dari jendela penyamaran di komputer dan dari ponsel (kuota seluler, bukan Wi-Fi kampus).

Perilaku yang perlu Anda tahu (hasil uji saya):
- Navigasi, form pendaftaran, dan unduh APL (.docx) berjalan di dalam bingkai.
- Alamat bisa dibagikan per halaman, contoh `lsp.umb.ac.id/#skema.html` dan `lsp.umb.ac.id/#daftar.html`.
- Alamat yang dibagikan adalah alamat halaman Blogspot dengan tambahan `#`. Tombol "kembali" browser kadang keluar dari situs, bukan ke halaman sebelumnya.
- Di halaman hasil APL ada tombol **Buka di tab baru**. Pakai bila unduhan atau cetak bermasalah di ponsel tertentu (terutama iPhone).
- Google tidak akan mengindeks isi situs, karena isinya ada di bingkai. Untuk sosialisasi ke mahasiswa ini tidak masalah.
- Saya belum bisa menguji langsung di Blogspot dan di iPhone. [Kemungkinan Besar] GitHub Pages boleh dibingkai (tidak mengirim pembatas bingkai). Bila bingkai kosong, pakai cadangan di bawah.

**Cadangan bila bingkai gagal: pengalihan.** Ganti isi tempelan dengan dua baris ini (alamat berubah ke github.io saat dibuka):

```html
<meta http-equiv="refresh" content="0;url=https://NAMA-AKUN.github.io/lsp-umb/">
<script>location.replace("https://NAMA-AKUN.github.io/lsp-umb/");</script>
```

**Untuk membatalkan:** Tema > Pulihkan dari cadangan.

**Nanti, bila TIK sudah sempat:** minta ubah CNAME `lsp` ke `NAMA-AKUN.github.io`, salin `tools/CNAME-untuk-nanti.txt` ke akar repo dengan nama `CNAME`, isi **Settings > Pages > Custom domain**, lalu hapus tempelan di tema Blogspot.

## 5. Isi data (lewat Google Sheet atau dashboard admin)

Buka `lsp.umb.ac.id/admin.html` (atau alamat github.io), masukkan passcode dari langkah 1.4. Semua tab bisa diubah dari dashboard, atau langsung di Google Sheet.

| Yang diisi | Tab | Catatan |
|---|---|---|
| Nomor rekening BSI | Config, `rekening_nomor`, `rekening_nama` | **Sudah terisi** (7014809931, a.n. Universitas Muhammadiyah Bengkulu). Ubah di sini bila berganti. |
| Nomor lisensi BNSP | Config, `nomor_lisensi` | **Sudah terisi** (BNSP-LSP-2797-ID). |
| Alamat Kantor LSP dan WhatsApp Admin | Config, `alamat_kantor`, `whatsapp` | **Sudah terisi** (Masjid At-Tanwir, Kampus IV). Isi `jam_layanan` dan `telepon` bila ada. |
| **Tautan Instagram** | Config, `instagram_url` | Saya tidak menemukan alamat akunnya, jadi belum ditautkan. |
| **Visi dan misi** | Config, `visi`, `misi` (satu poin per baris), versi `_en` | Blok visi-misi disembunyikan otomatis sampai diisi. |
| **Jadwal dan lokasi ujian** | Jadwal | Tanggal, jam, TUK/lokasi, skema, status, tampil. |
| **Berita** | Berita | Isi hanya berita nyata. Foto: tempel tautan berbagi Google Drive ("siapa saja dengan tautan"). |
| **Pengurus** | Pengurus | Berisi Direktur dan Ketua Komite Skema (dari dokumen skema). Tambahkan pengurus lain dan foto. |
| **Galeri** | Galeri | Foto kegiatan (tautan Drive). |
| **Elemen dan KUK (FR.APL.02)** | UnitElemen | Satu baris per elemen. Kolom `kuk`: satu kriteria per baris sel (Alt+Enter). `kode_unit` harus persis sama dengan kode di skema. |

Pendaftar masuk ke tab **Pendaftar** (dan email notifikasi ke `lsp@umb.ac.id`). Ubah status (Baru, Berkas diterima, Dipanggil, Terjadwal, Selesai, Ditolak) lewat dashboard, unduh CSV bila perlu.

## 6. Uji sebelum diumumkan

1. Beranda tampil, tombol bahasa ID/EN berfungsi.
2. Halaman Skema: pilih prodi, hasil skema muncul, klik skema membuka persyaratan.
3. Isi form daftar dengan data uji, pilih skema dan prodi yang cocok. Pastikan: muncul nomor pendaftaran `LSP-2026-0001`, baris baru di tab Pendaftar, FR.APL.01 dan FR.APL.02 bisa diunduh (.docx) dan dicetak.
4. Hapus baris uji di tab Pendaftar.
5. Tambah satu jadwal uji lewat dashboard, cek tampil di Beranda dan halaman Jadwal (maksimal 2 menit karena cache).
6. Buka dari ponsel.

## 7. Hal yang harus Anda ketahui

- **FR.APL.01 dan FR.APL.02.** File `.docx` asli tidak bisa saya baca (hanya teks dari proyek). Dokumen dibangun ulang mengikuti urutan baris, redaksi, dan tabel templat, lalu diisi data. Tata letak visual (jenis huruf, lebar kolom, logo kop) bisa sedikit berbeda dari file asli. **Bandingkan hasil unduhan dengan template asli sebelum diumumkan.** Bila perlu identik piksel demi piksel, kirimkan file `.docx` aslinya agar mesin pengisi diganti ke mode templat asli. Tambahan satu-satunya: catatan kecil nomor pendaftaran di kaki halaman.
- **Elemen dan KUK.** Sudah dimuat bawaan (data/elemen.js) hanya untuk skema 5 (KKNI IV Bahasa Inggris Keperawatan, 14 unit), dari FR.IA.01 di Drive. Skema lain: kolom elemen pada FR.APL.02 tampil titik-titik seperti templat kosong, dengan peringatan kepada asesi, sampai tab UnitElemen diisi dari MUK. Isi tab UnitElemen menimpa data bawaan per unit. Salah ketik di sumber (mis. "lSalam theurapetik") dibawa apa adanya; perbaiki di MUK lalu di tab UnitElemen.
- **Pemetaan bukti di FR.APL.01.** Transkrip dan surat magang saya tempatkan di "Bukti Persyaratan Dasar"; KTP, KTM, slip bayar, pasfoto di "Bukti Administratif". Sesuaikan bila praktik LSP berbeda. Kolom "Standar Kompetensi Kerja" diisi "SKKNI".
- **Data pribadi.** Sheet menyimpan NIK dan kontak pendaftar. Jangan bagikan Sheet ke banyak orang, batasi pada admin LSP, dan pertimbangkan kewajiban UU PDP kampus.
- **Kuota.** Email notifikasi dibatasi Google (100/hari akun gratis, 1.500/hari Workspace). Bila habis, data tetap tersimpan. Satu eksekusi skrip maksimal 6 menit, tidak relevan untuk beban ini.
- **Bila server GAS mati.** Situs tetap tampil dengan data bawaan. Pendaftar tetap bisa mengunduh APL, dengan peringatan bahwa data belum tercatat.
- **Data awal.** Rekening, lisensi, alamat, dan WhatsApp sudah tertanam sebagai nilai bawaan dan juga diisikan ke tab Config oleh `setup()`.
- **Passcode admin.** Lima kali salah mengunci login 10 menit untuk semua orang (termasuk Anda). Ganti passcode di Apps Script > Setelan proyek > Properti skrip > `ADMIN_PASSCODE`.
- **Perlindungan spam.** Ada honeypot, batas waktu pengisian minimal 4 detik, dan validasi server. Tidak ada CAPTCHA.
- **Berita.** Kosong sampai Anda mengisi. Saya tidak menemukan sumber publik terverifikasi untuk kegiatan yang Anda sebut (pelatihan asesor, full assessment, witness, penyerahan lisensi, benchmarking ke UMT, rapat), jadi tidak ada berita yang saya buat.
- **Tidak ada fitur verifikasi sertifikat** (situs lama punya halaman "Verifikasi"). Bisa ditambahkan setelah ada basis data pemegang sertifikat.

## 8. Ketidaksesuaian pada dokumen skema (perbaiki di sumber)

| Dokumen | Temuan |
|---|---|
| SKEMA-10 | Nomor dokumen `SKM.09/LSP-UMB/FT/IV/2025` sama dengan SKEMA-09. |
| SKEMA-06 | Nomor dokumen `SKM.06/LSP-UMB/FPP//IV/2025` (tanda `/` ganda). Di web ditulis `FPP/IV`. |
| SKEMA-12 | Ruang lingkup "15 (Sepuluh) unit". Daftar unit berisi 15. Web memakai 15. |
| SKEMA-09 | Kode unit `A.014000.16.01` (kemungkinan `.016.`); judul "Menyiapkan Sampek" (kemungkinan "Sampel"). Web menampilkan apa adanya. |
| SKEMA-01 | Judul unit "Mengoptikan Pengelolaan Media Sosial…" (kemungkinan "Mengoptimalkan"). Web menampilkan apa adanya. |
| SKEMA-05 | Unit 8 "Eliminasi Urin Melalui Keteter" (ejaan kateter). |
| SKEMA-08 | Penomoran 9.1.1 ganda dan 9.1.2 memuat APL.02 bukan APL.01. |
| SKEMA-09 | Persyaratan "Bahan Paakan Ternak" (ejaan sudah dibetulkan di web: "Bahan Pakan Ternak"). |

Judul unit kompetensi sengaja tidak diubah karena merupakan judul standar resmi. Ejaan pada teks persyaratan biasa (mis. "Transkip", "Kopetensi") sudah dibetulkan di web.

## 9. Mengubah isi di kemudian hari

- Jadwal, berita, pengurus, rekening, pengumuman: lewat dashboard admin (tanpa deploy ulang).
- Skema, unit kompetensi, persyaratan: ubah `tools/build_skema.py`, jalankan `python3 tools/build_skema.py`, unggah `data/skema.js` ke GitHub. Atau minta saya memperbaruinya.
- Teks halaman statis: ubah `tools/build_pages.py` lalu jalankan `python3 tools/build_pages.py`.

## 10. Sumber data tambahan (Buku Panduan Mutu No. 35/PM/LSP/I/2026)
Visi, misi, dan 7 pengurus di js/config.js diambil dari Buku Panduan Mutu (struktur organisasi, berlaku 2 Januari 2026). Untuk mengubah, isi tab Config (visi, misi) dan tab Pengurus; isi Sheet menimpa bawaan.
