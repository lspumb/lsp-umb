/**
 * LSP UMB - Backend Google Apps Script
 * Database: Google Sheets (skrip ini dipasang dari menu Ekstensi > Apps Script pada Spreadsheet).
 * Router tunggal: doGet (data publik) dan doPost (pendaftaran + admin).
 *
 * PENTING: setiap kali Anda mengubah kode ini, lakukan Deploy > Kelola deployment > ikon pensil >
 * Versi: "Versi baru" > Deploy. Tanpa langkah ini, perubahan TIDAK berlaku di URL /exec.
 */

// ===================== CONFIG (ubah di sini bila perlu) =====================
var CONFIG = {
  NOTIFY_EMAIL: 'lsp@umb.ac.id',   // penerima notifikasi pendaftaran baru ('' = nonaktif)
  CACHE_SECONDS: 60,               // cache data publik
  MAX_LOGIN_FAIL: 5,               // gagal login sebelum dikunci 10 menit
  MIN_FILL_MS: 4000,               // pengisian form lebih cepat dari ini dianggap bot
  VALID_SKEMA_IDS: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12]
};

var SCHEMA = {
  Jadwal:     ['id', 'tanggal', 'jam_mulai', 'jam_selesai', 'jenis', 'skema', 'tuk', 'alamat', 'maps_url', 'kuota', 'status', 'catatan', 'tampil', 'diubah'],
  Berita:     ['id', 'tanggal', 'judul', 'judul_en', 'kategori', 'ringkasan', 'ringkasan_en', 'isi', 'isi_en', 'gambar', 'link', 'tampil', 'diubah'],
  Pengurus:   ['id', 'urutan', 'nama', 'jabatan', 'jabatan_en', 'foto', 'tampil'],
  Galeri:     ['id', 'urutan', 'url', 'caption', 'caption_en', 'tampil'],
  Config:     ['kunci', 'nilai', 'keterangan'],
  UnitElemen: ['id', 'kode_unit', 'no_elemen', 'elemen', 'kuk'],
  Pendaftar:  ['id', 'waktu', 'status', 'skemaId', 'skemaNama', 'nama', 'nik', 'tempat', 'tglLahir', 'jk', 'kebangsaan', 'alamat', 'kodepos', 'telpRumah', 'telpKantor', 'hp', 'email', 'pendidikan', 'prodi', 'nim', 'semester', 'institusi', 'jabatan', 'alamatKantor', 'kodeposKantor', 'telpInstitusi', 'fax', 'emailInstitusi', 'catatanAdmin']
};
var SEED_CONFIG = [
  ['rekening_bank', 'Bank Syariah Indonesia (BSI)', 'Nama bank pembayaran'],
  ['rekening_nomor', '7014809931', 'Nomor rekening BSI UMB. Bila dikosongkan, web menampilkan "akan diumumkan".'],
  ['rekening_nama', 'Universitas Muhammadiyah Bengkulu', 'Nama pemilik rekening (tampil bila diisi)'],
  ['biaya', '500000', 'Biaya sertifikasi (angka saja)'],
  ['nomor_lisensi', 'BNSP-LSP-2797-ID', 'Nomor lisensi BNSP (tampil bila diisi)'],
  ['alamat_kantor', 'Lantai Dasar Masjid At-Tanwir, Kampus IV Universitas Muhammadiyah Bengkulu, Jl. H. Adam Malik, Kelurahan Cempaka Permai, Kecamatan Gading Cempaka, Kota Bengkulu', 'Alamat/lokasi Kantor LSP UMB tempat berkas diserahkan'],
  ['jam_layanan', '', 'Contoh: Senin-Jumat 08.00-15.00 WIB'],
  ['telepon', '', 'Nomor telepon kantor (opsional)'],
  ['whatsapp', '+6289699449949', 'Nomor WhatsApp Admin (opsional)'],
  ['instagram_url', '', 'Tautan lengkap Instagram LSP UMB'],
  ['maps_embed_url', '', 'URL embed Google Maps (opsional)'],
  ['pendaftaran_buka', 'Y', 'Y = form pendaftaran aktif, N = ditutup'],
  ['pengumuman', '', 'Teks banner pengumuman di atas semua halaman (kosongkan bila tidak ada)'],
  ['pengumuman_en', '', 'Pengumuman (English)'],
  ['visi', '', 'Visi LSP UMB'], ['visi_en', '', 'Vision (English)'],
  ['misi', '', 'Misi, satu poin per baris'], ['misi_en', '', 'Mission (English), one per line'],
  ['tentang_tambahan', '', 'Paragraf tambahan profil (opsional)'], ['tentang_tambahan_en', '', 'Extra profile paragraph (English)']
];

