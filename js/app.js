/* Inti situs LSP UMB: bahasa, header/footer, pemuatan data publik, utilitas. */
(function (g) {
  'use strict';
  var CFG = g.LSP_CONFIG, DATA = g.LSP_DATA;
  var APP = g.LSP = { CFG: CFG, DATA: DATA };

  /* ---------- utilitas ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function B(id, en) { return '<span data-l="id">' + id + '</span><span data-l="en">' + (en == null ? id : en) + '</span>'; }
  function BE(id, en) { return B(esc(id), esc(en || id)); }
  function rupiah(n) { n = Number(n) || 0; return 'Rp ' + n.toLocaleString('id-ID'); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function sstore(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  var BLN_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var BLN_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var BLN_FULL_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var BLN_FULL_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function parseDate(v) { if (!v) return null; var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v)); if (!m) return null; return { y: +m[1], m: +m[2] - 1, d: +m[3] }; }
  function dateLong(v) { var p = parseDate(v); if (!p) return ''; return B(p.d + ' ' + BLN_FULL_ID[p.m] + ' ' + p.y, BLN_FULL_EN[p.m] + ' ' + p.d + ', ' + p.y); }
  function todayIso() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  /* Ubah tautan Google Drive menjadi URL gambar yang bisa ditampilkan. */
  function img(url) {
    if (!url) return '';
    var m = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{20,})/.exec(url) || /[?&]id=([\w-]{20,})/.exec(url);
    if (m && /drive\.google\.com/.test(url)) return 'https://lh3.googleusercontent.com/d/' + m[1] + '=w1200';
    return url;
  }
  function lines(t) { return String(t || '').split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean); }
  function el(sel, root) { return (root || document).querySelector(sel); }
  function els(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function skemaById(id) { return DATA.skema.filter(function (s) { return String(s.id) === String(id); })[0]; }
  function prodiName(k) { var p = DATA.prodi.filter(function (x) { return x.key === k; })[0]; return p ? p.nama : k; }
  function jenisLabel(j) { return j; }
  Object.assign(APP, { esc: esc, B: B, BE: BE, rupiah: rupiah, store: store, sstore: sstore, parseDate: parseDate, dateLong: dateLong, todayIso: todayIso, img: img, lines: lines, el: el, els: els, skemaById: skemaById, prodiName: prodiName, BLN_ID: BLN_ID, BLN_EN: BLN_EN });

  /* ---------- tertanam (iframe di Blogspot) ---------- */
  var embedded = false;
  try { embedded = g.parent !== g; } catch (e) { embedded = true; }
  if (embedded) {
    document.documentElement.classList.add('embedded');
    var pgName = (location.pathname.split('/').pop() || 'index.html');
    // beri tahu halaman induk agar bilah alamat ikut berubah (jangan kirim data pendaftaran)
    try { g.parent.postMessage({ lsp: pgName + (pgName === 'apl.html' ? '' : (location.hash || '')) }, '*'); } catch (e) {}
  }
  APP.embedded = embedded;

  /* ---------- bahasa ---------- */
  var lang = (store('lsp_lang') === 'en') ? 'en' : 'id';
  function applyLang() {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.lang = lang;
    els('[data-ph-id]').forEach(function (n) { n.setAttribute('placeholder', n.getAttribute('data-ph-' + lang) || n.getAttribute('data-ph-id')); });
    els('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false'); });
    var t = document.body.getAttribute('data-title-' + lang); if (t) document.title = t + ' | LSP UMB';
  }
  APP.lang = function () { return lang; };
  APP.L = function (id, en) { return lang === 'en' && en != null ? en : id; };
  APP.setLang = function (l) { lang = l; store('lsp_lang', l); applyLang(); document.dispatchEvent(new CustomEvent('langchange', { detail: l })); };
  applyLang();

  /* ---------- data publik ---------- */
  var state = { cfg: Object.assign({}, CFG.DEFAULTS), jadwal: [], berita: (CFG.BERITA_DEFAULT || []).slice(), pengurus: CFG.PENGURUS_DEFAULT.slice(), galeri: [], elemen: Object.assign({}, g.LSP_ELEMEN || {}), online: false };
  APP.state = state;
  function merge(d) {
    if (!d) return;
    if (d.config) Object.keys(d.config).forEach(function (k) { if (d.config[k] !== '' && d.config[k] != null) state.cfg[k] = d.config[k]; });
    if (d.jadwal) state.jadwal = d.jadwal;
    if (d.berita && d.berita.length) state.berita = d.berita;
    if (d.pengurus && d.pengurus.length) state.pengurus = d.pengurus;
    if (d.galeri) state.galeri = d.galeri;
    if (d.elemen) Object.keys(d.elemen).forEach(function (k) { if (d.elemen[k] && d.elemen[k].length) state.elemen[k] = d.elemen[k]; });
  }
  APP.load = function () {
    if (APP._p) return APP._p;
    APP._p = new Promise(function (resolve) {
      if (!CFG.API_URL) { resolve(state); return; }
      var key = 'lsp_pub', now = Date.now();
      try { var c = JSON.parse(sstore(key) || 'null'); if (c && now - c.t < CFG.CACHE_SECONDS * 1000) { merge(c.d); state.online = true; resolve(state); return; } } catch (e) {}
      var ctl = ('AbortController' in g) ? new AbortController() : null, to = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
      fetch(CFG.API_URL + '?action=public', ctl ? { signal: ctl.signal } : {}).then(function (r) { return r.json(); }).then(function (j) {
        clearTimeout(to);
        if (j && j.ok) { merge(j.data); state.online = true; sstore(key, JSON.stringify({ t: now, d: j.data })); }
        resolve(state);
      }).catch(function () { clearTimeout(to); resolve(state); });
    });
    return APP._p;
  };
  APP.post = function (payload) {
    if (!CFG.API_URL) return Promise.reject(new Error('API_URL belum diisi'));
    return fetch(CFG.API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) }).then(function (r) { return r.json(); });
  };

  /* ---------- header & footer ---------- */
  var NAV = [
    ['index.html', 'Beranda', 'Home', 'home'], ['tentang.html', 'Tentang', 'About', 'tentang'], ['skema.html', 'Skema', 'Schemes', 'skema'],
    ['prosedur.html', 'Prosedur', 'Procedure', 'prosedur'], ['jadwal.html', 'Jadwal Uji', 'Exam Schedule', 'jadwal'], ['berita.html', 'Berita', 'News', 'berita'], ['kontak.html', 'Kontak', 'Contact', 'kontak']
  ];
  function header() {
    var page = document.body.getAttribute('data-page');
    var nav = NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[3] === page ? ' aria-current="page"' : '') + '>' + B(n[1], n[2]) + '</a>'; }).join('');
    return '<a class="skip" href="#main">' + B('Lewati ke konten', 'Skip to content') + '</a>' +
      '<div class="topbar"><div class="wrap"><span>' + B('Lembaga Sertifikasi Profesi · Universitas Muhammadiyah Bengkulu', 'Professional Certification Body · Universitas Muhammadiyah Bengkulu') + '</span>' +
      '<span><a href="mailto:' + esc(CFG.DEFAULTS.email) + '">' + esc(CFG.DEFAULTS.email) + '</a></span></div></div>' +
      '<header class="site-header"><div class="wrap"><a class="brand" href="index.html" aria-label="LSP UMB"><img src="img/logo-lsp-umb.png" alt="LSP UMB" width="86" height="46"></a>' +
      '<button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button>' +
      '<nav class="nav" id="nav" aria-label="Utama">' + nav + '<a class="cta" href="daftar.html">' + B('Daftar Sertifikasi', 'Apply') + '</a>' +
      '<div class="lang" role="group" aria-label="Bahasa"><button type="button" data-lang="id">ID</button><button type="button" data-lang="en">EN</button></div></nav></div></header><div id="notice"></div>';
  }
  function footer() {
    var c = state.cfg;
    var ig = c.instagram_url ? '<a href="' + esc(c.instagram_url) + '" target="_blank" rel="noopener">Instagram ' + esc(c.instagram_nama) + '</a>' : 'Instagram: ' + esc(c.instagram_nama);
    return '<footer class="site-footer"><div class="wrap"><div class="fcols"><div><div class="flogos"><img src="img/logo-lsp-umb.png" alt="LSP UMB" height="48"><img src="img/logo-bnsp.png" alt="BNSP" height="48"></div>' +
      '<p><strong>' + esc(c.nama_lsp) + '</strong></p><p class="small">' + B('Lembaga Sertifikasi Profesi Pihak Pertama (LSP P1) di lingkungan Universitas Muhammadiyah Bengkulu.', 'First-party Professional Certification Body (LSP P1) of Universitas Muhammadiyah Bengkulu.') + '</p></div>' +
      '<div><h4>' + B('Informasi', 'Information') + '</h4><ul><li><a href="tentang.html">' + B('Tentang LSP', 'About') + '</a></li><li><a href="skema.html">' + B('Skema Sertifikasi', 'Certification Schemes') + '</a></li><li><a href="prosedur.html">' + B('Prosedur Pendaftaran', 'Registration Procedure') + '</a></li><li><a href="jadwal.html">' + B('Jadwal Uji Kompetensi', 'Exam Schedule') + '</a></li></ul></div>' +
      '<div><h4>' + B('Layanan', 'Services') + '</h4><ul><li><a href="daftar.html">' + B('Pendaftaran Sertifikasi', 'Apply for Certification') + '</a></li><li><a href="berita.html">' + B('Berita', 'News') + '</a></li><li><a href="kontak.html">' + B('Kontak', 'Contact') + '</a></li></ul></div>' +
      '<div><h4>' + B('Kontak', 'Contact') + '</h4><ul><li><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></li><li>' + esc(c.website) + '</li>' + (c.nomor_lisensi ? '<li>' + B('Lisensi BNSP: ', 'BNSP license: ') + (c.lisensi_url ? '<a href="' + esc(c.lisensi_url) + '" target="_blank" rel="noopener">' + esc(c.nomor_lisensi) + '</a>' : esc(c.nomor_lisensi)) + '</li>' : '') + '<li>' + ig + '</li></ul></div></div>' +
      '<div class="copy">© ' + new Date().getFullYear() + ' ' + esc(c.nama_lsp) + '. ' + B('Seluruh hak dilindungi.', 'All rights reserved.') + ' <a href="admin.html" rel="nofollow">Admin</a></div></div></footer>';
  }
  function mountLayout() {
    var h = el('#site-header'), f = el('#site-footer');
    if (h) h.innerHTML = header();
    if (f) f.innerHTML = footer();
    var burger = el('.burger'), nav = el('#nav');
    if (burger) burger.addEventListener('click', function () { var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    els('.lang button').forEach(function (b) { b.addEventListener('click', function () { APP.setLang(b.dataset.lang); }); });
    applyLang();
  }
  function mountNotice() {
    var c = state.cfg, n = el('#notice'); if (!n) return;
    if (c.pengumuman) n.innerHTML = '<div class="notice"><div class="wrap">' + B(esc(c.pengumuman), esc(c.pengumuman_en || c.pengumuman)) + '</div></div>';
    else if (String(c.pendaftaran_buka).toUpperCase() === 'N') n.innerHTML = '<div class="notice"><div class="wrap">' + B('Pendaftaran sertifikasi sedang ditutup. Pantau halaman Jadwal atau hubungi Admin LSP UMB.', 'Registration is currently closed. Check the Schedule page or contact LSP UMB.') + '</div></div>';
    else n.innerHTML = '';
    var f = el('#site-footer'); if (f) f.innerHTML = footer(); applyLang();
  }
  APP.refreshChrome = function () { mountNotice(); };

  /* ---------- start ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    mountLayout();
    var page = document.body.getAttribute('data-page');
    var done = function () { mountNotice(); if (APP.pages && APP.pages[page]) APP.pages[page](); applyLang(); };
    if (page === 'admin') { if (APP.pages && APP.pages.admin) APP.pages.admin(); return; }
    APP.load().then(done);
  });
})(window);
