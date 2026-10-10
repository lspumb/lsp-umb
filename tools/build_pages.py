# Menghasilkan halaman HTML statis. Jalankan: python3 tools/build_pages.py
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def b(i,e): return f'<span data-l="id">{i}</span><span data-l="en">{e}</span>'
def blk(i,e,tag='p',cls=''):
    c=f' class="{cls}"' if cls else ''
    return f'<{tag}{c} data-l="id">{i}</{tag}><{tag}{c} data-l="en">{e}</{tag}>'
def head(page,title_id,title_en,desc,extra_css=''):
    return f'''<!doctype html>
<html lang="id" data-lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title_id} | LSP UMB</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title_id} | LSP UMB">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="img/logo-lsp-umb.png">
<meta name="theme-color" content="#2e6b4f">
<link rel="icon" href="img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:wght@600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">{extra_css}
</head>
<body data-page="{page}" data-title-id="{title_id}" data-title-en="{title_en}">
<div id="site-header"></div>
<main id="main">
'''
def foot(scripts):
    s=''.join(f'<script src="{x}"></script>\n' for x in ['js/config.js','data/skema.js','data/elemen.js','js/app.js','js/pages.js']+scripts)
    return f'''</main>
<div id="site-footer"></div>
{s}</body>
</html>
'''
def pagehead(crumb_id,crumb_en,h_id,h_en,p_id='',p_en=''):
    p=(blk(p_id,p_en)) if p_id else ''
    return f'''<div class="page-head"><div class="wrap"><div class="crumbs"><a href="index.html">{b("Beranda","Home")}</a> / {b(crumb_id,crumb_en)}</div><h1>{b(h_id,h_en)}</h1>{p}</div></div>
'''
def write(name,html): open(os.path.join(ROOT,name),'w',encoding='utf-8').write(html)

STEPS=[
("Pelajari skema di situs ini","Study the schemes on this site","Baca penjelasan skema, unit kompetensi, dan persyaratannya. Gunakan fitur cek skema berdasarkan program studi untuk melihat skema yang dapat Anda ambil.","Read the scheme descriptions, units and requirements. Use the study-program checker to see which schemes you can take."),
("Isi formulir pendaftaran daring","Fill in the online registration form","Pilih skema, lalu lengkapi data diri sesuai isian Formulir FR.APL.01.","Choose a scheme and complete your personal data, following the FR.APL.01 form."),
("Unduh FR.APL.01 dan FR.APL.02","Download FR.APL.01 and FR.APL.02","Setelah mengirim formulir, dua dokumen akan tampil dalam keadaan sudah terisi. Unduh keduanya.","After submitting, both documents appear already filled in. Download both."),
("Cetak dan tanda tangani","Print and sign","Cetak kedua dokumen, periksa isinya, lalu tanda tangani pada kolom yang tersedia.","Print both documents, check them, and sign in the provided boxes."),
("Lengkapi persyaratan lainnya","Complete the other requirements","Siapkan fotokopi KTP, KTM, transkrip nilai, surat keterangan magang/PKL, dan pasfoto sesuai skema.","Prepare photocopies of ID, student card, transcript, internship certificate and photos as required by your scheme."),
("Bayar biaya sertifikasi","Pay the certification fee","Transfer biaya ke rekening BSI Universitas Muhammadiyah Bengkulu dan simpan bukti pembayaran.","Transfer the fee to the Universitas Muhammadiyah Bengkulu BSI account and keep the receipt."),
("Serahkan berkas ke Kantor LSP UMB","Submit documents to the LSP UMB office","Serahkan bukti bayar dan seluruh berkas kepada resepsionis di Kantor LSP UMB.","Hand the payment receipt and all documents to the receptionist at the LSP UMB office."),
("Tunggu panggilan dari Admin LSP UMB","Wait for a call from LSP UMB admin","Admin akan menghubungi Anda untuk tahapan berikutnya, termasuk jadwal asesmen.","The admin will contact you about the next stages, including the assessment schedule."),
]
def steps_html(detail=True):
    return '<ol class="steps">'+''.join(f'<li><h3>{b(a,c)}</h3><p>{b(d,e)}</p></li>' for a,c,d,e in STEPS)+'</ol>'

