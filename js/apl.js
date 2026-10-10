/* Pembuat dokumen FR.APL.01 dan FR.APL.02 LSP UMB.
   Struktur, urutan baris, dan redaksi mengikuti templat resmi (FR.APL.01 dan FR.APL.02) yang ada di proyek.
   Satu definisi dokumen (blok) dirender ke dua keluaran: HTML (cetak/PDF) dan .docx. */
(function (g) {
  'use strict';
  var BOX = '☐', CHK = '☒';
  function R(text, o) { o = o || {}; return { text: text == null ? '' : String(text), b: !!o.b, i: !!o.i, s: !!o.s, u: !!o.u, sz: o.sz }; }
  function P(runs, o) { o = o || {}; if (runs == null) runs = ''; if (typeof runs === 'string') runs = [R(runs)]; return { runs: runs, al: o.al, gap: o.gap }; }
  function C(paras, o) { o = o || {}; if (!Array.isArray(paras)) paras = [paras]; paras = paras.map(function (p) { return typeof p === 'string' ? P(p) : p; }); return { p: paras, span: o.span || 1, rspan: o.rspan || 1, bg: o.bg, al: o.al, va: o.va }; }
  function T(text, o) { o = o || {}; return C([P([R(text, o)], { al: o.al })], o); }

  var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  function tglIndo(iso) {
    if (!iso) return '';
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso); if (!m) return iso;
    return parseInt(m[3], 10) + ' ' + BULAN[parseInt(m[2], 10) - 1] + ' ' + m[1];
  }
  var DOT = '……………………';

  /* ---------- FR.APL.01 ---------- */
  function apl01(reg, sk) {
    var L = reg.jk === 'L', Pw = reg.jk === 'P';
    var jk = C([P([R('Laki-laki', { s: Pw }), R(' / '), R('Wanita', { s: L }), R(' *)')])]);
    var blocks = [];
    blocks.push({ t: 'title', text: 'FR.APL.01. PERMOHONAN SERTIFIKASI KOMPETENSI' });
    blocks.push({ t: 'p', runs: [R('Bagian 1 : Rincian Data Pemohon Sertifikasi', { b: true })] });
    blocks.push({ t: 'p', runs: [R('Pada bagian ini, cantumlan data pribadi, data pendidikan formal serta data pekerjaan anda pada saat ini.')] });
    blocks.push({ t: 'p', runs: [R('a.  Data Pribadi', { b: true })] });
    blocks.push({ t: 'table', w: [30, 3, 67], rows: [
      [T('Nama lengkap'), T(':'), T(reg.nama)],
      [T('No. KTP/NIK/Paspor'), T(':'), T(reg.nik)],
      [T('Tempat / tgl. Lahir'), T(':'), T((reg.tempat || '') + (reg.tglLahir ? ', ' + tglIndo(reg.tglLahir) : ''))],
      [T('Jenis kelamin'), T(':'), jk],
      [T('Kebangsaan'), T(':'), T(reg.kebangsaan)],
      [T('Alamat rumah'), T(':'), C([P(reg.alamat), P('Kode pos : ' + (reg.kodepos || ''))])],
      [T('No. Telepon/E-mail'), T(':'), C([P('Rumah : ' + (reg.telpRumah || '') + '     Kantor : ' + (reg.telpKantor || '')), P('HP : ' + (reg.hp || '') + '     E-mail : ' + (reg.email || ''))])],
      [T('Kualifikasi Pendidikan'), T(':'), T(reg.pendidikan)]
    ] });
    blocks.push({ t: 'p', runs: [R('*Coret yang tidak perlu', { i: true })] });
    blocks.push({ t: 'p', runs: [R('b.  Data Pekerjaan Sekarang', { b: true })] });
    blocks.push({ t: 'table', w: [30, 3, 67], rows: [
      [T('Nama Institusi / Perusahaan'), T(':'), T(reg.institusi)],
      [T('Jabatan'), T(':'), T(reg.jabatan)],
      [T('Alamat Kantor'), T(':'), C([P(reg.alamatKantor), P('Kode pos : ' + (reg.kodeposKantor || ''))])],
      [T('No. Telp/Fax/E-mail'), T(':'), C([P('Telp   : ' + (reg.telpInstitusi || '') + '     Fax : ' + (reg.fax || '')), P('E-mail : ' + (reg.emailInstitusi || ''))])]
    ] });
    blocks.push({ t: 'p', runs: [R('Bagian 2 : Data Sertifikasi', { b: true })] });
    blocks.push({ t: 'p', runs: [R('Tuliskan Judul dan Nomor Skema Sertifikasi yang anda ajukan berikut Daftar Unit Kompetensi sesuai kemasan pada skema sertifikasi untuk mendapatkan pengakuan sesuai dengan latar belakang pendidikan, pelatihan serta pengalaman kerja yang anda miliki.')] });
    blocks.push({ t: 'table', w: [26, 14, 3, 57], rows: [
      [C([P('Skema Sertifikasi (KKNI/Okupasi/Klaster)')], { rspan: 2 }), T('Judul'), T(':', { b: true }), T(sk.jenis + ' ' + sk.nama)],
      [T('Nomor'), T(':', { b: true }), T(sk.nomor)],
      [C([P([R('Tujuan Asesmen')])], { span: 2 }), T(':', { b: true }), C([P(CHK + ' Sertifikasi'), P(BOX + ' Pengakuan Kompetensi Terkini (PKT)'), P(BOX + ' Rekognisi Pembelajaran Lampau (RPL)'), P(BOX + ' Lainnya')])]
    ] });
    blocks.push({ t: 'p', runs: [R('Daftar Unit Kompetensi sesuai kemasan:', { b: true })] });
    var rows = [[T('No.', { b: true, al: 'c', bg: 'h' }), T('Kode Unit', { b: true, al: 'c', bg: 'h' }), T('Judul Unit', { b: true, al: 'c', bg: 'h' }), T('Standar Kompetensi Kerja', { b: true, al: 'c', bg: 'h' })]];
    sk.units.forEach(function (u, i) { rows.push([T((i + 1) + '.'), T(u.kode), T(u.judul), T('SKKNI')]); });
    blocks.push({ t: 'table', w: [7, 22, 51, 20], rows: rows });
    blocks.push({ t: 'p', runs: [R('Bagian 3 : Bukti Kelengkapan Pemohon', { b: true })] });
    blocks.push({ t: 'p', runs: [R('a.  Bukti Persyaratan Dasar Pemohon', { b: true })] });
    function bukti(head, items) {
      var r = [
        [T('No.', { b: true, al: 'c', bg: 'h', }), T(head, { b: true, al: 'c', bg: 'h' }), T('Ada', { b: true, al: 'c', bg: 'h', span: 2 }), T('Tidak Ada', { b: true, al: 'c', bg: 'h', rspan: 2 })],
        [T('', { bg: 'h' }), T('', { bg: 'h' }), T('Memenuhi Syarat', { b: true, al: 'c', bg: 'h' }), T('Tidak Memenuhi Syarat', { b: true, al: 'c', bg: 'h' })]
      ];
      items.forEach(function (x, i) { r.push([T((i + 1) + '.'), T(x), T(BOX, { al: 'c' }), T(BOX, { al: 'c' }), T('')]); });
      return { t: 'table', w: [6, 50, 15, 15, 14], rows: r };
    }
    // baris judul pertama memakai rowspan: sederhanakan agar konsisten di HTML dan docx
    var dasar = bukti('Bukti Persyaratan Dasar', [sk.buktiTranskrip, sk.buktiMagang]);
    dasar.rows[0][0] = T('No.', { b: true, al: 'c', bg: 'h', rspan: 2 }); dasar.rows[0][1] = T('Bukti Persyaratan Dasar', { b: true, al: 'c', bg: 'h', rspan: 2 }); dasar.rows[1].splice(0, 2);
    blocks.push(dasar);
    blocks.push({ t: 'p', runs: [R('b.  Bukti Administratif', { b: true })] });
    var adm = bukti('Bukti Administratif', ['Fotokopi Kartu Tanda Penduduk (KTP)', 'Fotokopi Kartu Tanda Mahasiswa (KTM)', 'Slip Pembayaran Uji Kompetensi Skema', 'Pasfoto 3x4 latar belakang warna merah sebanyak 3 lembar']);
    adm.rows[0][0] = T('No.', { b: true, al: 'c', bg: 'h', rspan: 2 }); adm.rows[0][1] = T('Bukti Administratif', { b: true, al: 'c', bg: 'h', rspan: 2 }); adm.rows[1].splice(0, 2);
    blocks.push(adm);
    blocks.push({ t: 'gap' });
    blocks.push({ t: 'table', keep: true, w: [42, 22, 36], rows: [
      [C([P([R('Rekomendasi (diisi oleh LSP):', { b: true })]), P([R('Berdasarkan ketentuan persyaratan dasar, maka pemohon:')]), P([R('Diterima/ Tidak diterima *)', { b: true }), R(' sebagai peserta sertifikasi')]), P([R('* coret yang tidak sesuai')])], { rspan: 3 }), C([P([R('Pemohon/ Kandidat :', { b: true })])], { span: 2 })],
      [T('Nama'), T(reg.nama)],
      [T('Tanda tangan/ Tanggal'), C([P(''), P('')])],
      [C([P([R('Catatan :', { b: true })]), P(''), P('')], { rspan: 3 }), C([P([R('Admin LSP :', { b: true })])], { span: 2 })],
      [T('Nama :'), T('')],
      [T('Tanda tangan/ Tanggal'), C([P(''), P('')])]
    ] });
    return blocks;
  }

  /* ---------- FR.APL.02 ---------- */
  function apl02(reg, sk, elemenMap) {
    elemenMap = elemenMap || {};
    var b = [];
    b.push({ t: 'title', text: 'FR.APL.02. ASESMEN MANDIRI' });
    b.push({ t: 'table', w: [34, 14, 3, 49], rows: [
      [C([P('Skema Sertifikasi (KKNI/Okupasi/Klaster)')], { rspan: 2 }), T('Judul'), T(':'), T(sk.jenis + ' ' + sk.nama)],
      [T('Nomor'), T(':'), T(sk.nomor)]
    ] });
    b.push({ t: 'gap' });
    b.push({ t: 'table', w: [100], rows: [
      [C([P([R('PANDUAN ASESMEN MANDIRI', { b: true })], { al: 'c' })], { bg: 'h' })],
      [C([P([R('Instruksi:', { b: true })]),
        P('•  Baca setiap pertanyaan di kolom sebelah kiri'),
        P('•  Beri tanda centang (√) pada kotak jika Anda yakin dapat melakukan tugas yang dijelaskan.'),
        P('•  Isi kolom di sebelah kanan dengan menuliskan bukti yang relevan anda miliki untuk menunjukkan bahwa anda melakukan pekerjaan.')])]
    ] });
    sk.units.forEach(function (u, ui) {
      b.push({ t: 'gap' });
      b.push({ t: 'table', keep: 'all', w: [26, 17, 3, 54], rows: [
        [C([P([R('Unit Kompetensi ' + (ui + 1), { b: true })])], { rspan: 2, bg: 'h' }), T('Kode Unit'), T(':'), T(u.kode)],
        [T('Judul Unit'), T(':'), T(u.judul)]
      ] });
      var el = elemenMap[u.kode];
      var rows = [[T('Dapatkah Saya ?', { b: true, bg: 'h' }), T('K', { b: true, al: 'c', bg: 'h' }), T('BK', { b: true, al: 'c', bg: 'h' }), T('Bukti yang relevan', { b: true, al: 'c', bg: 'h' })]];
      if (el && el.length) {
        el.forEach(function (e, ei) {
          var ps = [P([R((ei + 1) + '. Elemen: '), R(e.elemen, { b: true })]), P([R('Kriteria Unjuk Kerja:')])];
          (e.kuk || []).forEach(function (k, ki) { ps.push(P((ei + 1) + '.' + (ki + 1) + ' ' + k)); });
          rows.push([C(ps), T(BOX, { al: 'c' }), T(BOX, { al: 'c' }), T('')]);
        });
      } else {
        for (var n = 1; n <= 2; n++) {
          rows.push([C([P([R(n + '. Elemen: '), R(DOT, { b: true })]), P('Kriteria Unjuk Kerja:'), P(n + '.1 ' + DOT), P(n + '.2 ' + DOT), P(n + '.3 ' + DOT)]), T(BOX, { al: 'c' }), T(BOX, { al: 'c' }), T('')]);
        }
      }
      b.push({ t: 'table', keepN: 1, w: [52, 7, 7, 34], rows: rows });
    });
    b.push({ t: 'gap' });
    b.push({ t: 'table', keep: true, w: [38, 24, 38], rows: [
      [C([P([R('Rekomendasi Untuk Asesi:', { b: true })]), P('Asesmen dapat / tidak dapat dilanjutkan')], { rspan: 3 }), C([P([R('Asesi :', { b: true })])], { span: 2 })],
      [T('Nama'), T(reg.nama)],
      [T('Tanda tangan/ Tanggal'), C([P(''), P('')])],
      [C([P('')], { rspan: 3 }), C([P([R('Ditinjau Oleh Asesor :', { b: true })])], { span: 2 })],
      [T('Nama :'), T('')],
      [T('No. Reg:'), T('')],
      [T('Tanda tangan/ Tanggal'), C([P(''), P('')])]
    ] });
    return b;
  }

  /* ---------- Renderer HTML ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function runHtml(r) {
    var s = esc(r.text); if (r.b) s = '<b>' + s + '</b>'; if (r.i) s = '<i>' + s + '</i>'; if (r.s) s = '<s>' + s + '</s>'; return s;
  }
  function toHtml(blocks, footer) {
    var out = ['<div class="apl-doc">'];
    blocks.forEach(function (bl) {
      if (bl.t === 'title') out.push('<h1 class="apl-title">' + esc(bl.text) + '</h1>');
      else if (bl.t === 'p') out.push('<p>' + bl.runs.map(runHtml).join('') + '</p>');
      else if (bl.t === 'gap') out.push('<p class="apl-gap">&nbsp;</p>');
      else if (bl.t === 'table') {
        out.push('<table class="apl-table' + (bl.keep ? ' keep' : '') + '"><colgroup>' + bl.w.map(function (w) { return '<col style="width:' + w + '%">'; }).join('') + '</colgroup><tbody>');
        bl.rows.forEach(function (row) {
          out.push('<tr>');
          row.forEach(function (c) {
            var at = (c.span > 1 ? ' colspan="' + c.span + '"' : '') + (c.rspan > 1 ? ' rowspan="' + c.rspan + '"' : '');
            var cls = (c.bg === 'h' ? 'h ' : '') + (c.al === 'c' ? 'c' : '');
            out.push('<td' + at + (cls.trim() ? ' class="' + cls.trim() + '"' : '') + '>' + c.p.map(function (p) { return '<div>' + (p.runs.map(runHtml).join('') || '&nbsp;') + '</div>'; }).join('') + '</td>');
          });
          out.push('</tr>');
        });
        out.push('</tbody></table>');
      }
    });
    if (footer) out.push('<p class="apl-foot">' + esc(footer) + '</p>');
    out.push('</div>');
    return out.join('');
  }

  /* ---------- Renderer DOCX ---------- */
  function toDocx(blocks, footerText) {
    var d = g.docx; if (!d) throw new Error('Pustaka docx belum dimuat');
    var FONT = 'Arial', SZ = 21, TOTAL = 9638;
    var border = { style: d.BorderStyle.SINGLE, size: 4, color: '000000' };
    var borders = { top: border, bottom: border, left: border, right: border };
    function run(r) {
      var f = /[☐☒]/.test(r.text) ? 'MS Gothic' : FONT;
      return new d.TextRun({ text: r.text, bold: r.b, italics: r.i, strike: r.s, font: f, size: r.sz || SZ });
    }
    function para(p, extra, keep) {
      return new d.Paragraph(Object.assign({ keepNext: !!keep, children: p.runs.map(run), spacing: { before: 20, after: 20 }, alignment: p.al === 'c' ? d.AlignmentType.CENTER : d.AlignmentType.LEFT }, extra || {}));
    }
    var kids = [];
    blocks.forEach(function (bl) {
      if (bl.t === 'title') kids.push(new d.Paragraph({ children: [new d.TextRun({ text: bl.text, bold: true, font: FONT, size: 26 })], spacing: { after: 160 } }));
      else if (bl.t === 'p') kids.push(new d.Paragraph({ children: bl.runs.map(run), spacing: { before: 100, after: 60 } }));
      else if (bl.t === 'gap') kids.push(new d.Paragraph({ children: [], spacing: { after: 60 } }));
      else if (bl.t === 'table') {
        var cw = bl.w.map(function (w) { return Math.round(TOTAL * w / 100); });
        var rows = bl.rows.map(function (row, ri) {
          var col = 0, occupied = row.__skip || 0;
          var cells = row.map(function (c) {
            var width = 0; for (var k = 0; k < c.span; k++) width += cw[col + k] || 0;
            var cell = new d.TableCell({
              children: c.p.map(function (p) { return para(p, c.al === 'c' ? { alignment: d.AlignmentType.CENTER } : {}, (bl.keep === 'all' || (bl.keep === true && ri < bl.rows.length - 1) || (bl.keepN && ri < bl.keepN))); }),
              columnSpan: c.span > 1 ? c.span : undefined, rowSpan: c.rspan > 1 ? c.rspan : undefined,
              width: { size: width, type: d.WidthType.DXA }, borders: borders,
              shading: c.bg === 'h' ? { type: d.ShadingType.CLEAR, fill: 'E7E6E6', color: 'auto' } : undefined,
              margins: { top: 40, bottom: 40, left: 90, right: 90 }
            });
            col += c.span; return cell;
          });
          return new d.TableRow({ children: cells, cantSplit: true });
        });
        kids.push(new d.Table({ rows: rows, width: { size: TOTAL, type: d.WidthType.DXA }, columnWidths: cw }));
      }
    });
    var footer = new d.Footer({ children: [new d.Paragraph({ children: [new d.TextRun({ text: footerText || '', font: FONT, size: 14, color: '666666' })] })] });
    return new d.Document({
      creator: 'LSP UMB', title: footerText || 'LSP UMB',
      styles: { default: { document: { run: { font: FONT, size: SZ } } } },
      sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } }, footers: { default: footer }, children: kids }]
    });
  }
  function toBlob(blocks, footerText) { return g.docx.Packer.toBlob(toDocx(blocks, footerText)); }

  g.LSP_APL = { apl01: apl01, apl02: apl02, toHtml: toHtml, toDocx: toDocx, toBlob: toBlob, tglIndo: tglIndo };
})(typeof window !== 'undefined' ? window : globalThis);