// ===================== SETUP (jalankan sekali) =====================
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SCHEMA).forEach(function (name) {
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    var heads = SCHEMA[name];
    if (sh.getLastRow() === 0) sh.getRange(1, 1, 1, heads.length).setValues([heads]);
    sh.getRange(1, 1, 1, heads.length).setFontWeight('bold').setBackground('#e8f0ea');
    sh.setFrozenRows(1);
    sh.getRange(2, 1, Math.max(sh.getMaxRows() - 1, 1), heads.length).setNumberFormat('@'); // semua teks: cegah tanggal/NIK berubah format
  });
  var cfg = ss.getSheetByName('Config');
  if (cfg.getLastRow() < 2) cfg.getRange(2, 1, SEED_CONFIG.length, 3).setValues(SEED_CONFIG);
  var pg = ss.getSheetByName('Pengurus');
  if (pg.getLastRow() < 2) pg.getRange(2, 1, 2, 7).setValues([
    ['p1', '1', 'Andi Azhar, Ph.D', 'Direktur LSP UMB', 'Director, LSP UMB', '', 'Y'],
    ['p2', '2', 'Dandi Sunardi, M.Kom', 'Ketua Komite Skema', 'Chair, Scheme Committee', '', 'Y']]);
  var def = ss.getSheetByName('Sheet1') || ss.getSheetByName('Sheet 1') || ss.getSheetByName('Lembar1');
  if (def && ss.getSheets().length > 1 && def.getLastRow() === 0) ss.deleteSheet(def);
  var props = PropertiesService.getScriptProperties(), msg = 'Setup selesai.';
  if (!props.getProperty('ADMIN_PASSCODE')) {
    var p = Utilities.getUuid().replace(/-/g, '').slice(0, 10);
    props.setProperty('ADMIN_PASSCODE', p);
    msg += '\n\nPasscode admin awal: ' + p + '\n(Ubah di Setelan Proyek > Properti skrip > ADMIN_PASSCODE. Catat sekarang.)';
  }
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) {}
}