# ---------------- index ----------------
h=head('home','Beranda','Home','Lembaga Sertifikasi Profesi Universitas Muhammadiyah Bengkulu. Informasi skema, pendaftaran, dan jadwal uji kompetensi.')
h+=f'''<section class="hero"><div class="wrap"><div>
<div class="eyebrow">{b("Lembaga Sertifikasi Profesi P1 · Berlisensi BNSP","First-party Certification Body · BNSP licensed")}</div>
<h1>{b("Sertifikasi kompetensi kerja bagi mahasiswa Universitas Muhammadiyah Bengkulu","Professional competency certification for Universitas Muhammadiyah Bengkulu students")}</h1>
{blk("LSP UMB menyelenggarakan uji kompetensi melalui 11 skema sertifikasi. Pelajari skema, cek kecocokannya dengan program studi Anda, lalu daftar secara daring.","LSP UMB runs competency tests through 11 certification schemes. Study the schemes, check which fit your study program, then register online.",'p','lead')}
<div class="actions"><a class="btn" href="daftar.html">{b("Daftar sekarang","Register now")}</a><a class="btn ghost" href="skema.html#cek">{b("Cek skema untuk prodi saya","Find schemes for my program")}</a></div></div>
<aside class="hero-panel" aria-label="Ringkasan"><dl id="hero-facts"></dl><div class="logos"><img src="img/logo-umb.png" alt="Universitas Muhammadiyah Bengkulu" width="46" height="46"><img src="img/logo-bnsp.png" alt="BNSP" width="46" height="46"></div></aside></div></section>

<section class="alt" id="alur"><div class="wrap"><div class="sec-head"><div class="eyebrow">{b("Alur pendaftaran","How to register")}</div><h2>{b("Delapan langkah dari informasi sampai panggilan uji","Eight steps from information to your test call")}</h2></div>
{steps_html()}
<p style="margin-top:18px"><a href="prosedur.html">{b("Baca prosedur lengkap, persyaratan, dan ketentuan banding →","Read the full procedure, requirements and appeals →")}</a></p></div></section>

<section id="skema"><div class="wrap"><div class="sec-head"><div class="eyebrow">{b("Skema sertifikasi","Certification schemes")}</div><h2>{b("11 skema untuk berbagai program studi","11 schemes across study programs")}</h2>{blk("Setiap skema memiliki unit kompetensi dan persyaratan dasar sendiri. Skema Kewirausahaan Industri terbuka untuk semua program studi.","Each scheme has its own units of competency and basic requirements. The Industrial Entrepreneurship scheme is open to all study programs.",'p','lead')}</div>
<div class="grid g3" id="home-skema"></div>
<p style="margin-top:22px"><a class="btn" href="skema.html">{b("Semua skema & cek berdasarkan prodi","All schemes & study-program checker")}</a></p></div></section>

<section class="alt" id="jadwal"><div class="wrap"><div class="sec-head"><div class="eyebrow">{b("Jadwal uji kompetensi","Competency test schedule")}</div><h2>{b("Jadwal dan lokasi ujian terdekat","Upcoming tests and venues")}</h2></div>
<div id="home-jadwal"><p class="loading">…</p></div><p style="margin-top:16px"><a href="jadwal.html">{b("Lihat seluruh jadwal →","See the full schedule →")}</a></p></div></section>

<section id="tentang"><div class="wrap"><div class="sec-head"><div class="eyebrow">{b("Tentang LSP UMB","About LSP UMB")}</div><h2>{b("Lembaga sertifikasi di lingkungan kampus","A certification body inside the university")}</h2></div>
<div class="grid g2"><div>{blk("LSP UMB adalah Lembaga Sertifikasi Profesi Pihak Pertama (LSP P1) di lingkungan Universitas Muhammadiyah Bengkulu. Lembaga ini menilai kompetensi mahasiswa terhadap standar kompetensi kerja yang berlaku, bukan sekadar kelulusan akademik.","LSP UMB is the first-party Professional Certification Body (LSP P1) of Universitas Muhammadiyah Bengkulu. It assesses student competence against applicable work competency standards, beyond academic graduation.")}<div id="home-tambahan"></div>
{blk("Skema dikembangkan oleh Komite Skema, disahkan Direktur LSP, dan dijalankan asesor kompetensi sesuai pedoman BNSP.","Schemes are developed by the Scheme Committee, approved by the LSP Director and delivered by competency assessors under BNSP guidelines.")}
<p><a href="tentang.html">{b("Profil lengkap →","Full profile →")}</a></p></div>
<div class="card"><h3>{b("Mengapa bersertifikat?","Why certify?")}</h3><ul style="margin:0;padding-left:1.2em"><li>{b("Pengakuan kompetensi sesuai standar nasional","Recognition against national standards")}</li><li>{b("Sertifikat kompetensi berlaku 3 tahun","Certificate valid for 3 years")}</li><li>{b("Hak banding atas keputusan sertifikasi","Right to appeal certification decisions")}</li><li>{b("Kerahasiaan proses sertifikasi terjamin","Confidential certification process")}</li></ul></div></div>
<div id="home-vm-sec" style="margin-top:28px"><div id="home-vm"></div></div></div></section>

<section class="alt" id="pengurus"><div class="wrap"><div class="sec-head"><div class="eyebrow">{b("Pengurus","Management")}</div><h2>{b("Struktur pengurus LSP UMB","LSP UMB management")}</h2></div><div id="home-pengurus"></div></div></section>

<section id="berita"><div class="wrap"><div class="sec-head"><div class="eyebrow">{b("Berita","News")}</div><h2>{b("Kegiatan terbaru LSP UMB","Latest LSP UMB activities")}</h2></div><div id="home-berita"></div><p style="margin-top:16px"><a href="berita.html">{b("Semua berita →","All news →")}</a></p></div></section>

<section class="alt"><div class="wrap"><div class="sec-head"><div class="eyebrow">{b("Galeri","Gallery")}</div><h2>{b("Dokumentasi kegiatan","Activity photos")}</h2></div><div id="home-galeri"></div></div></section>

<section><div class="wrap"><div class="card" style="display:flex;flex-wrap:wrap;gap:18px;justify-content:space-between;align-items:center"><div><h3 style="margin:0">{b("Ada pertanyaan tentang pendaftaran?","Questions about registration?")}</h3><p class="muted" style="margin:.3em 0 0">{b("Hubungi Admin LSP UMB melalui email atau kunjungi kantor kami.","Contact the LSP UMB admin by email or visit our office.")}</p></div><a class="btn" href="kontak.html">{b("Kontak","Contact")}</a></div></div></section>
'''
h+=foot([])
write('index.html',h)

