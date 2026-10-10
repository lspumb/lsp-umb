/* ===== KONFIGURASI SITUS (satu-satunya file yang perlu Anda ubah di sisi website) =====
   API_URL : isi dengan URL "Web app" hasil Deploy Google Apps Script (berakhiran /exec).
             Selama kosong, situs tetap tampil (data bawaan), pendaftaran tidak tersimpan ke Sheet. */
window.LSP_CONFIG = {
  API_URL: "",
  CACHE_SECONDS: 120,

  /* Data bawaan. Nilai di Google Sheet (tab Config) selalu menimpa nilai di bawah ini. */
  DEFAULTS: {
    nama_lsp: "Lembaga Sertifikasi Profesi Universitas Muhammadiyah Bengkulu",
    singkatan: "LSP UMB",
    email: "lsp@umb.ac.id",
    website: "lsp.umb.ac.id",
    instagram_nama: "LSP UMB",
    instagram_url: "",
    telepon: "",
    whatsapp: "+6289699449949",
    alamat_kantor: "Lantai Dasar Masjid At-Tanwir, Kampus IV Universitas Muhammadiyah Bengkulu, Jl. H. Adam Malik, Kelurahan Cempaka Permai, Kecamatan Gading Cempaka, Kota Bengkulu",
    jam_layanan: "Senin–Jumat, 08.00–14.00 WIB",
    maps_embed_url: "",
    nomor_lisensi: "BNSP-LSP-2797-ID",
    rekening_bank: "Bank Syariah Indonesia (BSI)",
    rekening_nomor: "7014809931",
    rekening_nama: "Universitas Muhammadiyah Bengkulu",
    biaya: "500000",
    pendaftaran_buka: "Y",
    pengumuman: "",
    pengumuman_en: "",
    visi: "Menjadi lembaga sertifikasi profesi yang profesional, kompeten, kreatif, dan inovatif berdasarkan semangat nilai-nilai Islami, untuk menghasilkan tenaga kerja yang berdaya saing tinggi.",
    visi_en: "To become a professional, competent, creative and innovative professional certification body grounded in Islamic values, producing a highly competitive workforce.",
    misi: "Menyelenggarakan sertifikasi kompetensi bagi mahasiswa\nMengembangkan dan mengevaluasi skema kompetensi\nMemfasilitasi penyelenggaraan pelatihan asesor kompetensi\nMenyelenggarakan tata kelola kelembagaan yang profesional, modern, dan akuntabel",
    misi_en: "Conducting competency certification for students\nDeveloping and evaluating competency schemes\nFacilitating competency assessor training\nImplementing professional, modern and accountable institutional governance",
    tentang_tambahan: "", tentang_tambahan_en: ""
  },
  BERITA_DEFAULT: [
    { id: "lisensi-bnsp-2026", tanggal: "2026-08-19", kategori: "Lisensi", tampil: "Y",
      judul: "Resmi Raih Lisensi BNSP, LSP UMB Mulai Gelar Uji Kompetensi",
      judul_en: "BNSP License Granted, LSP UMB Begins Competency Testing",
      ringkasan: "LSP UMB menerima Sertifikat Lisensi BNSP nomor BNSP-LSP-2797-ID, berlaku 10 Juli 2026 hingga 10 Juli 2031.",
      ringkasan_en: "LSP UMB received BNSP License No. BNSP-LSP-2797-ID, valid 10 July 2026 to 10 July 2031.",
      isi: "Lembaga Sertifikasi Profesi Universitas Muhammadiyah Bengkulu (LSP UMB) memperoleh Sertifikat Lisensi dari Badan Nasional Sertifikasi Profesi (BNSP) dengan nomor BNSP-LSP-2797-ID. Lisensi diterbitkan di Jakarta pada 10 Juli 2026 dan berlaku hingga 10 Juli 2031.\n\nLisensi ini menandai operasional penuh LSP UMB sebagai LSP Pihak Pertama (LSP-P1) untuk lembaga pendidikan dan pelatihan. BNSP memberikan lisensi setelah LSP UMB dinilai memenuhi pedoman BNSP 201, 202 (versi 2014), dan 210 (versi 2017).\n\nDirektur LSP UMB, Andi Azhar, menyebut lisensi ini sebagai langkah strategis meningkatkan daya saing alumni. Pada tahap awal, LSP UMB memiliki verifikasi untuk 11 skema sertifikasi dan didukung 24 asesor kompetensi bersertifikat dan berlisensi BNSP. Mahasiswa kini dapat mengikuti uji kompetensi langsung di kampus.\n\nSumber: Suara Muhammadiyah, 19 Agustus 2026.",
      isi_en: "Universitas Muhammadiyah Bengkulu's Professional Certification Body (LSP UMB) has been granted a license by the National Professional Certification Agency (BNSP), No. BNSP-LSP-2797-ID, issued in Jakarta on 10 July 2026 and valid until 10 July 2031.\n\nThe license marks full operation of LSP UMB as a first-party certification body (LSP-P1) for education and training institutions, after assessment against BNSP guidelines 201, 202 (2014) and 210 (2017).\n\nDirector Andi Azhar called the license a strategic step to improve alumni competitiveness. At the initial stage LSP UMB has 11 verified certification schemes and 24 BNSP-licensed competency assessors. Students can now take competency tests on campus.\n\nSource: Suara Muhammadiyah, 19 August 2026.",
      gambar: "", link: "https://www.suaramuhammadiyah.id/read/resmi-raih-lisensi-bnsp-lsp-umb-mulai-gelar-uji-kompetensi" }
  ],
  PENGURUS_DEFAULT: [
    { nama: "Dr. Susiyanto, M.Si", jabatan: "Ketua Dewan Pengarah", jabatan_en: "Chair, Steering Board", foto: "" },
    { nama: "Andi Azhar, Ph.D", jabatan: "Direktur LSP P1 UM Bengkulu", jabatan_en: "Director, LSP P1 UM Bengkulu", foto: "" },
    { nama: "Dandi Sunardi, M.Kom", jabatan: "Komite Skema", jabatan_en: "Scheme Committee", foto: "" },
    { nama: "Ns. Andry Sartika, S.Kep., M.Kep", jabatan: "Manajer Sertifikasi dan Standarisasi", jabatan_en: "Certification and Standardization Manager", foto: "" },
    { nama: "Popi Putri Prananda, S.Ak", jabatan: "Manajer Administrasi dan Keuangan", jabatan_en: "Administration and Finance Manager", foto: "" },
    { nama: "Noveriyanto, M.Pd", jabatan: "Manajer Manajemen Mutu", jabatan_en: "Quality Management Manager", foto: "" },
    { nama: "Mikho Ardinata, S.H., M.H", jabatan: "Kepala Tempat Uji Kompetensi (TUK)", jabatan_en: "Head of Assessment Center (TUK)", foto: "" }
  ]
};