// ===================== ROUTER =====================
function doGet(e) {
  try {
    var a = (e && e.parameter && e.parameter.action) || '';
    if (a === 'public') return out({ ok: true, data: publicData() });
    return out({ ok: true, service: 'LSP UMB API' });
  } catch (err) { return out({ ok: false, error: String(err) }); }
}
function doPost(e) {
  try {
    var body = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (body.action === 'daftar') return out(daftar(body));
    if (body.action === 'admin') return out(admin(body));
    return out({ ok: false, error: 'Aksi tidak dikenal' });
  } catch (err) { return out({ ok: false, error: 'Kesalahan server: ' + err }); }
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

// ===================== SHEET HELPERS =====================
function sheet(name) { var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name); if (!s) throw new Error('Tab "' + name + '" belum ada. Jalankan fungsi setup().'); return s; }
function normDate(v) {
  if (v instanceof Date) return Utilities.formatDate(v, 'Asia/Jakarta', 'yyyy-MM-dd');
  var s = String(v || '').trim(), m = /^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/.exec(s);
  if (m) return m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
  return s.slice(0, 10) === s || /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : s;
}
function normTime(v) { if (v instanceof Date) return Utilities.formatDate(v, 'Asia/Jakarta', 'HH:mm'); return String(v || '').trim(); }
function readRows(name) {
  var sh = sheet(name), heads = SCHEMA[name], last = sh.getLastRow();
  if (last < 2) return [];
  var vals = sh.getRange(2, 1, last - 1, heads.length).getValues(), rows = [];
  vals.forEach(function (r, i) {
    if (r.every(function (c) { return c === '' || c == null; })) return;
    var o = { _row: i + 2 };
    heads.forEach(function (h, j) {
      var v = r[j];
      if (h === 'tanggal' || h === 'tglLahir') v = normDate(v);
      else if (h === 'jam_mulai' || h === 'jam_selesai') v = normTime(v);
      else if (v instanceof Date) v = Utilities.formatDate(v, 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');
      o[h] = v == null ? '' : String(v);
    });
    rows.push(o);
  });
  return rows;
}
function clean(o) { var c = {}; Object.keys(o).forEach(function (k) { if (k !== '_row') c[k] = o[k]; }); return c; }
function writeRow(name, rowNum, obj) {
  var sh = sheet(name), heads = SCHEMA[name];
  var rng = sh.getRange(rowNum, 1, 1, heads.length);
  rng.setNumberFormat('@');
  rng.setValues([heads.map(function (h) { return obj[h] == null ? '' : String(obj[h]); })]);
}
function clearCache() { try { CacheService.getScriptCache().remove('public'); } catch (e) {} }

// ===================== DATA PUBLIK =====================
function publicData() {
  var cache = CacheService.getScriptCache(), hit = cache.get('public');
  if (hit) return JSON.parse(hit);
  var cfg = {};
  readRows('Config').forEach(function (r) { if (r.kunci && r.nilai !== '') cfg[r.kunci] = r.nilai; });
  var vis = function (r) { return String(r.tampil).toUpperCase() !== 'N'; };
  var num = function (r) { return parseFloat(r.urutan) || 999; };
  var elemen = {};
  readRows('UnitElemen').sort(function (a, b) { return (parseFloat(a.no_elemen) || 0) - (parseFloat(b.no_elemen) || 0); }).forEach(function (r) {
    if (!r.kode_unit) return;
    (elemen[r.kode_unit] = elemen[r.kode_unit] || []).push({ elemen: r.elemen, kuk: String(r.kuk || '').split(/\r?\n/).map(function (s) { return s.trim(); }).filter(String) });
  });
  var data = {
    config: cfg,
    jadwal: readRows('Jadwal').filter(vis).map(clean),
    berita: readRows('Berita').filter(vis).map(clean),
    pengurus: readRows('Pengurus').filter(vis).sort(function (a, b) { return num(a) - num(b); }).map(clean),
    galeri: readRows('Galeri').filter(vis).sort(function (a, b) { return num(a) - num(b); }).map(clean),
    elemen: elemen
  };
  try { cache.put('public', JSON.stringify(data), CONFIG.CACHE_SECONDS); } catch (e) { /* terlalu besar: lewati cache */ }
  return data;
}

// ===================== PENDAFTARAN =====================
function s_(v, n) { return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n || 200); }
function daftar(body) {
  var d = body.data || {};
  if (body.hp_field) return { ok: true, id: 'LSP-0000-0000' }; // honeypot terisi: pura-pura sukses
  if (!body.t0 || (Date.now() - Number(body.t0)) < CONFIG.MIN_FILL_MS) return { ok: false, error: 'Pengisian terlalu cepat. Silakan ulangi.' };
  var skemaId = parseInt(d.skemaId, 10);
  if (CONFIG.VALID_SKEMA_IDS.indexOf(skemaId) < 0) return { ok: false, error: 'Skema tidak valid.' };
  var req = ['nama', 'nik', 'tempat', 'tglLahir', 'jk', 'alamat', 'hp', 'email', 'prodi', 'nim', 'semester'];
  for (var i = 0; i < req.length; i++) if (!s_(d[req[i]])) return { ok: false, error: 'Data wajib belum lengkap: ' + req[i] };
  if (!/^\d{16}$/.test(s_(d.nik))) return { ok: false, error: 'NIK harus 16 digit.' };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s_(d.email))) return { ok: false, error: 'Email tidak valid.' };
  if (!/^(\+62|62|0)8\d{7,12}$/.test(s_(d.hp).replace(/[\s-]/g, ''))) return { ok: false, error: 'Nomor HP tidak valid.' };
  if (['L', 'P'].indexOf(d.jk) < 0) return { ok: false, error: 'Jenis kelamin tidak valid.' };

  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var rows = readRows('Pendaftar'), exist = null;
    rows.forEach(function (r) { if (r.nik === s_(d.nik) && String(r.skemaId) === String(skemaId) && ['Selesai', 'Ditolak'].indexOf(r.status) < 0) exist = r; });
    var obj = {
      skemaId: skemaId, skemaNama: s_(d.skemaNama), nama: s_(d.nama, 120), nik: s_(d.nik), tempat: s_(d.tempat, 80), tglLahir: s_(d.tglLahir, 10), jk: d.jk, kebangsaan: s_(d.kebangsaan, 60),
      alamat: s_(d.alamat, 400), kodepos: s_(d.kodepos, 10), telpRumah: s_(d.telpRumah, 30), telpKantor: s_(d.telpKantor, 30), hp: s_(d.hp, 20), email: s_(d.email, 120),
      pendidikan: s_(d.pendidikan, 200), prodi: s_(d.prodi, 100), nim: s_(d.nim, 30), semester: s_(d.semester, 20), institusi: s_(d.institusi, 150), jabatan: s_(d.jabatan, 100),
      alamatKantor: s_(d.alamatKantor, 300), kodeposKantor: s_(d.kodeposKantor, 10), telpInstitusi: s_(d.telpInstitusi, 30), fax: s_(d.fax, 30), emailInstitusi: s_(d.emailInstitusi, 120)
    };
    if (exist) { // pendaftar yang sama mengisi ulang: perbarui data, pertahankan id/status
      obj.id = exist.id; obj.waktu = exist.waktu; obj.status = exist.status; obj.catatanAdmin = exist.catatanAdmin;
      writeRow('Pendaftar', exist._row, obj); return { ok: true, id: exist.id, updated: true };
    }
    var yr = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy'), max = 0;
    rows.forEach(function (r) { var m = /^LSP-(\d{4})-(\d+)$/.exec(r.id); if (m && m[1] === yr) max = Math.max(max, parseInt(m[2], 10)); });
    obj.id = 'LSP-' + yr + '-' + ('000' + (max + 1)).slice(-4);
    obj.waktu = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss'); obj.status = 'Baru'; obj.catatanAdmin = '';
    var sh = sheet('Pendaftar'); writeRow('Pendaftar', sh.getLastRow() + 1, obj);
    SpreadsheetApp.flush();
    notify(obj);
    return { ok: true, id: obj.id };
  } finally { lock.releaseLock(); }
}
function notify(o) {
  if (!CONFIG.NOTIFY_EMAIL) return;
  try {
    MailApp.sendEmail(CONFIG.NOTIFY_EMAIL, '[LSP UMB] Pendaftar baru ' + o.id, 'Pendaftar baru melalui lsp.umb.ac.id\n\nID: ' + o.id + '\nNama: ' + o.nama + '\nSkema: ' + o.skemaNama + '\nProdi: ' + o.prodi + '\nHP: ' + o.hp + '\nEmail: ' + o.email + '\n\nKelola di Google Sheet tab Pendaftar atau dashboard admin.');
  } catch (e) { /* kuota email habis: abaikan, data tetap tersimpan */ }
}