# ---------------- tentang ----------------
h=head('tentang','Tentang LSP UMB','About LSP UMB','Profil, pengurus, dan dasar penyelenggaraan sertifikasi LSP Universitas Muhammadiyah Bengkulu.')
h+=pagehead('Tentang','About','Tentang LSP UMB','About LSP UMB')
h+=f'''<section><div class="wrap"><div class="grid g2"><div><h2>{b("Profil","Profile")}</h2>
{blk("Lembaga Sertifikasi Profesi Universitas Muhammadiyah Bengkulu (LSP UMB) adalah LSP Pihak Pertama (LSP P1) yang melayani sertifikasi kompetensi bagi mahasiswa Universitas Muhammadiyah Bengkulu.","The Professional Certification Body of Universitas Muhammadiyah Bengkulu (LSP UMB) is a first-party LSP (LSP P1) serving competency certification for UMB students.")}
{blk("Seluruh skema sertifikasi disusun oleh Komite Skema LSP UMB dengan merujuk pada Standar Kompetensi Kerja Nasional Indonesia (SKKNI) atau KKNI, serta disahkan oleh Direktur LSP pada 16 Juni 2025. Dokumen skema menjadi acuan asesor dalam melaksanakan asesmen.","All certification schemes are developed by the LSP UMB Scheme Committee referring to Indonesian National Work Competency Standards (SKKNI) or KKNI, and were approved by the LSP Director on 16 June 2025. The scheme documents guide assessors during assessment.")}
{blk("Sebagai LSP P1, LSP UMB tidak melakukan sertifikasi ulang. Pemegang sertifikat yang ingin memperpanjang disarankan melalui LSP P3 yang relevan.","As an LSP P1, LSP UMB does not carry out recertification. Certificate holders who wish to renew are advised to go through a relevant LSP P3.")}
<div id="tambahan"></div></div>
<div><h2>{b("Data lembaga","Organization data")}</h2><div class="card"><dl id="legal" style="margin:0;display:grid;grid-template-columns:auto 1fr;gap:10px 16px"></dl></div></div></div></div></section>
<section class="alt" id="vm-sec"><div class="wrap"><div class="sec-head"><h2>{b("Visi dan misi","Vision and mission")}</h2></div><div id="vm"></div></div></section>
<section><div class="wrap"><div class="sec-head"><h2>{b("Pengurus","Management")}</h2></div><div id="pengurus"></div></div></section>
<section class="alt"><div class="wrap"><div class="sec-head"><h2>{b("Prinsip layanan sertifikasi","Certification principles")}</h2></div><div class="grid g3">
<div class="card"><h3>{b("Objektif dan sistematis","Objective and systematic")}</h3>{blk("Asesmen direncanakan agar verifikasi persyaratan skema dilakukan secara objektif, dengan bukti yang terdokumentasi.","Assessment is planned so scheme requirements are verified objectively with documented evidence.")}</div>
<div class="card"><h3>{b("Aturan bukti VATM","VATM evidence rules")}</h3>{blk("Bukti dinilai berdasarkan prinsip valid, asli, terkini, dan memadai.","Evidence is judged as valid, authentic, current and sufficient.")}</div>
<div class="card"><h3>{b("Keputusan oleh tim teknis","Decision by technical team")}</h3>{blk("Keputusan sertifikasi diambil tim teknis LSP berdasarkan rekomendasi asesor, bukan oleh asesor sendiri.","Certification decisions are made by the LSP technical team based on assessor recommendations, not by the assessor alone.")}</div></div></div></section>
<section id="galeri-sec"><div class="wrap"><div class="sec-head"><h2>{b("Galeri","Gallery")}</h2></div><div id="galeri"></div></div></section>
'''
h+=foot([]); write('tentang.html',h)

