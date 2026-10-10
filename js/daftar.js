/* Halaman pendaftaran (daftar.html) dan hasil dokumen (apl.html). */
(function (g) {
  'use strict';
  var A = g.LSP, esc = A.esc, el = A.el, els = A.els, DATA = A.DATA, S = A.state, B = A.B;
  var pages = A.pages = A.pages || {};
  var T0 = Date.now();

  function msg(id, en) { return A.L(id, en); }
  function eligible(s, prodi) { return s.semuaProdi || s.prodi.indexOf(prodi) >= 0; }

  pages.daftar = function () {
    var f = el('#f'), selS = el('#skema'), selP = el('#prodi'), info = el('#skema-info'), warn = el('#elig'), btn = el('#submit'), out = el('#form-msg');
    if (String(S.cfg.pendaftaran_buka).toUpperCase() === 'N') { f.style.display = 'none'; el('#closed').style.display = 'block'; return; }
    selS.innerHTML = '<option value="">' + msg('— Pilih skema —', '— Select scheme —') + '</option>' + DATA.skema.map(function (s) { return '<option value="' + s.id + '">' + esc(s.jenis + ' · ' + s.nama) + '</option>'; }).join('');
    selP.innerHTML = '<option value="">' + msg('— Pilih program studi —', '— Select study program —') + '</option>' + DATA.prodi.map(function (p) { return '<option value="' + p.key + '">' + esc(p.nama) + '</option>'; }).join('') + '<option value="lain">' + msg('Program studi lainnya', 'Other study program') + '</option>';
    var q = /[?&]skema=(\d+)/.exec(location.search); if (q && A.skemaById(q[1])) selS.value = q[1];
    var pendTouched = false;
    el('#pendidikan').addEventListener('input', function () { pendTouched = true; });
    function autoPend() {
      if (pendTouched) return; var p = selP.value && selP.value !== 'lain' ? A.prodiName(selP.value) : (el('#prodi_lain').value || '');
      el('#pendidikan').value = p ? 'Mahasiswa S1 Program Studi ' + p + ', Universitas Muhammadiyah Bengkulu' : '';
    }
    function check() {
      var s = A.skemaById(selS.value), p = selP.value;
      el('#prodi_lain_wrap').style.display = p === 'lain' ? '' : 'none';
      if (s) {
        info.style.display = ''; info.innerHTML = '<strong>' + B(esc(s.nama), esc(s.namaEn)) + '</strong> · ' + esc(s.jenis) + ' · ' + s.units.length + ' ' + B('unit kompetensi', 'units') + '<br><span class="muted">' + B('Syarat: ', 'Requirement: ') + esc(s.syarat[0]) + '</span> <button type="button" class="btn ghost small" id="see" style="margin-top:6px">' + B('Lihat detail', 'See details') + '</button>';
        el('#see').addEventListener('click', function () { A.openSkema(s.id); });
      } else info.style.display = 'none';
      if (s && p && !eligible(s, p)) { warn.className = 'alert bad'; warn.style.display = ''; warn.innerHTML = B('Skema ini hanya untuk program studi: ' + esc(s.prodi.map(A.prodiName).join(', ')) + '. Silakan pilih skema lain di halaman Skema atau cek skema sesuai prodi Anda.', 'This scheme is only for: ' + esc(s.prodi.map(A.prodiName).join(', ')) + '. Please pick another scheme or use the study-program checker.'); }
      else warn.style.display = 'none';
      autoPend();
    }
    selS.addEventListener('change', check); selP.addEventListener('change', check); el('#prodi_lain').addEventListener('input', autoPend); check();
    document.addEventListener('langchange', function () { var a = selS.value, b = selP.value; selS.options[0].text = msg('— Pilih skema —', '— Select scheme —'); selP.options[0].text = msg('— Pilih program studi —', '— Select study program —'); selP.options[selP.options.length - 1].text = msg('Program studi lainnya', 'Other study program'); selS.value = a; selP.value = b; });

    function val(id) { var n = el('#' + id); return n ? String(n.value).trim() : ''; }
    function fail(id, id_msg, en_msg) { var n = el('#' + id); out.className = 'alert bad'; out.textContent = msg(id_msg, en_msg); if (n) { n.focus(); n.scrollIntoView({ block: 'center', behavior: 'smooth' }); } return false; }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn.disabled) return;
      var s = A.skemaById(selS.value); if (!s) return fail('skema', 'Pilih skema sertifikasi.', 'Select a certification scheme.');
      if (!selP.value) return fail('prodi', 'Pilih program studi.', 'Select your study program.');
      if (!eligible(s, selP.value)) return fail('skema', 'Program studi Anda tidak termasuk dalam skema ini.', 'Your study program is not eligible for this scheme.');
      if (!val('nama')) return fail('nama', 'Nama lengkap wajib diisi.', 'Full name is required.');
      if (!/^\d{16}$/.test(val('nik'))) return fail('nik', 'NIK harus 16 digit angka.', 'National ID (NIK) must be 16 digits.');
      if (!val('tempat') || !val('tgl')) return fail('tempat', 'Tempat dan tanggal lahir wajib diisi.', 'Place and date of birth are required.');
      if (!f.jk.value) return fail('jk-l', 'Pilih jenis kelamin.', 'Select gender.');
      if (!val('alamat')) return fail('alamat', 'Alamat rumah wajib diisi.', 'Home address is required.');
      if (!/^(\+62|62|0)8\d{7,12}$/.test(val('hp').replace(/[\s-]/g, ''))) return fail('hp', 'Nomor HP tidak valid (contoh 081234567890).', 'Invalid mobile number (e.g. 081234567890).');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val('email'))) return fail('email', 'Email tidak valid.', 'Invalid email.');
      if (!val('nim')) return fail('nim', 'NIM wajib diisi.', 'Student ID (NIM) is required.');
      if (val('semester') === 'bawah') return fail('semester', 'Persyaratan skema: mahasiswa aktif semester VII atau lebih.', 'Scheme requirement: active student in semester VII or above.');
      if (!val('semester')) return fail('semester', 'Pilih semester.', 'Select semester.');
      if (!el('#setuju').checked) return fail('setuju', 'Centang pernyataan kebenaran data.', 'Please confirm the declaration.');
      var prodiNama = selP.value === 'lain' ? (val('prodi_lain') || 'Lainnya') : A.prodiName(selP.value);
      var reg = {
        skemaId: s.id, skemaNama: s.nama, nama: val('nama'), nik: val('nik'), tempat: val('tempat'), tglLahir: val('tgl'), jk: f.jk.value, kebangsaan: val('kebangsaan') || 'Indonesia',
        alamat: val('alamat'), kodepos: val('kodepos'), telpRumah: val('telpRumah'), telpKantor: val('telpKantor'), hp: val('hp'), email: val('email'),
        pendidikan: val('pendidikan'), prodi: prodiNama, nim: val('nim'), semester: val('semester'),
        institusi: val('institusi'), jabatan: val('jabatan'), alamatKantor: val('alamatKantor'), kodeposKantor: val('kodeposKantor'), telpInstitusi: val('telpInstitusi'), fax: val('fax'), emailInstitusi: val('emailInstitusi')
      };
      btn.disabled = true; out.className = 'alert info'; out.textContent = msg('Menyimpan pendaftaran…', 'Saving your registration…');
      var proceed = function (id, saved) {
        reg.id = id; reg.saved = saved; reg.tanggal = A.todayIso();
        var j = JSON.stringify(reg); A.sstore('lsp_reg', j); A.store('lsp_reg_last', j);
        location.href = 'apl.html#d=' + encodeURIComponent(btoa(unescape(encodeURIComponent(j))));
      };
      if (!A.CFG.API_URL) return proceed('LOKAL-' + Date.now().toString(36).toUpperCase(), false);
      A.post({ action: 'daftar', data: reg, hp_field: val('website'), t0: T0 }).then(function (r) {
        if (r && r.ok) proceed(r.id, true);
        else { btn.disabled = false; out.className = 'alert bad'; out.textContent = (r && r.error) ? r.error : msg('Gagal menyimpan. Coba lagi.', 'Could not save. Please retry.'); }
      }).catch(function () {
        btn.disabled = false; out.className = 'alert warn';
        out.innerHTML = msg('Server LSP tidak dapat dihubungi. Anda tetap bisa melanjutkan untuk mengunduh formulir, namun data Anda belum tercatat di sistem. ', 'The LSP server could not be reached. You can continue to download the forms, but your data is not yet recorded. ') + '<button type="button" class="btn small" id="cont">' + msg('Lanjutkan tanpa menyimpan', 'Continue without saving') + '</button>';
        el('#cont').addEventListener('click', function () { proceed('LOKAL-' + Date.now().toString(36).toUpperCase(), false); });
      });
    });
  };

  /* ---------- apl.html ---------- */
  pages.apl = function () {
    var raw = null, reg = null, hm = /^#d=(.+)$/.exec(location.hash || '');
    if (hm) { try { raw = decodeURIComponent(escape(atob(decodeURIComponent(hm[1])))); A.sstore('lsp_reg', raw); A.store('lsp_reg_last', raw); history.replaceState(null, '', location.pathname); } catch (e) {} }
    raw = raw || A.sstore('lsp_reg') || A.store('lsp_reg_last');
    try { reg = JSON.parse(raw); } catch (e) {}
    var sk = reg && A.skemaById(reg.skemaId);
    if (!reg || !sk) { el('#apl-empty').style.display = 'block'; el('#apl-main').style.display = 'none'; return; }
    var APL = g.LSP_APL, foot = 'No. pendaftaran ' + reg.id + ' · ' + sk.nomor + ' · lsp.umb.ac.id';
    var b1 = APL.apl01(reg, sk), b2 = APL.apl02(reg, sk, S.elemen);
    el('#sheet1').innerHTML = APL.toHtml(b1, foot); el('#sheet2').innerHTML = APL.toHtml(b2, foot);
    el('#reg-id').textContent = reg.id; el('#reg-nama').textContent = reg.nama; el('#reg-skema').innerHTML = B(esc(sk.nama), esc(sk.namaEn));
    if (!reg.saved) el('#unsaved').style.display = 'block';
    var haveEl = sk.units.some(function (u) { return S.elemen && S.elemen[u.kode] && S.elemen[u.kode].length; });
    if (!haveEl) el('#noelemen').style.display = 'block';
    el('#bayar').innerHTML = A.rekeningHtml() + A.kantorHtml();
    var bukti = [sk.buktiTranskrip, sk.buktiMagang, 'Fotokopi Kartu Tanda Penduduk (KTP)', 'Fotokopi Kartu Tanda Mahasiswa (KTM)', 'Slip pembayaran uji kompetensi skema', 'Pasfoto 3x4 latar belakang warna merah sebanyak 3 lembar'];
    el('#checklist').innerHTML = '<li>FR.APL.01 + FR.APL.02 ' + B('(sudah dicetak dan ditandatangani)', '(printed and signed)') + '</li>' + bukti.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    function fname(n) { return 'FR.APL.0' + n + '_' + reg.nama.replace(/[^\w]+/g, '_').slice(0, 40) + '_' + sk.slug + '.docx'; }
    function loadDocx() {
      if (g.docx) return Promise.resolve();
      return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = 'js/vendor/docx.umd.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
    }
    function dl(n, blocks) {
      var b = el('#dl' + n); b.disabled = true;
      loadDocx().then(function () { return APL.toBlob(blocks, foot); }).then(function (blob) {
        var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fname(n); document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); b.disabled = false;
      }).catch(function () { b.disabled = false; alert(A.L('Gagal membuat file. Gunakan tombol Cetak / PDF.', 'Could not create the file. Use the Print / PDF button.')); });
    }
    var nt = el('#newtab'); if (nt) nt.addEventListener('click', function () { window.open('apl.html#d=' + encodeURIComponent(btoa(unescape(encodeURIComponent(raw)))), '_blank'); });
    el('#dl1').addEventListener('click', function () { dl(1, b1); }); el('#dl2').addEventListener('click', function () { dl(2, b2); });
    function pr(mode) { document.body.className = 'print-' + mode; setTimeout(function () { window.print(); }, 50); }
    el('#pr1').addEventListener('click', function () { pr('1'); }); el('#pr2').addEventListener('click', function () { pr('2'); }); el('#pr12').addEventListener('click', function () { pr('all'); });
    window.addEventListener('afterprint', function () { document.body.className = ''; });
  };
})(window);
