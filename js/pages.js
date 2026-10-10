/* Logika per halaman. */
(function (g) {
  'use strict';
  var A = g.LSP, B = A.B, esc = A.esc, el = A.el, els = A.els, DATA = A.DATA, S = A.state;
  var pages = A.pages = {};

  /* ---------- komponen bersama ---------- */
  function tagHtml(s) { return '<span class="tag ' + s.jenis.toLowerCase() + '">' + esc(s.jenis) + '</span>'; }
  function skemaTitle(s) { return B(esc(s.nama), esc(s.namaEn)); }
  function prodiList(s) { return s.semuaProdi ? B('Semua program studi', 'All study programs') : esc(s.prodi.map(A.prodiName).join(', ')); }
  function skemaCard(s) {
    return '<article class="card skema-card"><div>' + tagHtml(s) + ' <span class="tag" style="background:#eee;color:#444">' + s.units.length + ' ' + B('unit', 'units') + '</span></div>' +
      '<h3>' + skemaTitle(s) + '</h3><div class="meta">' + B('Program studi: ', 'Study program: ') + prodiList(s) + '</div>' +
      '<div class="go"><button class="btn ghost small" data-open="' + s.id + '">' + B('Lihat detail & persyaratan', 'Details & requirements') + '</button></div></article>';
  }
  function bindOpen(root) { els('[data-open]', root).forEach(function (b) { b.addEventListener('click', function () { openSkema(b.getAttribute('data-open')); }); }); }

  function ensureDialog() {
    var d = el('#skema-dlg'); if (d) return d;
    d = document.createElement('dialog'); d.id = 'skema-dlg'; document.body.appendChild(d);
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    d.addEventListener('close', function () { if (location.hash.indexOf('#skema-') === 0) history.replaceState(null, '', location.pathname + location.search); });
    return d;
  }
  function openSkema(id) {
    var s = A.skemaById(id); if (!s) return;
    var d = ensureDialog(), c = S.cfg;
    var bukti = [s.buktiTranskrip, s.buktiMagang, 'Fotokopi Kartu Tanda Penduduk (KTP)', 'Fotokopi Kartu Tanda Mahasiswa (KTM)', 'Slip pembayaran uji kompetensi skema', 'Pasfoto 3x4 latar belakang warna merah sebanyak 3 lembar'];
    var buktiEn = ['Photocopy of provisional transcript (semesters 1–6) showing the required courses (see requirement 6.1 above)', 'Photocopy of internship / field practice certificate or statement in the relevant field', 'Photocopy of national ID card (KTP)', 'Photocopy of student ID card (KTM)', 'Proof of payment of the competency test fee', 'Three 3x4 passport photos with red background'];
    var html = '<div class="dlg-head"><div>' + tagHtml(s) + '<h2 style="margin:.2em 0 0;font-size:1.35rem">' + skemaTitle(s) + '</h2></div><button class="dlg-close" type="button" id="dlg-x">' + B('Tutup', 'Close') + '</button></div><div class="dlg-body">' +
      '<div class="facts"><div><b>' + B('Nomor skema', 'Scheme no.') + '</b>' + esc(s.nomor) + '</div><div><b>' + B('Jumlah unit', 'Units') + '</b>' + s.units.length + '</div><div><b>' + B('Biaya', 'Fee') + '</b>' + A.rupiah(c.biaya || s.biaya) + '</div><div><b>' + B('Disahkan', 'Approved') + '</b>' + esc(s.disahkan) + '</div></div>' +
      '<h3>' + B('Program studi yang dapat mendaftar', 'Eligible study programs') + '</h3><p>' + prodiList(s) + '</p>' +
      '<h3>' + B('Persyaratan dasar pemohon', 'Basic requirements') + '</h3><ol>' + s.syarat.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
      '<p class="small muted">' + B('Redaksi persyaratan mengikuti dokumen skema resmi LSP UMB (bagian 6).', 'Wording follows the official LSP UMB scheme document (section 6).') + '</p>' +
      '<h3>' + B('Berkas yang dibawa ke Kantor LSP', 'Documents to bring to the LSP office') + '</h3><ul><li>' + B('FR.APL.01 dan FR.APL.02 yang sudah dicetak (diunduh dari situs ini setelah mendaftar)', 'Printed FR.APL.01 and FR.APL.02 (downloaded from this site after registering)') + '</li>' +
      bukti.map(function (x, i) { return '<li>' + B(esc(x), esc(buktiEn[i])) + '</li>'; }).join('') + '</ul>' +
      '<h3>' + B('Unit kompetensi', 'Units of competency') + ' (' + s.units.length + ')</h3><div class="tbl-wrap"><table class="tbl"><thead><tr><th>No</th><th>' + B('Kode unit', 'Unit code') + '</th><th>' + B('Judul unit', 'Unit title') + '</th></tr></thead><tbody>' +
      s.units.map(function (u, i) { return '<tr><td>' + (i + 1) + '</td><td class="kode">' + esc(u.kode) + '</td><td>' + esc(u.judul) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<p class="small muted" style="margin-top:8px">' + B('Judul unit mengikuti standar kompetensi dalam bahasa Indonesia.', 'Unit titles follow the competency standard in Indonesian.') + '</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:18px"><a class="btn" href="daftar.html?skema=' + s.id + '">' + B('Daftar skema ini', 'Apply for this scheme') + '</a><a class="btn ghost" href="' + esc(s.pdf) + '" target="_blank" rel="noopener">' + B('Unduh dokumen skema (PDF)', 'Download scheme document (PDF)') + '</a></div></div>';
    d.innerHTML = html; el('#dlg-x', d).addEventListener('click', function () { d.close(); });
    if (!d.open) { if (d.showModal) d.showModal(); else d.setAttribute('open', ''); }
    history.replaceState(null, '', '#skema-' + s.id);
  }
  A.openSkema = openSkema;
  function openFromHash() { var m = /^#skema-(\d+)/.exec(location.hash); if (m) openSkema(m[1]); }

  function statusInfo(st) {
    var k = String(st || 'Terbuka').toLowerCase();
    var map = { terbuka: ['Terbuka', 'Open'], penuh: ['Penuh', 'Full'], selesai: ['Selesai', 'Finished'], dibatalkan: ['Dibatalkan', 'Cancelled'] };
    var m = map[k] || [st, st]; return { cls: k, html: B(esc(m[0]), esc(m[1])) };
  }
  function jadwalItem(j) {
    var p = A.parseDate(j.tanggal) || { d: '', m: 0, y: '' }, st = statusInfo(j.status);
    var waktu = (j.jam_mulai ? j.jam_mulai : '') + (j.jam_selesai ? ' – ' + j.jam_selesai : '') + (j.jam_mulai ? ' WIB' : '');
    var lok = [j.tuk, j.alamat].filter(Boolean).join(' · ');
    return '<div class="sched-item"><div class="date-box"><div class="d">' + p.d + '</div><div class="m">' + B(A.BLN_ID[p.m] + ' ' + p.y, A.BLN_EN[p.m] + ' ' + p.y) + '</div></div><div><h3>' + esc(j.jenis || 'Uji Kompetensi') + (j.skema ? ' · ' + esc(j.skema) : '') + '</h3>' +
      '<p>' + [waktu, lok].filter(Boolean).map(esc).join(' · ') + '</p>' + (j.kuota ? '<p>' + B('Kuota: ', 'Quota: ') + esc(j.kuota) + '</p>' : '') + (j.catatan ? '<p>' + esc(j.catatan) + '</p>' : '') +
      (j.maps_url ? '<p><a href="' + esc(j.maps_url) + '" target="_blank" rel="noopener">' + B('Lihat lokasi di peta', 'View on map') + '</a></p>' : '') + '</div><span class="status ' + st.cls + '">' + st.html + '</span></div>';
  }
  function renderJadwal(box, limit, showPast) {
    var today = A.todayIso();
    var all = (S.jadwal || []).filter(function (j) { return j.tampil !== 'N' && j.tanggal; });
    var up = all.filter(function (j) { return String(j.tanggal).slice(0, 10) >= today && String(j.status).toLowerCase() !== 'selesai'; }).sort(function (a, b) { return a.tanggal < b.tanggal ? -1 : 1; });
    var past = all.filter(function (j) { return up.indexOf(j) < 0; }).sort(function (a, b) { return a.tanggal < b.tanggal ? 1 : -1; });
    var h = '';
    if (!up.length) h += '<div class="empty">' + B('Belum ada jadwal uji kompetensi yang dipublikasikan. Jadwal akan tampil di sini setelah ditetapkan oleh LSP UMB. Pantau halaman ini atau hubungi Admin LSP UMB.', 'No competency test schedule has been published yet. It will appear here once set by LSP UMB. Check back or contact LSP UMB.') + '</div>';
    else h += '<div class="sched">' + up.slice(0, limit || 99).map(jadwalItem).join('') + '</div>';
    if (showPast && past.length) h += '<h3 style="margin-top:34px">' + B('Jadwal sebelumnya', 'Past schedule') + '</h3><div class="sched">' + past.slice(0, 20).map(jadwalItem).join('') + '</div>';
    box.innerHTML = h;
  }
  function beritaCard(n) {
    var t = A.lang() === 'en' && n.judul_en ? n.judul_en : n.judul;
    return '<article class="card news-card"><a href="berita.html#' + esc(n.id) + '" class="img" style="' + (n.gambar ? 'background-image:url(' + esc(A.img(n.gambar)) + ')' : '') + '" aria-label="' + esc(n.judul) + '"></a><div class="body"><time>' + A.dateLong(n.tanggal) + '</time><h3 style="margin:0"><a href="berita.html#' + esc(n.id) + '" style="text-decoration:none;color:inherit">' + B(esc(n.judul), esc(n.judul_en || n.judul)) + '</a></h3><p class="small muted" style="margin:0">' + B(esc(n.ringkasan || ''), esc(n.ringkasan_en || n.ringkasan || '')) + '</p></div></article>';
  }
  function renderBerita(box, limit) {
    var list = (S.berita || []).filter(function (n) { return n.tampil !== 'N'; }).sort(function (a, b) { return String(a.tanggal) < String(b.tanggal) ? 1 : -1; });
    if (!list.length) { box.innerHTML = '<div class="empty">' + B('Berita kegiatan LSP UMB akan ditampilkan di sini. Untuk kabar terbaru, ikuti Instagram ' + esc(S.cfg.instagram_nama) + '.', 'LSP UMB news will appear here. For the latest updates, follow Instagram ' + esc(S.cfg.instagram_nama) + '.') + '</div>'; return list; }
    box.innerHTML = '<div class="grid g3">' + list.slice(0, limit || 99).map(beritaCard).join('') + '</div>'; return list;
  }
  function renderPengurus(box) {
    box.innerHTML = '<div class="grid g4">' + (S.pengurus || []).filter(function (p) { return p.tampil !== 'N'; }).map(function (p) {
      var ini = String(p.nama || '?').replace(/^(Dr\.|Prof\.|Drs\.|Ir\.)\s*/i, '').trim().charAt(0).toUpperCase();
      return '<div class="card person"><div class="ph" style="' + (p.foto ? 'background-image:url(' + esc(A.img(p.foto)) + ')' : '') + '">' + (p.foto ? '' : esc(ini)) + '</div><h3>' + esc(p.nama) + '</h3><p>' + B(esc(p.jabatan), esc(p.jabatan_en || p.jabatan)) + '</p></div>';
    }).join('') + '</div>';
  }
  function renderGaleri(box) {
    var g_ = (S.galeri || []).filter(function (x) { return x.tampil !== 'N' && x.url; });
    if (!g_.length) { box.closest('section').style.display = 'none'; return; }
    box.innerHTML = '<div class="gallery">' + g_.map(function (x) { return '<figure><img loading="lazy" src="' + esc(A.img(x.url)) + '" alt="' + esc(x.caption || 'Galeri LSP UMB') + '">' + (x.caption ? '<figcaption>' + B(esc(x.caption), esc(x.caption_en || x.caption)) + '</figcaption>' : '') + '</figure>'; }).join('') + '</div>';
  }
  function renderVisiMisi(sec, box) {
    var c = S.cfg;
    if (!c.visi && !c.misi) { if (sec) sec.style.display = 'none'; return; }
    var mi = function (t) { return '<ol>' + A.lines(t).map(function (x) { return '<li>' + esc(x.replace(/^\d+[.)]\s*/, '')) + '</li>'; }).join('') + '</ol>'; };
    box.innerHTML = '<div class="vm">' + (c.visi ? '<div class="card"><h3>' + B('Visi', 'Vision') + '</h3><p>' + B(esc(c.visi), esc(c.visi_en || c.visi)) + '</p></div>' : '') +
      (c.misi ? '<div class="card"><h3>' + B('Misi', 'Mission') + '</h3>' + B(mi(c.misi), mi(c.misi_en || c.misi)) + '</div>' : '') + '</div>';
  }
  function rekeningHtml() {
    var c = S.cfg;
    if (!c.rekening_nomor) return '<div class="alert warn">' + B('Nomor rekening pembayaran akan diumumkan oleh Admin LSP UMB. Mohon tanyakan kepada Admin sebelum melakukan pembayaran.', 'The payment account number will be announced by LSP UMB. Please confirm with the admin before paying.') + '</div>';
    return '<div class="alert info"><strong>' + esc(c.rekening_bank) + '</strong><br>' + B('No. rekening', 'Account no.') + ': <strong>' + esc(c.rekening_nomor) + '</strong><br>' + (c.rekening_nama ? B('Atas nama', 'Account name') + ': ' + esc(c.rekening_nama) + '<br>' : '') + B('Nominal', 'Amount') + ': <strong>' + A.rupiah(c.biaya) + '</strong></div>';
  }
  function kantorHtml() {
    var c = S.cfg; if (!c.alamat_kantor) return '';
    var wa = c.whatsapp ? '<br>WhatsApp Admin: <a href="https://wa.me/' + esc(String(c.whatsapp).replace(/\D/g, '')) + '" target="_blank" rel="noopener">' + esc(c.whatsapp) + '</a>' : '';
    return '<div class="alert info"><strong>' + B('Kantor LSP UMB (serahkan berkas di sini)', 'LSP UMB office (submit documents here)') + '</strong><br>' + esc(c.alamat_kantor) + wa + (c.jam_layanan ? '<br>' + esc(c.jam_layanan) : '') + '</div>';
  }
  A.rekeningHtml = rekeningHtml; A.kantorHtml = kantorHtml;

  /* ---------- beranda ---------- */
  pages.home = function () {
    var c = S.cfg, f = el('#hero-facts');
    var lic = c.nomor_lisensi ? (c.lisensi_url ? '<a href="' + esc(c.lisensi_url) + '" target="_blank" rel="noopener">' + esc(c.nomor_lisensi) + '</a>' : esc(c.nomor_lisensi)) : '';
    f.innerHTML = '<div class="stat"><b>' + DATA.skema.length + '</b><span>' + B('Skema sertifikasi', 'Schemes') + '</span></div>' +
      '<div class="stat"><b>' + A.rupiah(c.biaya) + '</b><span>' + B('Biaya sertifikasi', 'Fee') + '</span></div>' +
      '<div class="stat"><b>' + B('3 tahun', '3 years') + '</b><span>' + B('Masa berlaku sertifikat', 'Certificate validity') + '</span></div>' +
      (lic ? '<div class="stat wide"><b>' + lic + '</b><span>' + B('Nomor lisensi BNSP (klik untuk verifikasi)', 'BNSP license no. (click to verify)') + '</span></div>' : '');
    var sk = el('#home-skema'); sk.innerHTML = DATA.skema.map(skemaCard).join(''); bindOpen(sk);
    renderJadwal(el('#home-jadwal'), 3, false);
    renderBerita(el('#home-berita'), 3);
    renderPengurus(el('#home-pengurus'));
    renderVisiMisi(el('#home-vm-sec'), el('#home-vm'));
    renderGaleri(el('#home-galeri'));
    var t = c.tentang_tambahan; if (t) el('#home-tambahan').innerHTML = B(esc(t), esc(c.tentang_tambahan_en || t));
  };

  /* ---------- tentang ---------- */
  pages.tentang = function () {
    renderVisiMisi(el('#vm-sec'), el('#vm')); renderPengurus(el('#pengurus')); renderGaleri(el('#galeri'));
    var c = S.cfg; el('#legal').innerHTML = '<dt>' + B('Nama lembaga', 'Name') + '</dt><dd>' + esc(c.nama_lsp) + '</dd><dt>' + B('Jenis', 'Type') + '</dt><dd>' + B('LSP Pihak Pertama (LSP P1)', 'First-party certification body (LSP P1)') + '</dd><dt>' + B('Nomor lisensi BNSP', 'BNSP license no.') + '</dt><dd>' + (c.nomor_lisensi ? (c.lisensi_url ? '<a href="' + esc(c.lisensi_url) + '" target="_blank" rel="noopener">' + esc(c.nomor_lisensi) + '</a>' : esc(c.nomor_lisensi)) : B('Akan dicantumkan', 'To be published')) + '</dd><dt>Email</dt><dd><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></dd><dt>Website</dt><dd>' + esc(c.website) + '</dd>';
    var t = c.tentang_tambahan; if (t) el('#tambahan').innerHTML = '<p>' + B(esc(t), esc(c.tentang_tambahan_en || t)) + '</p>';
  };

  /* ---------- skema ---------- */
  pages.skema = function () {
    var list = el('#skema-list'), q = el('#q'), filt = 'all';
    function draw() {
      var term = (q.value || '').toLowerCase().trim();
      var r = DATA.skema.filter(function (s) { return (filt === 'all' || s.jenis === filt) && (!term || (s.nama + ' ' + s.namaEn + ' ' + s.prodi.map(A.prodiName).join(' ')).toLowerCase().indexOf(term) >= 0); });
      list.innerHTML = r.length ? r.map(skemaCard).join('') : '<div class="empty">' + B('Tidak ada skema yang cocok.', 'No matching scheme.') + '</div>'; bindOpen(list);
    }
    els('.chip[data-f]').forEach(function (b) { b.addEventListener('click', function () { filt = b.dataset.f; els('.chip[data-f]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); draw(); }); });
    q.addEventListener('input', draw); draw();
    // pengecek prodi
    var sel = el('#prodi-sel'); sel.innerHTML = '<option value="">' + A.L('— Pilih program studi —', '— Select study program —') + '</option>' + DATA.prodi.map(function (p) { return '<option value="' + p.key + '">' + esc(p.nama) + '</option>'; }).join('') + '<option value="lain">' + A.L('Program studi lainnya', 'Other study program') + '</option>';
    document.addEventListener('langchange', function () { var v = sel.value; sel.options[0].text = A.L('— Pilih program studi —', '— Select study program —'); sel.options[sel.options.length - 1].text = A.L('Program studi lainnya', 'Other study program'); sel.value = v; });
    sel.addEventListener('change', function () {
      var box = el('#prodi-result'); if (!sel.value) { box.innerHTML = ''; return; }
      var ok = DATA.skema.filter(function (s) { return s.semuaProdi || s.prodi.indexOf(sel.value) >= 0; });
      var nm = sel.value === 'lain' ? A.L('program studi Anda', 'your study program') : A.prodiName(sel.value);
      box.innerHTML = '<p><strong>' + B(ok.length + ' skema dapat diambil oleh mahasiswa ' + esc(nm), ok.length + (ok.length > 1 ? ' schemes are' : ' scheme is') + ' open to ' + esc(nm) + ' students') + '</strong></p>' +
        (sel.value === 'lain' ? '<p class="small">' + B('Skema Kewirausahaan Industri terbuka untuk semua program studi. Skema lain dibatasi pada program studi tertentu sesuai dokumen skema.', 'The Industrial Entrepreneurship scheme is open to all study programs. Other schemes are limited to specific programs per the scheme documents.') + '</p>' : '') +
        '<div class="grid g2">' + ok.map(skemaCard).join('') + '</div>'; bindOpen(box);
    });
    // matriks
    var m = '<table class="tbl"><thead><tr><th>' + B('Skema', 'Scheme') + '</th><th>' + B('Program studi yang dapat mendaftar', 'Eligible study programs') + '</th></tr></thead><tbody>' +
      DATA.skema.map(function (s) { return '<tr><td><a href="#skema-' + s.id + '" data-open="' + s.id + '">' + skemaTitle(s) + '</a> ' + tagHtml(s) + '</td><td>' + prodiList(s) + '</td></tr>'; }).join('') + '</tbody></table>';
    el('#matrix').innerHTML = m; bindOpen(el('#matrix'));
    openFromHash(); window.addEventListener('hashchange', openFromHash);
  };

  /* ---------- prosedur ---------- */
  pages.prosedur = function () {
    el('#rekening').innerHTML = rekeningHtml(); el('#kantor').innerHTML = kantorHtml();
    el('#biaya').textContent = A.rupiah(S.cfg.biaya);
  };

  /* ---------- jadwal ---------- */
  pages.jadwal = function () { renderJadwal(el('#jadwal-list'), 99, true); };

  /* ---------- berita ---------- */
  pages.berita = function () {
    var box = el('#berita-list'), art = el('#berita-detail');
    function route() {
      var id = decodeURIComponent((location.hash || '').replace(/^#/, ''));
      var n = id && (S.berita || []).filter(function (x) { return String(x.id) === id; })[0];
      if (n) {
        box.style.display = 'none'; art.style.display = 'block';
        art.innerHTML = '<p><a href="berita.html" id="back">← ' + B('Semua berita', 'All news') + '</a></p><div class="article"><time class="muted">' + A.dateLong(n.tanggal) + (n.kategori ? ' · ' + esc(n.kategori) : '') + '</time><h1 style="font-size:2rem;margin-top:.3em">' + B(esc(n.judul), esc(n.judul_en || n.judul)) + '</h1>' +
          (n.gambar ? '<img src="' + esc(A.img(n.gambar)) + '" alt="">' : '') + '<div class="isi">' + B(esc(n.isi || n.ringkasan || ''), esc(n.isi_en || n.isi || n.ringkasan || '')) + '</div>' +
          (n.link ? '<p style="margin-top:18px"><a class="btn ghost small" href="' + esc(n.link) + '" target="_blank" rel="noopener">' + B('Sumber / tautan terkait', 'Source / related link') + '</a></p>' : '') + '</div>';
        window.scrollTo(0, 0);
      } else { art.style.display = 'none'; box.style.display = 'block'; renderBerita(box); }
    }
    route(); window.addEventListener('hashchange', route);
  };

  /* ---------- kontak ---------- */
  pages.kontak = function () {
    var c = S.cfg, rows = [];
    rows.push(['Email', '<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>']);
    rows.push(['Website', esc(c.website)]);
    rows.push(['Instagram', c.instagram_url ? '<a href="' + esc(c.instagram_url) + '" target="_blank" rel="noopener">' + esc(c.instagram_nama) + '</a>' : esc(c.instagram_nama)]);
    if (c.telepon) rows.push([B('Telepon', 'Phone'), esc(c.telepon)]);
    if (c.whatsapp) rows.push(['WhatsApp', '<a href="https://wa.me/' + esc(String(c.whatsapp).replace(/\D/g, '')) + '" target="_blank" rel="noopener">' + esc(c.whatsapp) + '</a>']);
    rows.push([B('Kantor LSP UMB', 'LSP UMB office'), c.alamat_kantor ? esc(c.alamat_kantor) : B('Alamat dan lokasi resepsionis akan dicantumkan. Hubungi email di atas bila perlu petunjuk.', 'Office address will be published. Email us if you need directions.')]);
    if (c.jam_layanan) rows.push([B('Jam layanan', 'Service hours'), esc(c.jam_layanan)]);
    el('#kontak-info').innerHTML = rows.map(function (r) { return '<dt>' + (typeof r[0] === 'string' && r[0].indexOf('<') < 0 ? esc(r[0]) : r[0]) + '</dt><dd>' + r[1] + '</dd>'; }).join('');
    if (c.maps_embed_url) el('#peta').innerHTML = '<iframe title="Peta" src="' + esc(c.maps_embed_url) + '" style="border:0;width:100%;height:340px;border-radius:6px" loading="lazy" allowfullscreen></iframe>';
  };
})(window);