# ---------------- skema ----------------
h=head('skema','Skema Sertifikasi','Certification Schemes','11 skema sertifikasi LSP UMB: unit kompetensi, persyaratan, dan program studi yang dapat mendaftar.')
h+=pagehead('Skema','Schemes','Skema sertifikasi','Certification schemes','Pilih skema, lihat unit kompetensi dan persyaratannya, atau cek skema yang cocok untuk program studi Anda.','Browse schemes, see their units and requirements, or check which fit your study program.')
h+=f'''<section id="cek" style="padding-bottom:20px"><div class="wrap"><div class="checker"><h2 style="font-size:1.3rem;margin-bottom:.2em">{b("Cek skema untuk program studi Anda","Find schemes for your study program")}</h2>{blk("Pilih program studi untuk melihat skema yang dapat diambil. Klik skema untuk membaca persyaratannya.","Select your study program to see the schemes you can take. Click a scheme to read its requirements.",'p','small muted')}
<div class="row"><label for="prodi-sel" class="sr" style="position:absolute;left:-9999px">{b("Program studi","Study program")}</label><select id="prodi-sel"></select></div><div class="result" id="prodi-result" aria-live="polite"></div></div></div></section>
<section style="padding-top:30px"><div class="wrap"><div class="sec-head"><h2>{b("Semua skema","All schemes")}</h2></div>
<div class="toolbar"><button class="chip" data-f="all" aria-pressed="true">{b("Semua","All")}</button><button class="chip" data-f="Klaster" aria-pressed="false">Klaster</button><button class="chip" data-f="Okupasi" aria-pressed="false">Okupasi</button><button class="chip" data-f="KKNI" aria-pressed="false">KKNI</button>
<input id="q" type="search" style="max-width:280px;margin-left:auto" data-ph-id="Cari skema atau prodi…" data-ph-en="Search scheme or program…" placeholder="Cari skema atau prodi…" aria-label="Cari"></div>
<div class="grid g3" id="skema-list"></div></div></section>
<section class="alt"><div class="wrap"><div class="sec-head"><h2>{b("Skema dan program studi yang dapat mendaftar","Schemes and eligible study programs")}</h2>{blk("Ringkasan berikut mengikuti bagian persyaratan dasar pada dokumen skema resmi.","The summary below follows the basic requirements section of each official scheme document.",'p','muted')}</div><div class="tbl-wrap" id="matrix"></div>
<h3 style="margin-top:34px">{b("Jenis skema","Scheme types")}</h3><div class="grid g3"><div class="card"><span class="tag">Klaster</span>{blk("Gabungan beberapa unit kompetensi dari suatu okupasi atau bidang pekerjaan.","A group of units of competency drawn from an occupation or field of work.",'p','small')}</div><div class="card"><span class="tag okupasi">Okupasi</span>{blk("Seluruh unit kompetensi yang membentuk satu jabatan atau okupasi.","All units of competency that make up one job or occupation.",'p','small')}</div><div class="card"><span class="tag kkni">KKNI</span>{blk("Skema berbasis jenjang kualifikasi pada Kerangka Kualifikasi Nasional Indonesia.","Scheme based on a qualification level of the Indonesian Qualifications Framework.",'p','small')}</div></div></div></section>
'''
h+=foot([]); write('skema.html',h)