// ===================== ADMIN =====================
function authOk(pass) {
  var cache = CacheService.getScriptCache(), fails = parseInt(cache.get('fails') || '0', 10);
  if (fails >= CONFIG.MAX_LOGIN_FAIL) return { ok: false, error: 'Terlalu banyak percobaan. Coba lagi dalam 10 menit.' };
  var real = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSCODE');
  if (!real) return { ok: false, error: 'Passcode admin belum diatur. Jalankan setup() atau isi properti ADMIN_PASSCODE.' };
  if (!pass || String(pass) !== real) { cache.put('fails', String(fails + 1), 600); return { ok: false, error: 'Passcode salah.' }; }
  cache.remove('fails'); return { ok: true };
}
function admin(b) {
  var au = authOk(b.pass); if (!au.ok) return au;
  if (b.op === 'ping') return { ok: true };
  var name = b.sheet; if (!SCHEMA[name]) return { ok: false, error: 'Tab tidak dikenal' };
  if (b.op === 'list') return { ok: true, rows: readRows(name) };
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    if (b.op === 'delete') {
      if (name === 'Pendaftar') return { ok: false, error: 'Data pendaftar tidak dapat dihapus dari dashboard.' };
      var rn = parseInt(b.row, 10); if (!rn || rn < 2 || rn > sheet(name).getLastRow()) return { ok: false, error: 'Baris tidak valid' };
      sheet(name).deleteRow(rn); clearCache(); return { ok: true };
    }
    if (b.op === 'save') {
      var data = b.data || {}, heads = SCHEMA[name], rn2 = parseInt(b.row, 10) || 0, cur = {};
      if (name === 'Config') { // upsert berdasarkan kunci
        var found = readRows('Config').filter(function (r) { return r.kunci === s_(data.kunci); })[0];
        if (found) { rn2 = found._row; cur = found; }
      } else if (rn2) {
        cur = readRows(name).filter(function (r) { return r._row === rn2; })[0];
        if (!cur || (b.id && cur.id !== b.id)) return { ok: false, error: 'Data sudah berubah. Muat ulang halaman.' };
      }
      var obj = clean(cur);
      var allowed = name === 'Pendaftar' ? ['status', 'catatanAdmin'] : heads.filter(function (h) { return h !== 'id' && h !== 'diubah'; });
      allowed.forEach(function (h) { if (data[h] !== undefined) obj[h] = s_(data[h], (h === 'isi' || h === 'isi_en' || h === 'kuk' || h === 'nilai') ? 8000 : 600); });
      if (name === 'Pendaftar' && !rn2) return { ok: false, error: 'Tidak dapat menambah pendaftar dari dashboard.' };
      if (heads.indexOf('id') >= 0 && !obj.id) obj.id = Utilities.getUuid().slice(0, 8);
      if (heads.indexOf('diubah') >= 0) obj.diubah = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm');
      if (name === 'Jadwal' && !/^\d{4}-\d{2}-\d{2}$/.test(obj.tanggal || '')) return { ok: false, error: 'Tanggal tidak valid.' };
      if (!rn2) rn2 = sheet(name).getLastRow() + 1;
      writeRow(name, rn2, obj); clearCache(); return { ok: true, id: obj.id };
    }
    return { ok: false, error: 'Operasi tidak dikenal' };
  } finally { lock.releaseLock(); }
}
