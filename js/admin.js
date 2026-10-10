/* Dashboard admin LSP UMB. Semua operasi lewat GAS dengan passcode. */
(function (g) {
  'use strict';
  var A = g.LSP, esc = A.esc, el = A.el, els = A.els, DATA = A.DATA;
  var pages = A.pages = A.pages || {};
  var skemaOpts = [''].concat(DATA.skema.map(function (s) { return s.nama; }));
  var YN = ['Y', 'N'];
  var SHEETS = {
    Jadwal: { label: 'Jadwal Ujian', hint: 'Tampil di Beranda dan halaman Jadwal. Tanggal wajib diisi.', cols: ['tanggal', 'jam_mulai', 'skema', 'tuk', 'status', 'tampil'], fields: [
      { k: 'tanggal', l: 'Tanggal ujian', t: 'date', req: 1 }, { k: 'jam_mulai', l: 'Jam mulai (mis. 08:00)', t: 'text' }, { k: 'jam_selesai', l: 'Jam selesai (mis. 12:00)', t: 'text' },
      { k: 'jenis', l: 'Jenis kegiatan', t: 'text', def: 'Uji Kompetensi' }, { k: 'skema', l: 'Skema', t: 'select', o: skemaOpts },
      { k: 'tuk', l: 'Lokasi ujian / nama TUK', t: 'text', req: 1 }, { k: 'alamat', l: 'Alamat / ruangan', t: 'textarea' }, { k: 'maps_url', l: 'Tautan Google Maps (opsional)', t: 'text' },
      { k: 'kuota', l: 'Kuota (opsional)', t: 'text' }, { k: 'status', l: 'Status', t: 'select', o: ['Terbuka', 'Penuh', 'Selesai', 'Dibatalkan'], def: 'Terbuka' }, { k: 'catatan', l: 'Catatan untuk peserta', t: 'textarea' }, { k: 'tampil', l: 'Tampilkan di web', t: 'select', o: YN, def: 'Y' }] },
    Berita: { label: 'Berita', hint: 'Isi hanya berita nyata. Kolom bahasa Inggris boleh dikosongkan.', cols: ['tanggal', 'judul', 'kategori', 'tampil'], fields: [
      { k: 'tanggal', l: 'Tanggal berita', t: 'date', req: 1 }, { k: 'judul', l: 'Judul', t: 'text', req: 1 }, { k: 'judul_en', l: 'Judul (English)', t: 'text' }, { k: 'kategori', l: 'Kategori', t: 'text' },
      { k: 'ringkasan', l: 'Ringkasan (1-2 kalimat)', t: 'textarea' }, { k: 'ringkasan_en', l: 'Ringkasan (English)', t: 'textarea' }, { k: 'isi', l: 'Isi berita', t: 'textarea', rows: 8 }, { k: 'isi_en', l: 'Isi (English)', t: 'textarea', rows: 6 },
      { k: 'gambar', l: 'Tautan foto (Google Drive atau URL)', t: 'text' }, { k: 'link', l: 'Tautan sumber (mis. Instagram)', t: 'text' }, { k: 'tampil', l: 'Tampilkan di web', t: 'select', o: YN, def: 'Y' }] },
    Pengurus: { label: 'Pengurus', hint: 'Urutan kecil tampil lebih dulu.', cols: ['urutan', 'nama', 'jabatan', 'tampil'], fields: [
      { k: 'urutan', l: 'Urutan', t: 'text', def: '10' }, { k: 'nama', l: 'Nama (dengan gelar)', t: 'text', req: 1 }, { k: 'jabatan', l: 'Jabatan', t: 'text', req: 1 }, { k: 'jabatan_en', l: 'Jabatan (English)', t: 'text' }, { k: 'foto', l: 'Tautan foto', t: 'text' }, { k: 'tampil', l: 'Tampilkan', t: 'select', o: YN, def: 'Y' }] },
    Galeri: { label: 'Galeri', hint: 'Foto kegiatan. Tempel tautan berbagi Google Drive (akses "siapa saja dengan tautan").', cols: ['urutan', 'caption', 'tampil'], fields: [
      { k: 'urutan', l: 'Urutan', t: 'text', def: '10' }, { k: 'url', l: 'Tautan foto', t: 'text', req: 1 }, { k: 'caption', l: 'Keterangan', t: 'text' }, { k: 'caption_en', l: 'Keterangan (English)', t: 'text' }, { k: 'tampil', l: 'Tampilkan', t: 'select', o: YN, def: 'Y' }] },
    Config: { label: 'Pengaturan', hint: 'Pasangan kunci dan nilai: rekening, nomor lisensi, kontak, visi/misi. Ubah nilai pada baris yang ada.', key: 'kunci', noAdd: false, cols: ['kunci', 'nilai'], fields: [{ k: 'kunci', l: 'Kunci', t: 'text', req: 1 }, { k: 'nilai', l: 'Nilai', t: 'textarea', rows: 5 }] },
    UnitElemen: { label: 'Elemen & KUK (APL 02)', hint: 'Satu baris per elemen. Kolom KUK: satu kriteria per baris. Salin dari MUK.', cols: ['kode_unit', 'no_elemen', 'elemen'], fields: [
      { k: 'kode_unit', l: 'Kode unit (persis sama dengan di skema)', t: 'text', req: 1 }, { k: 'no_elemen', l: 'Nomor elemen', t: 'text', req: 1 }, { k: 'elemen', l: 'Elemen', t: 'textarea', req: 1 }, { k: 'kuk', l: 'Kriteria Unjuk Kerja (satu per baris, tanpa nomor)', t: 'textarea', rows: 8 }] },
    Pendaftar: { label: 'Pendaftar', hint: 'Data pendaftaran dari situs. Anda dapat mengubah status dan catatan.', noAdd: true, noDel: true, cols: ['waktu', 'id', 'nama', 'skemaNama', 'status'], fields: [
      { k: 'status', l: 'Status', t: 'select', o: ['Baru', 'Berkas diterima', 'Dipanggil', 'Terjadwal', 'Selesai', 'Ditolak'], def: 'Baru' }, { k: 'catatanAdmin', l: 'Catatan admin', t: 'textarea' }] }
  };
  var pass = '', cur = 'Jadwal', rows = [];

  function api(payload) { payload.pass = pass; return A.post(payload); }
  function msg(t, cls) { var m = el('#a-msg'); m.className = 'alert ' + (cls || 'info'); m.textContent = t; m.style.display = t ? '' : 'none'; if (t && cls !== 'bad') setTimeout(function () { m.style.display = 'none'; }, 4000); }
  function label(sheet, k) { var f = (SHEETS[sheet].fields || []).filter(function (x) { return x.k === k; })[0]; return f ? f.l : k; }

  function tabs() {
    el('#a-tabs').innerHTML = Object.keys(SHEETS).map(function (k) { return '<button class="chip" data-t="' + k + '" aria-pressed="' + (k === cur) + '">' + esc(SHEETS[k].label) + '</button>'; }).join('');
    els('#a-tabs .chip').forEach(function (b) { b.addEventListener('click', function () { cur = b.dataset.t; tabs(); load(); }); });
  }
  function load() {
    var sh = SHEETS[cur]; el('#a-title').textContent = sh.label; el('#a-hint').textContent = sh.hint || '';
    el('#a-add').style.display = sh.noAdd ? 'none' : ''; el('#a-csv').style.display = cur === 'Pendaftar' ? '' : 'none';
    el('#a-table').innerHTML = '<p class="loading">Memuat…</p>';
    api({ action: 'admin', op: 'list', sheet: cur }).then(function (r) {
      if (!r.ok) { if (/passcode|akses/i.test(r.error || '')) { logout(); } msg(r.error || 'Gagal memuat', 'bad'); return; }
      rows = r.rows || []; draw();
    }).catch(function () { msg('Server tidak dapat dihubungi.', 'bad'); });
  }
  function draw() {
    var sh = SHEETS[cur], cols = sh.cols, t = el('#a-table');
    if (!rows.length) { t.innerHTML = '<div class="empty">Belum ada data.' + (sh.noAdd ? '' : ' Klik “Tambah”.') + '</div>'; return; }
    var rr = rows.slice(); if (cur === 'Pendaftar') rr.reverse();
    t.innerHTML = '<div class="tbl-wrap"><table class="tbl"><thead><tr>' + cols.map(function (c) { return '<th>' + esc(label(cur, c)) + '</th>'; }).join('') + '<th></th></tr></thead><tbody>' +
      rr.map(function (r) { return '<tr>' + cols.map(function (c) { var v = r[c] == null ? '' : String(r[c]); return '<td>' + esc(v.length > 70 ? v.slice(0, 70) + '…' : v) + '</td>'; }).join('') + '<td style="white-space:nowrap"><button class="btn ghost small" data-e="' + esc(r._row) + '">Ubah</button>' + (sh.noDel ? '' : ' <button class="btn ghost small" data-d="' + esc(r._row) + '">Hapus</button>') + '</td></tr>'; }).join('') + '</tbody></table></div>';
    els('[data-e]', t).forEach(function (b) { b.addEventListener('click', function () { edit(rows.filter(function (r) { return String(r._row) === b.dataset.e; })[0]); }); });
    els('[data-d]', t).forEach(function (b) { b.addEventListener('click', function () { if (confirm('Hapus baris ini?')) api({ action: 'admin', op: 'delete', sheet: cur, row: +b.dataset.d }).then(function (r) { msg(r.ok ? 'Terhapus.' : r.error, r.ok ? '' : 'bad'); load(); }); }); });
  }
  function edit(row) {
    var sh = SHEETS[cur], d = el('#a-dlg'), isNew = !row; row = row || {};
    var info = '';
    if (cur === 'Pendaftar' && row.id) info = '<div class="skema-info" style="margin-bottom:14px"><b>' + esc(row.nama) + '</b> · NIK ' + esc(row.nik) + ' · ' + esc(row.skemaNama) + '<br>HP ' + esc(row.hp) + ' · ' + esc(row.email) + ' · ' + esc(row.prodi) + ' · NIM ' + esc(row.nim) + ' · Sem. ' + esc(row.semester) + '</div>';
    var h = '<div class="dlg-head"><h2 style="margin:0;font-size:1.25rem">' + (isNew ? 'Tambah' : 'Ubah') + ' · ' + esc(sh.label) + '</h2><button class="dlg-close" type="button" id="a-x">Tutup</button></div><form class="dlg-body" id="a-form">' + info + '<div class="fgrid">' +
      sh.fields.map(function (f) {
        var v = row[f.k] != null && row[f.k] !== '' ? row[f.k] : (isNew && f.def != null ? f.def : ''), id = 'af_' + f.k, ro = (cur === 'Config' && !isNew && f.k === 'kunci') ? ' readonly' : '';
        var inp = f.t === 'textarea' ? '<textarea id="' + id + '" rows="' + (f.rows || 3) + '">' + esc(v) + '</textarea>' : f.t === 'select' ? '<select id="' + id + '">' + f.o.map(function (o) { return '<option' + (String(o) === String(v) ? ' selected' : '') + ' value="' + esc(o) + '">' + esc(o || '(semua skema)') + '</option>'; }).join('') + '</select>' : '<input id="' + id + '" type="' + (f.t === 'date' ? 'date' : 'text') + '" value="' + esc(String(v).slice(0, f.t === 'date' ? 10 : 9999)) + '"' + ro + '>';
        return '<div class="field' + (f.t === 'textarea' ? ' full' : '') + '"><label for="' + id + '" class="' + (f.req ? 'req' : '') + '">' + esc(f.l) + '</label>' + inp + '</div>';
      }).join('') + '</div><p style="margin-top:16px"><button class="btn" type="submit">Simpan</button></p></form>';
    d.innerHTML = h; el('#a-x', d).addEventListener('click', function () { d.close(); });
    el('#a-form', d).addEventListener('submit', function (e) {
      e.preventDefault(); var data = {};
      for (var i = 0; i < sh.fields.length; i++) { var f = sh.fields[i], v = el('#af_' + f.k, d).value.trim(); if (f.req && !v) { alert('Kolom wajib: ' + f.l); return; } data[f.k] = v; }
      api({ action: 'admin', op: 'save', sheet: cur, row: row._row || 0, id: row.id || '', data: data }).then(function (r) { if (r.ok) { d.close(); msg('Tersimpan.'); sessionStorage.removeItem('lsp_pub'); load(); } else msg(r.error, 'bad'); }).catch(function () { msg('Gagal menyimpan.', 'bad'); });
    });
    d.showModal();
  }
  function csv() {
    var keys = ['waktu', 'id', 'status', 'skemaNama', 'nama', 'nik', 'tempat', 'tglLahir', 'jk', 'kebangsaan', 'alamat', 'kodepos', 'hp', 'email', 'prodi', 'nim', 'semester', 'pendidikan', 'catatanAdmin'];
    var q = function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; };
    var s = '﻿' + keys.join(',') + '\n' + rows.map(function (r) { return keys.map(function (k) { return q(k === 'nik' ? '​' + r[k] : r[k]); }).join(','); }).join('\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([s], { type: 'text/csv;charset=utf-8' })); a.download = 'pendaftar-lsp-umb.csv'; a.click();
  }
  function logout() { pass = ''; A.sstore('lsp_admin', ''); el('#a-app').style.display = 'none'; el('#a-login').style.display = ''; }
  function enter() { el('#a-login').style.display = 'none'; el('#a-app').style.display = ''; tabs(); load(); }

  pages.admin = function () {
    if (!A.CFG.API_URL) { el('#a-login').innerHTML = '<div class="alert warn">API_URL belum diisi di <code>js/config.js</code>. Selesaikan langkah pemasangan Google Apps Script terlebih dahulu.</div>'; return; }
    el('#a-login-form').addEventListener('submit', function (e) {
      e.preventDefault(); var p = el('#a-pass').value; var b = el('#a-go'); b.disabled = true; el('#a-lmsg').textContent = '';
      A.post({ action: 'admin', op: 'ping', pass: p }).then(function (r) {
        b.disabled = false;
        if (r.ok) { pass = p; A.sstore('lsp_admin', p); enter(); } else el('#a-lmsg').textContent = r.error || 'Passcode salah.';
      }).catch(function () { b.disabled = false; el('#a-lmsg').textContent = 'Server tidak dapat dihubungi.'; });
    });
    el('#a-add').addEventListener('click', function () { edit(null); });
    el('#a-csv').addEventListener('click', csv); el('#a-out').addEventListener('click', logout);
    var saved = A.sstore('lsp_admin'); if (saved) { pass = saved; enter(); }
  };
})(window);