# ---------------- prosedur ----------------
h=head('prosedur','Prosedur Pendaftaran','Registration Procedure','Prosedur, persyaratan, biaya, dan ketentuan sertifikasi di LSP UMB.')
h+=pagehead('Prosedur','Procedure','Prosedur pendaftaran','Registration procedure','Dari mencari informasi sampai menerima panggilan uji kompetensi.','From finding information to receiving your test call.')
h+=f'''<section><div class="wrap"><div class="sec-head"><h2>{b("Alur pendaftaran","Registration flow")}</h2></div>{steps_html()}
<p style="margin-top:20px"><a class="btn" href="daftar.html">{b("Mulai pendaftaran","Start registration")}</a></p></div></section>
<section class="alt"><div class="wrap"><div class="grid g2"><div><h2>{b("Persyaratan","Requirements")}</h2>
<h3>{b("Persyaratan dasar","Basic requirements")}</h3><ul><li>{b("Mahasiswa aktif Universitas Muhammadiyah Bengkulu semester VII.","Active Universitas Muhammadiyah Bengkulu student in semester VII.")}</li><li>{b("Telah menyelesaikan mata kuliah yang ditentukan skema.","Has completed the courses specified by the scheme.")}</li><li>{b("Telah menyelesaikan magang/praktik kerja lapangan pada bidang skema.","Has completed an internship / field practice in the scheme's field.")}</li></ul>
{blk("Mata kuliah dan bidang magang berbeda pada tiap skema. Lihat persyaratan lengkap pada halaman Skema.","Required courses and internship fields differ per scheme. See the Schemes page for the full requirements.",'p','small muted')}
<h3>{b("Berkas yang diserahkan","Documents to submit")}</h3><ul><li>FR.APL.01 {b("dan","and")} FR.APL.02 {b("(dicetak dari situs ini)","(printed from this site)")}</li><li>{b("Fotokopi KTP","Photocopy of national ID (KTP)")}</li><li>{b("Fotokopi Kartu Tanda Mahasiswa (KTM)","Photocopy of student card (KTM)")}</li><li>{b("Fotokopi transkrip nilai sementara semester 1–6 yang memuat mata kuliah syarat skema","Photocopy of provisional transcript, semesters 1–6, showing the scheme's required courses")}</li><li>{b("Fotokopi sertifikat atau surat keterangan telah menyelesaikan magang/PKL pada bidang skema","Photocopy of internship / field practice certificate or statement in the scheme's field")}</li><li>{b("Slip pembayaran uji kompetensi","Payment slip for the competency test")}</li><li>{b("Pasfoto 3x4 latar belakang merah, 3 lembar","Three 3x4 passport photos, red background")}</li></ul></div>
<div><h2>{b("Biaya dan pembayaran","Fee and payment")}</h2>{blk("Biaya sertifikasi ditetapkan sesuai kebijakan Universitas Muhammadiyah Bengkulu.","The certification fee is set by Universitas Muhammadiyah Bengkulu policy.")}<p style="font:600 2rem 'Source Serif 4',serif;margin:.2em 0" id="biaya"></p><div id="rekening"></div><div id="kantor" style="margin-top:12px"></div>
{blk("Simpan bukti pembayaran dan serahkan bersama berkas ke Kantor LSP UMB.","Keep your receipt and submit it with your documents at the LSP UMB office.",'p','small muted')}
<h3 style="margin-top:26px">{b("Siapa yang dapat mendaftar?","Who can apply?")}</h3>{blk("Setiap skema membatasi program studi tertentu. Skema Kewirausahaan Industri terbuka untuk semua program studi.","Each scheme is limited to specific study programs. The Industrial Entrepreneurship scheme is open to all programs.")}<p><a href="skema.html#cek">{b("Cek skema untuk prodi saya →","Find schemes for my program →")}</a></p></div></div></div></section>
<section><div class="wrap"><div class="sec-head"><h2>{b("Setelah berkas diterima","After your documents are accepted")}</h2></div><ol class="steps cols">
<li><h3>{b("Penelaahan berkas","File review")}</h3><p>{b("LSP UMB memeriksa apakah Anda memenuhi persyaratan skema. Yang memenuhi dinyatakan sebagai peserta sertifikasi.","LSP UMB checks that you meet the scheme requirements. Those who do become certification participants.")}</p></li>
<li><h3>{b("Asesmen mandiri (FR.APL.02)","Self-assessment (FR.APL.02)")}</h3><p>{b("Asesor mengkaji kecukupan bukti pendukung Anda dan merekomendasikan apakah asesmen dilanjutkan.","The assessor reviews your supporting evidence and recommends whether assessment continues.")}</p></li>
<li><h3>{b("Uji kompetensi","Competency test")}</h3><p>{b("Dilaksanakan di Tempat Uji Kompetensi (TUK) dengan observasi atau praktik, tes tertulis, tes lisan, portofolio, dan/atau wawancara.","Held at a Competency Test Venue (TUK) using observation or practice, written and oral tests, portfolio and/or interview.")}</p></li>
<li><h3>{b("Keputusan dan sertifikat","Decision and certificate")}</h3><p>{b("Tim teknis memutuskan berdasarkan rekomendasi asesor. Peserta yang kompeten menerima sertifikat berlaku 3 tahun.","The technical team decides based on the assessor's recommendation. Competent participants receive a certificate valid for 3 years.")}</p></li></ol></div></section>
<section class="alt"><div class="wrap"><div class="grid g2"><div><h2>{b("Hak pemohon","Applicant rights")}</h2><ul><li>{b("Memperoleh penjelasan tentang proses sertifikasi sesuai skema","To receive an explanation of the certification process")}</li><li>{b("Bertanya tentang kompetensi yang diujikan","To ask questions about the competencies assessed")}</li><li>{b("Jaminan kerahasiaan proses sertifikasi","Confidentiality of the certification process")}</li><li>{b("Mengajukan banding atas keputusan sertifikasi","To appeal the certification decision")}</li><li>{b("Memperoleh sertifikat kompetensi bila dinyatakan kompeten","To receive a certificate if found competent")}</li></ul></div>
<div><h2>{b("Kewajiban pemegang sertifikat","Certificate holder obligations")}</h2><ul><li>{b("Tidak menyalahgunakan sertifikat kompetensi","Not misuse the certificate")}</li><li>{b("Memelihara kompetensi sesuai sertifikat","Maintain the competence stated on the certificate")}</li><li>{b("Memberikan pernyataan dan informasi yang benar dan terbaru","Provide true and current statements and information")}</li><li>{b("Menaati aturan penggunaan sertifikat","Comply with certificate usage rules")}</li></ul></div></div>
<div class="grid g2" style="margin-top:28px"><div class="card"><h3>{b("Banding","Appeals")}</h3>{blk("Peserta dapat mengajukan banding bila keputusan dirasa tidak sesuai. Banding diajukan paling lambat 1 hari sejak keputusan ditetapkan, dan diputuskan paling lambat 14 hari kerja sejak diterima oleh tim banding yang tidak terlibat dalam perkara.","Participants may appeal a decision they consider unfair. Appeals must be filed within 1 day of the decision and are decided within 14 working days by an appeals team uninvolved in the case.",'p','small')}</div>
<div class="card"><h3>{b("Pemeliharaan sertifikat","Certificate maintenance")}</h3>{blk("LSP UMB melakukan surveilans minimal sekali setahun melalui logbook, konfirmasi atasan atau pihak ketiga, atau kunjungan tempat kerja. Sertifikat dapat dibekukan atau dicabut bila kewajiban dilanggar.","LSP UMB conducts surveillance at least once a year via logbooks, supervisor or third-party confirmation, or workplace visits. Certificates may be suspended or revoked if obligations are breached.",'p','small')}</div></div></div></section>
'''
h+=foot([]); write('prosedur.html',h)

# ---------------- jadwal ----------------
h=head('jadwal','Jadwal Uji Kompetensi','Competency Test Schedule','Jadwal dan lokasi uji kompetensi LSP UMB.')
h+=pagehead('Jadwal Uji','Schedule','Jadwal uji kompetensi','Competency test schedule','Tanggal, waktu, dan lokasi ujian diperbarui oleh tim LSP UMB.','Dates, times and venues are updated by the LSP UMB team.')
h+=f'''<section><div class="wrap"><div id="jadwal-list"><p class="loading">…</p></div>
<div class="alert info" style="margin-top:28px">{b("Jadwal dapat berubah. Peserta akan dihubungi langsung oleh Admin LSP UMB setelah berkas diterima.","Schedules may change. Participants are contacted directly by the LSP UMB admin once their documents are accepted.")}</div></div></section>
'''
h+=foot([]); write('jadwal.html',h)

# ---------------- berita ----------------
h=head('berita','Berita','News','Berita dan kegiatan LSP Universitas Muhammadiyah Bengkulu.')
h+=pagehead('Berita','News','Berita LSP UMB','LSP UMB news')
h+='<section><div class="wrap"><div id="berita-list"><p class="loading">…</p></div><div id="berita-detail" style="display:none"></div></div></section>\n'
h+=foot([]); write('berita.html',h)

# ---------------- kontak ----------------
h=head('kontak','Kontak','Contact','Kontak resmi LSP Universitas Muhammadiyah Bengkulu.')
h+=pagehead('Kontak','Contact','Kontak','Contact')
h+=f'''<section><div class="wrap"><div class="grid g2"><div><h2>{b("Hubungi kami","Get in touch")}</h2><dl id="kontak-info" style="display:grid;grid-template-columns:auto 1fr;gap:12px 20px"></dl>
{blk("Untuk pertanyaan pendaftaran, sebutkan nama, program studi, dan skema yang diminati.","For registration questions, include your name, study program and the scheme you are interested in.",'p','muted')}</div><div id="peta"></div></div></div></section>
'''
h+=foot([]); write('kontak.html',h)

# ---------------- daftar ----------------
def fld(id,lab_id,lab_en,typ='text',req=False,full=False,hint=None,extra=''):
    c='field full' if full else 'field'
    r=' class="req"' if req else ''
    ht=f'<span class="hint">{b(*hint)}</span>' if hint else ''
    return f'<div class="{c}"><label for="{id}"{r}>{b(lab_id,lab_en)}</label><input id="{id}" name="{id}" type="{typ}" {extra}>{ht}</div>'
h=head('daftar','Pendaftaran','Registration','Formulir pendaftaran sertifikasi kompetensi LSP UMB berdasarkan FR.APL.01.')
h+=pagehead('Pendaftaran','Registration','Pendaftaran sertifikasi','Certification registration','Isi data sesuai KTP dan dokumen asli. Setelah dikirim, FR.APL.01 dan FR.APL.02 akan tampil dalam keadaan sudah terisi.','Fill in data exactly as on your ID and original documents. After submitting, FR.APL.01 and FR.APL.02 appear already filled in.')
h+=f'''<section><div class="wrap" style="max-width:860px">
<div id="closed" class="alert warn" style="display:none">{b("Pendaftaran sedang ditutup. Silakan pantau halaman Jadwal atau hubungi Admin LSP UMB.","Registration is currently closed. Check the Schedule page or contact the LSP UMB admin.")}</div>
<form id="f" novalidate autocomplete="on">
<div class="form-card"><h2>{b("1. Pilih skema","1. Choose a scheme")}</h2><p class="sub">{b("Hanya skema sesuai program studi Anda yang dapat dipilih.","Only schemes matching your study program are accepted.")}</p><div class="fgrid">
<div class="field full"><label for="skema" class="req">{b("Skema sertifikasi","Certification scheme")}</label><select id="skema" name="skema"></select><div class="skema-info" id="skema-info" style="display:none"></div></div>
<div class="field"><label for="prodi" class="req">{b("Program studi","Study program")}</label><select id="prodi" name="prodi"></select></div>
<div class="field" id="prodi_lain_wrap" style="display:none"><label for="prodi_lain">{b("Nama program studi","Study program name")}</label><input id="prodi_lain" type="text"></div>
<div class="field"><label for="nim" class="req">NIM</label><input id="nim" name="nim" type="text" inputmode="numeric" autocomplete="off"></div>
<div class="field"><label for="semester" class="req">{b("Semester saat ini","Current semester")}</label><select id="semester" name="semester"><option value="">—</option><option value="bawah">{b("Di bawah VII","Below VII")}</option><option value="VII">VII</option><option value="VIII">VIII</option><option value="IX">IX</option><option value="X atau lebih">{b("X atau lebih","X or above")}</option></select></div>
<div class="field full"><div id="elig" class="alert bad" style="display:none"></div></div></div></div>

<div class="form-card"><h2>{b("2. Data pribadi","2. Personal data")}</h2><p class="sub">{b("Sesuai isian FR.APL.01 bagian 1.","As in FR.APL.01 part 1.")}</p><div class="fgrid">
{fld('nama','Nama lengkap','Full name','text',True,True,None,'autocomplete="name"')}
{fld('nik','No. KTP / NIK','National ID (NIK)','text',True,False,('16 digit angka','16 digits'),'inputmode="numeric" maxlength="16" autocomplete="off"')}
<div class="field"><span class="lbl req">{b("Jenis kelamin","Gender")}</span><div class="radios"><label><input type="radio" id="jk-l" name="jk" value="L"> {b("Laki-laki","Male")}</label><label><input type="radio" name="jk" value="P"> {b("Wanita","Female")}</label></div></div>
{fld('tempat','Tempat lahir','Place of birth','text',True)}
{fld('tgl','Tanggal lahir','Date of birth','date',True)}
{fld('kebangsaan','Kebangsaan','Nationality','text',False,False,None,'value="Indonesia"')}
<div class="field full"><label for="alamat" class="req">{b("Alamat rumah","Home address")}</label><textarea id="alamat" name="alamat" rows="2" autocomplete="street-address"></textarea></div>
{fld('kodepos','Kode pos','Postal code','text',False,False,None,'inputmode="numeric" autocomplete="postal-code"')}
{fld('hp','No. HP / WhatsApp','Mobile / WhatsApp','tel',True,False,None,'autocomplete="tel"')}
{fld('email','Email','Email','email',True,False,None,'autocomplete="email"')}
{fld('telpRumah','Telepon rumah (opsional)','Home phone (optional)','tel')}
{fld('telpKantor','Telepon kantor (opsional)','Office phone (optional)','tel')}
<div class="field full"><label for="pendidikan">{b("Kualifikasi pendidikan","Education qualification")}</label><input id="pendidikan" name="pendidikan" type="text"><span class="hint">{b("Terisi otomatis dari program studi. Boleh diubah.","Filled from your study program. You may edit it.")}</span></div></div></div>

<details class="form-card" open><summary style="cursor:pointer"><span style="font:600 1.25rem 'Source Serif 4',serif">{b("3. Data pekerjaan sekarang","3. Current employment")}</span></summary><p class="sub" style="margin-top:8px">{b("Sesuai FR.APL.01 bagian 1b. Bagi mahasiswa terisi bawaan; ubah bila Anda bekerja.","As in FR.APL.01 part 1b. Prefilled for students; change it if you work.")}</p><div class="fgrid">
{fld('institusi','Nama institusi / perusahaan','Institution / company','text',False,True,None,'value="Universitas Muhammadiyah Bengkulu"')}
{fld('jabatan','Jabatan','Position','text',False,False,None,'value="Mahasiswa"')}
{fld('kodeposKantor','Kode pos kantor','Office postal code')}
<div class="field full"><label for="alamatKantor">{b("Alamat kantor","Office address")}</label><textarea id="alamatKantor" rows="2"></textarea></div>
{fld('telpInstitusi','Telepon','Phone','tel')}{fld('fax','Fax','Fax')}{fld('emailInstitusi','Email institusi','Institution email','email')}</div></details>

<div class="form-card"><div class="check"><input type="checkbox" id="setuju"><label for="setuju">{b("Saya menyatakan data di atas benar, dan setuju memenuhi persyaratan sertifikasi serta memberikan informasi yang diperlukan untuk penilaian. Data saya dipakai LSP UMB hanya untuk keperluan sertifikasi.","I declare the data above is true, agree to meet certification requirements and provide information needed for assessment. LSP UMB uses my data only for certification purposes.")}</label></div>
<div class="hp" aria-hidden="true"><label>Website <input type="text" id="website" tabindex="-1" autocomplete="off"></label></div>
<div id="form-msg" role="status" aria-live="polite" style="margin-top:14px"></div>
<p style="margin:16px 0 0"><button type="submit" class="btn" id="submit">{b("Kirim dan buat FR.APL.01 & FR.APL.02","Submit and generate FR.APL.01 & FR.APL.02")}</button></p></div>
</form></div></section>
'''
h+=foot(['js/daftar.js']); write('daftar.html',h)

# ---------------- apl ----------------
h=head('apl','Dokumen Pendaftaran','Registration Documents','FR.APL.01 dan FR.APL.02 yang sudah terisi.','<link rel="stylesheet" href="css/apl.css">')
h+=pagehead('Dokumen','Documents','Dokumen pendaftaran Anda','Your registration documents')
h+=f'''<section><div class="wrap">
<div id="apl-empty" style="display:none" class="alert warn">{b("Belum ada data pendaftaran di perangkat ini.","No registration data found on this device.")} <a href="daftar.html">{b("Isi formulir pendaftaran","Fill in the registration form")}</a></div>
<div id="apl-main">
<div class="form-card no-print"><div class="grid g3" style="margin-bottom:14px"><div><span class="muted small">{b("No. pendaftaran","Registration no.")}</span><br><strong id="reg-id"></strong></div><div><span class="muted small">{b("Nama","Name")}</span><br><strong id="reg-nama"></strong></div><div><span class="muted small">{b("Skema","Scheme")}</span><br><strong id="reg-skema"></strong></div></div>
<div id="unsaved" class="alert warn" style="display:none">{b("Data Anda belum tersimpan di sistem LSP (server tidak terhubung). Formulir tetap dapat dicetak dan diserahkan, namun sebaiknya hubungi Admin LSP UMB untuk memastikan data tercatat.","Your data is not yet saved in the LSP system (server unreachable). You can still print and submit the forms, but please contact the LSP UMB admin to make sure you are recorded.")}</div>
<div id="noelemen" class="alert warn" style="display:none">{b("Elemen dan Kriteria Unjuk Kerja pada FR.APL.02 skema ini belum dimuat sistem, sehingga kolomnya kosong seperti pada templat. Lengkapi sesuai arahan asesor atau Admin LSP.","The elements and performance criteria in this scheme's FR.APL.02 have not been loaded yet, so those fields are blank as in the template. Complete them as directed by the assessor or LSP admin.")}</div>
<h2 style="font-size:1.2rem">{b("Unduh atau cetak","Download or print")}</h2>
<div style="display:flex;flex-wrap:wrap;gap:10px"><button class="btn" id="dl1">{b("Unduh FR.APL.01 (.docx)","Download FR.APL.01 (.docx)")}</button><button class="btn" id="dl2">{b("Unduh FR.APL.02 (.docx)","Download FR.APL.02 (.docx)")}</button><button class="btn ghost" id="pr1">{b("Cetak / PDF APL.01","Print / PDF APL.01")}</button><button class="btn ghost" id="pr2">{b("Cetak / PDF APL.02","Print / PDF APL.02")}</button><button class="btn ghost" id="pr12">{b("Cetak keduanya","Print both")}</button><button class="btn ghost only-embedded" id="newtab">{b("Buka di tab baru (bila unduhan bermasalah)","Open in a new tab (if downloads fail)")}</button></div>
{blk("Di ponsel, pilih “Simpan sebagai PDF” pada dialog cetak, lalu cetak dari komputer atau tempat fotokopi.","On a phone, choose “Save as PDF” in the print dialog, then print from a computer or copy shop.",'p','small muted')}</div>
<div class="grid g2 no-print"><div class="form-card"><h2 style="font-size:1.2rem">{b("Langkah berikutnya","Next steps")}</h2><ol style="padding-left:1.2em;margin:0"><li>{b("Cetak FR.APL.01 dan FR.APL.02, lalu tanda tangani.","Print FR.APL.01 and FR.APL.02 and sign them.")}</li><li>{b("Lengkapi berkas pada daftar di samping.","Complete the documents listed alongside.")}</li><li>{b("Bayar biaya sertifikasi.","Pay the certification fee.")}</li><li>{b("Serahkan semuanya kepada resepsionis Kantor LSP UMB.","Hand everything to the LSP UMB office receptionist.")}</li><li>{b("Tunggu panggilan dari Admin LSP UMB.","Wait for a call from the LSP UMB admin.")}</li></ol><div id="bayar" style="margin-top:14px"></div></div>
<div class="form-card"><h2 style="font-size:1.2rem">{b("Berkas yang dibawa","Documents to bring")}</h2><ul id="checklist" style="padding-left:1.2em;margin:0"></ul></div></div>
<h2 class="no-print" style="font-size:1.2rem">{b("Pratinjau dokumen","Document preview")}</h2>
<div class="apl-sheet" id="sheet1"></div><div class="apl-sheet" id="sheet2"></div></div></div></section>
<style>@media print{{body.print-1 #sheet2,body.print-2 #sheet1{{display:none!important}}}}</style>
'''
h+=foot(['js/apl.js','js/daftar.js']); write('apl.html',h)

# ---------------- admin ----------------
h=head('admin','Admin','Admin','Dashboard admin LSP UMB.')
h=h.replace('<meta name="theme-color"','<meta name="robots" content="noindex,nofollow"><meta name="theme-color"')
h+=f'''<section><div class="wrap" style="max-width:1000px">
<div id="a-login" style="max-width:420px;margin:30px auto"><div class="form-card"><h2>Dashboard admin LSP UMB</h2><p class="sub">Masukkan passcode admin.</p><form id="a-login-form"><div class="field"><label for="a-pass">Passcode</label><input id="a-pass" type="password" autocomplete="current-password" required></div><p id="a-lmsg" class="err" role="alert"></p><p style="margin:12px 0 0"><button class="btn" id="a-go" type="submit">Masuk</button></p></form></div></div>
<div id="a-app" style="display:none"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><h1 style="font-size:1.6rem;margin:0">Dashboard admin</h1><button class="btn ghost small" id="a-out">Keluar</button></div>
<div class="toolbar" id="a-tabs" style="margin-top:18px"></div><div id="a-msg" class="alert info" style="display:none" role="status"></div>
<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap;margin-bottom:14px"><div><h2 id="a-title" style="margin:0"></h2><p class="muted small" id="a-hint" style="margin:.2em 0 0"></p></div><div style="display:flex;gap:8px"><button class="btn ghost small" id="a-csv">Unduh CSV</button><button class="btn small" id="a-add">Tambah</button></div></div>
<div id="a-table"></div><dialog id="a-dlg"></dialog></div></div></section>
'''
h+=foot(['js/admin.js']); write('admin.html',h)

# ---------------- 404 ----------------
h=head('404','Halaman tidak ditemukan','Page not found','Halaman tidak ditemukan.')
h+=f'<section><div class="wrap"><h1>{b("Halaman tidak ditemukan","Page not found")}</h1><p><a class="btn" href="index.html">{b("Ke beranda","Go home")}</a></p></div></section>\n'
h+=foot([]); write('404.html',h)
open(os.path.join(ROOT,'.nojekyll'),'w').write('')
print('pages ok')
