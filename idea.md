# 🏙️ WargaTech — Analisis Kebutuhan & Ide Implementasi Frontend

> **Platform Smart City** untuk warga DKI Jakarta — menghubungkan layanan publik, mobilitas transportasi, pelaporan masalah kota, dan layanan kesehatan dalam satu platform digital.

---

## 📋 Ringkasan Proyek

WargaTech adalah aplikasi web berbasis **React + Vite + TailwindCSS** yang terhubung ke backend **Laravel (Sanctum Auth)** di `http://localhost:8080/`. Website memiliki **2 role** (Warga & Petugas), masing-masing dengan tampilan dan akses fitur yang berbeda.

### Tech Stack Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: TailwindCSS 4 (sudah terinstall)
- **Tambahan yang dibutuhkan**: React Router DOM, Axios, Shadcn UI, Lucide Icons

### Tema Desain (dari Konsep)
- Warna utama: **Dark Navy (#1a1f36)** sebagai background utama, **Orange/Amber (#f59e0b)** sebagai aksen
- Font modern dan bersih
- Glassmorphism pada card-card info
- Navbar sticky dengan logo dan navigasi
- Layout responsif dengan card-card berisi ikon
- Dark mode & Light mode toggle

---

## 🗂️ Struktur Halaman yang Dibutuhkan

### 1. 🔐 Login Page
**Route**: `/login`

**Deskripsi**: Halaman login dengan email dan password. Jika belum punya akun → arahkan ke register. Jika email belum diverifikasi → otomatis arahkan ke halaman verify.

**API Endpoint**:
```
POST /api/auth/login
```

**Form Fields**:
| Field      | Tipe Input     | Validasi                        |
|------------|----------------|---------------------------------|
| `email`    | `email`        | Required, format email valid    |
| `password` | `password`     | Required                        |

**Response Handling**:
- ✅ **Success (200)**: Simpan `token` ke localStorage/cookie, simpan `data` user (termasuk `role`), redirect ke Landing Page
- ❌ **401**: Tampilkan "Email atau password salah"
- ⚠️ **422 (email belum diverifikasi)**: Redirect otomatis ke `/verify?email={email}` — backend akan otomatis mengirim OTP baru

**Catatan Implementasi**:
- Semua request setelah login harus menyertakan header `Authorization: Bearer {token}`
- Simpan data user termasuk `role` untuk menentukan tampilan (warga/petugas)
- Response login mengembalikan objek user lengkap di field `data`

---

### 2. ✉️ Verify Page
**Route**: `/verify`

**Deskripsi**: Halaman verifikasi email dengan 6 digit kode OTP. Kode dikirim ke email pengguna. Terdapat fitur kirim ulang kode.

**API Endpoints**:
```
POST /api/auth/verify-email    → Verifikasi kode OTP
POST /api/auth/resend           → Kirim ulang kode OTP
```

> ⚠️ **Perhatian**: URL endpoint di backend sebenarnya `/api/auth/verify-email` (bukan `/api/auth/verify` seperti di prompt). Pastikan gunakan yang sesuai backend.

**Form Fields untuk Verify**:
| Field   | Tipe Input   | Validasi                                  |
|---------|--------------|-------------------------------------------|
| `email` | `hidden`     | Required, format email (dari query param) |
| `code`  | `number`     | Required, integer, tepat 6 digit          |

**Form Fields untuk Resend**:
- Tidak ada form field tambahan (menggunakan user yang sedang login / email dari state)

**UI Idea**:
- 6 kotak input terpisah untuk masing-masing digit OTP (OTP input style)
- Timer countdown (5 menit) yang menunjukkan kapan kode kedaluwarsa
- Tombol "Kirim Ulang" yang aktif setelah beberapa detik

---

### 3. 📝 Register Page
**Route**: `/register`

**Deskripsi**: Halaman pendaftaran akun baru. Setelah berhasil register, otomatis redirect ke halaman verify.

**API Endpoint**:
```
POST /api/auth/register
```

**Form Fields**:
| Field       | Tipe Input       | Validasi Backend                                     | Validasi Frontend                    |
|-------------|------------------|------------------------------------------------------|--------------------------------------|
| `name`      | `text`           | Required, hanya huruf & spasi, min 3 karakter       | Required, regex `/^[A-Za-z ]+$/`     |
| `email`     | `email`          | Required, format email, unique di tabel users        | Required, format email               |
| `password`  | `password`       | Required, min 6 karakter                             | Required, min 6                      |
| `gender`    | `select`         | Required, pilihan: `male` / `female`                 | Required, dropdown                   |
| `phone`     | `tel`            | Required, min 12, max 16 karakter                    | Required, numeric, 12-16 digit       |
| `birthday`  | `date`           | Required, format `Y-m-d` (contoh: `2000-01-15`)     | Required, date picker                |
| `nik`       | `text`           | Required, unique, tepat 16 karakter                  | Required, numeric, 16 digit          |
| `nomor_kk`  | `text`           | Required                                             | Required                             |

**Response Handling**:
- ✅ **Success**: Tampilkan pesan "Kode verifikasi telah dikirim", redirect ke `/verify?email={email}`
- ❌ **422**: Tampilkan error per-field dari `errors` object

**Catatan**:
- Role default saat register adalah `warga` (diset di backend)
- Setelah register, backend otomatis mengirim OTP ke email dan membuat profile picture record (null)

---

### 4. 🏠 Landing Page
**Route**: `/` atau `/beranda`

**Deskripsi**: Halaman utama setelah login. Terdiri dari beberapa section.

#### Section 1 — Hero Section
- Judul besar: **"Koneksi Digital untuk Kota Berkelanjutan"**
- Subjudul: *"Akses layanan publik terpadu, pantau mobilitas ramah lingkungan, dan ikut serta membangun lingkungan masyarakat yang lebih cerdas dan aman melalui satu platform."*
- Logo provinsi DKI Jakarta di sebelah kanan
- Tombol CTA: "Lapor Masalah Kota" & "Cek Jadwal Transportasi"
- Widget glassmorphism: Kualitas Udara & Mobilitas Pintar (sesuai concept)

#### Section 2 — Fitur Platform
- Judul: **"Layanan Pintar untuk Warga Cerdas"**
- Subjudul: *"Akses berbagai fasilitas dan layanan publik perkotaan secara terintegrasi untuk mendukung efisiensi kehidupan sosial masyarakat."*
- 3 Card fitur:
  1. 🏥 **Layanan Kesehatan** — Akses dokter umum, buat perjanjian, dan pantau status booking
  2. 🚆 **Mobilitas Sosial** — Jadwal kereta, bus, MRT, dan LRT real-time
  3. 🌿 **Stabilitas Lingkungan** — Infografis pemilahan sampah dan pelaporan lingkungan

#### Section 3 — Laporan Warga (Khusus Role Warga)

**API Endpoints**:
```
POST   /api/report              → Buat laporan baru
GET    /api/report/user-report   → Ambil laporan milik user
DELETE /api/report/{id}          → Hapus laporan
```

**Form Fields untuk Buat Laporan**:
| Field         | Tipe Input     | Validasi Backend                                                 | Opsi/Keterangan                                                           |
|---------------|----------------|------------------------------------------------------------------|---------------------------------------------------------------------------|
| `type`        | `select`       | Required, harus salah satu: `infrastruktur`, `fasilitas`, `pelanggaran`, `lingkungan` | Dropdown dengan label: Jalan Berlubang → `infrastruktur`, Fasilitas Umum Rusak → `fasilitas`, Pelanggaran Umum → `pelanggaran`, Lingkungan Kotor → `lingkungan` |
| `location`    | `text`         | Required, string                                                 | Input lokasi kejadian                                                     |
| `description` | `textarea`     | Required                                                         | Deskripsi detail permasalahan                                             |
| `attachment`  | `file` (image) | Required, max 5MB (~5012KB)                                      | Validasi di frontend: file size ≤ 5MB, accept image/*                    |

**Kirim sebagai**: `FormData` (multipart/form-data) karena ada file upload

**Daftar Laporan User** (di bawah form):
- Menampilkan semua laporan user yang sedang login
- Data dari `GET /api/report/user-report`
- Setiap laporan menampilkan: type, location, description, attachment (gambar), created_at, status (`finish` / `unfinished`)
- Tombol hapus laporan → `DELETE /api/report/{id}`

#### Section 4 — Jadwal Transportasi Terdekat
- Menampilkan kereta/bus/MRT/LRT dengan waktu tunggu tercepat dari jam saat ini
- Data diambil dari masing-masing API list mobility
- Menampilkan waktu tunggu dalam menit dari jam saat ini

**API yang digunakan**:
```
GET /api/mobility/train/list-train
GET /api/mobility/bus/list-bus?departure={jam_sekarang}
GET /api/mobility/mrt/list-mrt
GET /api/mobility/lrt/list-lrt?type=jabodebek
GET /api/mobility/lrt/list-lrt?type=jakarta
```

---

### 5. 🏥 Layanan Kesehatan
**Route**: `/layanan-kesehatan`

**Deskripsi**: Daftar layanan kesehatan (dokter) yang tersedia. User warga bisa membuat perjanjian. User petugas bisa menerima/menolak perjanjian.

#### Tampilan Warga

**API Endpoints**:
```
GET  /api/service                   → Daftar semua layanan kesehatan
GET  /api/service?type={kategori}   → Filter berdasarkan kategori/tipe
POST /api/service                   → Buat perjanjian baru
GET  /api/service/user-booking      → Daftar perjanjian milik user
```

**Data Layanan Kesehatan** (dari GET /api/service):
| Field         | Keterangan              |
|---------------|-------------------------|
| `id`          | ID service              |
| `doctor_name` | Nama dokter             |
| `type`        | Kategori/spesialisasi   |
| `location`    | Lokasi praktek          |
| `open_time`   | Jam buka (format `H:i`) |
| `close_time`  | Jam tutup (format `H:i`)|

**Form Fields untuk Booking** (modal/popup ketika tombol "Buat Perjanjian" diklik):
| Field        | Tipe Input     | Validasi Backend                              | Keterangan                           |
|--------------|----------------|-----------------------------------------------|--------------------------------------|
| `service_id` | `hidden`       | Required, harus ada di tabel services         | ID dokter yang dipilih               |
| `date`       | `date`         | Required, format `Y-m-d`, minimal besok hari  | Date picker, disable hari ini & sebelumnya |
| `book_time`  | `time`         | Required, format `H:i`                        | Time picker, harus dalam jam buka-tutup |

**Response Handling Booking**:
- ✅ **201**: "Perjanjian telah dibuat dengan {nama_dokter}"
- ❌ **422 (jadwal tutup)**: "Layanan saat ini sedang tutup"
- ❌ **422 (duplikat)**: "Kamu sudah membuat perjanjian di tanggal tersebut"

**Daftar Perjanjian User** (dari GET /api/service/user-booking):
- Menampilkan semua booking user dengan relasi Service
- Status: `pending` / `accepted` / `rejected`
- Badge warna: pending → kuning, accepted → hijau, rejected → merah

#### Tampilan Petugas

**API Endpoints**:
```
GET /api/service/all-booking              → Semua perjanjian dari semua user
PUT /api/service/accept-booking/{id}      → Terima perjanjian
PUT /api/service/reject-booking/{id}      → Tolak perjanjian
```

**Data All Booking** (response):
| Field         | Keterangan                |
|---------------|---------------------------|
| `id`          | ID perjanjian (medical)   |
| `name`        | Nama pasien (user)        |
| `type`        | Kategori layanan          |
| `doctor_name` | Nama dokter               |
| `location`    | Lokasi                    |
| `date`        | Tanggal perjanjian        |
| `book_time`   | Waktu perjanjian          |
| `status`      | pending/accepted/rejected |

**Logika Petugas**:
- Jika status = `pending`: tampilkan tombol ✅ Accept & ❌ Reject
- Jika status = `accepted` atau `rejected`: tombol disabled / hidden, status final tidak bisa diubah lagi

---

### 6. 🚆 Mobilitas Sosial
**Route**: `/mobilitas`

**Deskripsi**: Informasi jadwal transportasi umum (Kereta, Bus, MRT, LRT). Warga bisa melihat jadwal dan mencari jadwal terdekat. Petugas bisa menambahkan jadwal baru.

#### Tampilan Warga (Lihat Jadwal)

**API Endpoints**:
```
GET /api/mobility/train/list-train                   → Daftar semua kereta
GET /api/mobility/train/detail-train/{id}            → Detail rute kereta
GET /api/mobility/train/list-station                 → Daftar stasiun kereta

GET /api/mobility/bus/list-bus                       → Daftar semua bus
GET /api/mobility/bus/list-bus?corridor={kode}&departure={HH:mm} → Filter bus
GET /api/mobility/bus/list-corridor                  → Daftar koridor bus

GET /api/mobility/mrt/list-mrt                       → Daftar semua MRT
GET /api/mobility/mrt/list-station                   → Daftar stasiun MRT

GET /api/mobility/lrt/list-lrt?type={jabodebek|jakarta} → Daftar LRT (filter type)
GET /api/mobility/lrt/detail-lrt/{id}                → Detail rute LRT
```

**Data Response Kereta** (list-train):
| Field       | Keterangan                           |
|-------------|--------------------------------------|
| `id`        | ID kereta                            |
| `code`      | Kode kereta                          |
| `line`      | Nama jalur (redline/blueline/dll)    |
| `direction` | Arah perjalanan (stasiun-stasiun)    |
| `departure` | Waktu berangkat (format `H:i`)       |

**Data Response Detail Kereta** (detail-train/{id}):
| Field       | Keterangan                          |
|-------------|-------------------------------------|
| `code`      | Kode kereta                         |
| `direction` | Arah perjalanan                     |
| `station`   | Array: `{ station: "nama", time: "HH:mm" }` |

**Data Response Bus** (list-bus):
| Field       | Keterangan                            |
|-------------|---------------------------------------|
| `route_id`  | ID rute                               |
| `code`      | Kode koridor                          |
| `direction` | Halte awal - Halte akhir              |
| `departure` | Waktu berangkat (format `H:i`)        |

**Data Response MRT** (list-mrt):
| Field         | Keterangan                                     |
|---------------|-------------------------------------------------|
| `id`          | ID MRT                                          |
| `code`        | Kode kereta MRT                                 |
| `departure`   | Waktu berangkat                                  |
| `destination` | Tujuan (lebakbulus/bundaranhi)                   |
| `station`     | Array: `{ station: "nama", time: "HH:mm" }`     |

**Data Response LRT** (list-lrt):
| Field         | Keterangan                                     |
|---------------|-------------------------------------------------|
| `id`          | ID LRT                                          |
| `code`        | Kode kereta LRT                                  |
| `type`        | Tipe jalur (jabodebek/jakarta)                   |
| `destination` | Tujuan akhir                                     |
| `departure`   | Waktu berangkat                                  |

**Fitur Pencarian Jadwal Terdekat**:
- Input waktu saat ini (atau auto-detect)
- Filter jadwal keberangkatan yang ≥ waktu saat ini
- Untuk bus: gunakan query param `departure` di API
- Untuk LRT: API sudah memfilter otomatis `departure >= now()`
- Untuk kereta & MRT: filter di frontend

**Tab/Filter kategori**: Kereta | Bus | MRT | LRT

#### Tampilan Petugas (Tambah Jadwal)

##### Form Tambah Kereta
```
POST /api/mobility/train/create-train
```
| Field          | Tipe Input     | Validasi                                                                 |
|----------------|----------------|--------------------------------------------------------------------------|
| `code`         | `text`         | Required                                                                 |
| `departure`    | `time`         | Required, format `H:i`                                                  |
| `line`         | `select`       | Required, opsi: `redline`, `greenline`, `blueline`, `purpleline`, `brownline` |
| `stasiun_awal` | `select/text`  | Required (dinamis berdasarkan line yang dipilih)                         |
| `stasiun_akhir`| `select/text`  | Required (dinamis berdasarkan line yang dipilih)                         |
| `via`          | `select`       | Kondisional — Required jika blueline dengan rute cikarang↔kampungbandan atau bekasi↔kampungbandan. Opsi: `pse` (Pasar Senen) / `mri` (Manggarai) |

**Rute yang tersedia per Line**:
- **Redline**: Bogor ↔ Jakarta Kota, Nambo ↔ Jakarta Kota
- **Blueline**: Cikarang ↔ Kampung Bandan (via PSE/MRI), Bekasi ↔ Kampung Bandan (via PSE/MRI), Cikarang ↔ Angke, Bekasi ↔ Angke
- **Greenline**: Tanah Abang ↔ Rangkasbitung
- **Purpleline**: Jakarta Kota ↔ Tanjung Priok
- **Brownline**: Duri ↔ Tangerang

##### Form Tambah Bus
```
POST /api/mobility/bus/create-bus
```
| Field       | Tipe Input  | Validasi                           |
|-------------|-------------|------------------------------------|
| `route_id`  | `select`    | Required, harus ada di bus_routes  |
| `departure` | `time`      | Required, format `H:i`            |

> Daftar koridor bus untuk dropdown diambil dari `GET /api/mobility/bus/list-corridor`

##### Form Tambah MRT
```
POST /api/mobility/mrt/create-mrt
```
| Field         | Tipe Input  | Validasi                                              |
|---------------|-------------|-------------------------------------------------------|
| `code`        | `text`      | Required                                              |
| `departure`   | `time`      | Required, format `H:i`, antara `06:00` - `23:00`     |
| `destination` | `select`    | Required, opsi: `lebakbulus` / `bundaranhi`           |

##### Form Tambah LRT
```
POST /api/mobility/lrt/create-lrt
```
| Field          | Tipe Input  | Validasi                                                                 |
|----------------|-------------|--------------------------------------------------------------------------|
| `code`         | `text`      | Required                                                                 |
| `departure`    | `time`      | Required, format `H:i`, antara `06:00` - `22:00`                       |
| `type`         | `select`    | Required, opsi: `jabodebek` / `jakarta`                                 |
| `stasiun_awal` | `select`    | Required jika type = `jabodebek` (opsi: dukuhatas, jatimulya, harjamukti)|
| `stasiun_akhir`| `select`    | Required jika type = `jabodebek` (opsi: dukuhatas, jatimulya, harjamukti)|
| `destination`  | `select`    | Required jika type = `jakarta` (opsi: `pegangsaandua` / `manggarai`)    |

**Rute LRT yang tersedia**:
- **Jakarta**: Pegangsaan Dua ↔ Manggarai (11 stasiun)
- **Jabodebek**: Dukuh Atas ↔ Jatimulya, Dukuh Atas ↔ Harjamukti

---

### 7. 🌿 Stabilitas Lingkungan
**Route**: `/stabilitas-lingkungan`

**Deskripsi**: Halaman informatif tentang pemilahan sampah, jenis-jenis sampah, dan link ke halaman laporan warga.

**Konten Statis** (tidak ada API khusus):

#### Jenis-jenis Sampah (dengan gambar masing-masing):
1. **♻️ Sampah Organik** — Sisa makanan, daun kering, kulit buah, dll.
2. **🔩 Sampah Anorganik** — Plastik, logam, kaca, kertas yang tidak bisa terurai.
3. **☢️ Limbah B3 (Bahan Berbahaya & Beracun)** — Baterai, cat, obat kadaluwarsa, elektronik.
4. **🗑️ Residu** — Sampah yang tidak bisa didaur ulang dan tidak termasuk kategori lain.

#### Fitur:
- Infografis visual pemilahan sampah (bisa dibuat dengan generate_image)
- Artikel singkat masing-masing jenis sampah
- Tombol **"Laporkan Tumpukan Sampah"** → redirect ke section Laporan Warga di Landing Page (dengan type pre-selected ke `lingkungan`)
- Gambar ilustrasi untuk setiap jenis sampah

---

### 8. 📱 Navbar (Sticky)
**Tampil di semua halaman setelah login**

**Komponen**:
| Elemen               | Keterangan                                                   |
|----------------------|--------------------------------------------------------------|
| Logo                 | Dari `assets/logo.png` + teks **"WargaTech"**                |
| Beranda              | Link ke `/`                                                  |
| Layanan Kesehatan    | Link ke `/layanan-kesehatan`                                 |
| Mobilitas Sosial     | Link ke `/mobilitas`                                         |
| Stabilitas Lingkungan| Link ke `/stabilitas-lingkungan`                             |
| Profil Pengguna      | Dropdown menu                                                |
| └─ Laporan Saya      | Link ke section laporan / halaman khusus                     |
| └─ Pengaturan        | Link ke `/pengaturan`                                        |
| └─ Keluar            | Trigger logout                                               |
| Dark/Light Mode      | Toggle theme                                                 |
| Status Role          | Badge menunjukkan "Warga" atau "Petugas"                     |

**Logout API**:
```
POST /api/auth/logout
Header: Authorization: Bearer {token}
```
- Hapus token dari localStorage/cookie
- Redirect ke `/login`

---

### 9. ⚙️ Pengaturan (Profil)
**Route**: `/pengaturan`

**Deskripsi**: User bisa mengubah data diri dan foto profil. Untuk ubah data diri, perlu verifikasi ulang dengan kode 8 digit campuran huruf & angka.

#### Ambil Data Profil
```
GET /api/profile
Header: Authorization: Bearer {token}
```

**Response**:
| Field             | Keterangan                                     |
|-------------------|-------------------------------------------------|
| `user`            | Objek user lengkap (name, email, phone, dll)   |
| `profile_picture` | URL foto profil (atau default path)            |

#### Ubah Data Profil

**Alur**:
1. User klik "Ubah Profil"
2. Backend otomatis mengirim kode verifikasi 8 digit (campuran huruf & angka) ke email
3. Response: 422 dengan pesan "Mohon verifikasi terlebih dahulu"
4. User memasukkan kode verifikasi

**Step 1 — Trigger verifikasi** (endpoint pertama yang dicall):
```
PUT /api/profile/data-profile
Header: Authorization: Bearer {token}
```
> Ketika `email_verified_at <= now()`, backend mengirim kode baru dan return 422

**Step 2 — Verifikasi kode** (endpoint `verifyCode` di ProfileController, namun TIDAK terdaftar di routes):
> ⚠️ **CATATAN PENTING**: Method `verifyCode` ada di `ProfileController` tapi **TIDAK** didaftarkan di `routes/api.php`. Ini perlu ditambahkan di backend, atau gunakan mekanisme lain.

**Form Fields Verifikasi Profil**:
| Field   | Tipe Input | Validasi                         |
|---------|------------|----------------------------------|
| `email` | `hidden`   | Required, format email           |
| `code`  | `text`     | Required, tepat 8 karakter       |

**Step 3 — Kirim data profil baru** (setelah terverifikasi):
```
PUT /api/profile/data-profile
Header: Authorization: Bearer {token}
```
| Field      | Tipe Input  | Validasi                                     |
|------------|-------------|----------------------------------------------|
| `name`     | `text`      | Required, hanya huruf & spasi, min 3         |
| `gender`   | `select`    | Required, `male` / `female`                  |
| `phone`    | `tel`       | Required, 12-16 karakter                     |
| `birthday` | `date`      | Required, format `Y-m-d`                     |
| `nik`      | `text`      | Required, unique, tepat 16 karakter          |
| `nomor_kk` | `text`      | Required                                     |

#### Ubah Foto Profil
```
POST /api/profile/photo-profile
Header: Authorization: Bearer {token}
Content-Type: multipart/form-data
```
| Field        | Tipe Input     | Validasi                        |
|--------------|----------------|---------------------------------|
| `attachment` | `file` (image) | Required, max 2MB, format image |

#### Hapus Foto Profil
```
POST /api/profile/delete-photo
Header: Authorization: Bearer {token}
```
- Tidak ada form field (langsung kirim request)
- Foto profil di-set menjadi `null`, tampilan kembali ke default

---

## 🎨 Ide Desain & UX

### Palette Warna (dari Konsep)
```
Primary Dark    : #1a1f36 (navy gelap)
Primary Accent  : #f59e0b / #f97316 (orange/amber)
Background Light: #f8fafc
Card Background : #ffffff (light) / #232946 (dark)
Text Primary    : #1e293b (light) / #f1f5f9 (dark)
Text Secondary  : #64748b
Success         : #22c55e
Warning         : #eab308
Danger          : #ef4444
Info            : #3b82f6
```

### Komponen UI yang Perlu Dibuat
1. **AuthLayout** — Layout khusus halaman auth (login, register, verify) dengan background gradient
2. **MainLayout** — Layout utama dengan Navbar sticky + content area
3. **Navbar** — Sticky, responsive, dengan dropdown profil & dark mode toggle
4. **Card** — Berbagai varian (service card, report card, transport card)
5. **Modal/Dialog** — Untuk form booking, konfirmasi hapus, dll
6. **Badge** — Status badge (pending, accepted, rejected, finish, unfinished)
7. **DataTable** — Untuk daftar laporan, booking, jadwal transport
8. **OTPInput** — Custom 6/8 digit input component
9. **FileUpload** — Drag & drop area dengan preview dan validasi ukuran
10. **ThemeToggle** — Dark/Light mode switcher
11. **TransportCard** — Card khusus untuk jadwal transportasi dengan waktu tunggu
12. **FilterBar** — Tab/chips untuk filter kategori

### Animasi & Interaksi
- Smooth page transitions (React Router)
- Skeleton loading saat fetch data
- Toast notifications untuk success/error
- Hover effects pada card-card
- Micro-animations pada toggle theme
- Scroll reveal animations di Landing Page
- Pulse animation pada badge status

---

## 🔒 Manajemen Auth & State

### Token Management
- Simpan token di `localStorage` dengan key `wargatech_token`
- Simpan data user (termasuk role) di state management
- Buat Axios instance dengan interceptor untuk auto-attach token
- Handle 401 response → auto logout & redirect ke login

### Protected Routes
- Route yang membutuhkan auth: semua kecuali `/login`, `/register`, `/verify`
- Route khusus petugas: form tambah jadwal, accept/reject booking, mark finish laporan
- Route khusus warga: buat laporan, buat booking

### Conditional Rendering berdasarkan Role
```
Warga:
  - Bisa buat laporan
  - Bisa buat booking layanan kesehatan
  - Bisa lihat jadwal transportasi
  - Bisa ubah profil

Petugas:
  - Bisa lihat semua laporan (all-report) & mark finish
  - Bisa accept/reject booking
  - Bisa tambah jadwal transportasi (kereta, bus, MRT, LRT)
  - Bisa ubah profil
```

---

## 📁 Struktur Folder yang Direkomendasikan

```
src/
├── assets/
│   └── logo.png
├── components/
│   ├── ui/          → Shadcn UI components
│   ├── layout/      → Navbar, Footer, AuthLayout, MainLayout
│   ├── common/      → Badge, Card, Modal, OTPInput, FileUpload
│   └── sections/    → HeroSection, FeatureSection, ReportSection, TransportSection
├── pages/
│   ├── auth/        → Login, Register, Verify
│   ├── home/        → LandingPage
│   ├── health/      → LayananKesehatan (Warga & Petugas views)
│   ├── mobility/    → MobilitasSosial (Warga & Petugas views)
│   ├── environment/ → StabilitasLingkungan
│   └── settings/    → Pengaturan (Profil)
├── hooks/           → useAuth, useFetch, useTheme
├── services/        → api.js (Axios instance), auth.js, report.js, service.js, mobility.js, profile.js
├── context/         → AuthContext, ThemeContext
├── utils/           → helpers, validators, constants
├── App.jsx
├── main.jsx
├── index.css
└── App.css
```

---

## ⚠️ Catatan Penting & Temuan dari Analisis Backend

### 1. Endpoint Tidak Terdaftar di Routes
- `ProfileController@verifyCode` **ada di controller tapi tidak ada di routes**. Perlu ditambahkan route di backend, misalnya:
  ```php
  Route::post('/verify-code', [ProfileController::class, 'verifyCode']);
  ```

### 2. Perbedaan Nama Endpoint
- Prompt menyebutkan `/api/auth/verify` → Backend sebenarnya `/api/auth/verify-email`
- Prompt menyebutkan `/api/profile/delete-photo` dengan method DELETE → Backend sebenarnya method `POST`

### 3. Resend OTP
- Endpoint `resend` di backend menggunakan `$request->user()` yang artinya butuh token auth. Namun saat register/verify awal, user belum punya token. Perlu perhatian khusus untuk flow ini.

### 4. Pagination
- API `list-bus` menggunakan pagination (`paginate(10)`) — frontend perlu handle pagination (tombol next/prev, atau infinite scroll)
- API lainnya (train, MRT, LRT) tidak menggunakan pagination

### 5. File Storage URL
- Foto lampiran laporan: `Storage::url(...)` — frontend perlu prefix URL base storage
- Foto profil: bisa `null` (default) atau path storage

### 6. CORS
- Pastikan backend sudah konfigurasi CORS untuk menerima request dari frontend (biasanya port Vite: `localhost:5173`)

---

## 📊 Ringkasan Semua API Endpoints

| No | Endpoint | Method | Auth | Role | Keterangan |
|----|----------|--------|------|------|------------|
| 1  | `/api/auth/register` | POST | ❌ | - | Registrasi user baru |
| 2  | `/api/auth/login` | POST | ❌ | - | Login user |
| 3  | `/api/auth/logout` | POST | ✅ | All | Logout user |
| 4  | `/api/auth/verify-email` | POST | ❌ | - | Verifikasi email dengan OTP 6 digit |
| 5  | `/api/auth/resend` | POST | ✅ | All | Kirim ulang OTP |
| 6  | `/api/mobility/train/list-station` | GET | ✅ | All | Daftar stasiun kereta |
| 7  | `/api/mobility/train/create-train` | POST | ✅ | Petugas | Tambah jadwal kereta |
| 8  | `/api/mobility/train/list-train` | GET | ✅ | All | Daftar semua kereta |
| 9  | `/api/mobility/train/detail-train/{id}` | GET | ✅ | All | Detail rute kereta |
| 10 | `/api/mobility/bus/create-bus` | POST | ✅ | Petugas | Tambah jadwal bus |
| 11 | `/api/mobility/bus/list-bus` | GET | ✅ | All | Daftar bus (+ filter) |
| 12 | `/api/mobility/bus/list-corridor` | GET | ✅ | All | Daftar koridor bus |
| 13 | `/api/mobility/mrt/create-mrt` | POST | ✅ | Petugas | Tambah jadwal MRT |
| 14 | `/api/mobility/mrt/list-mrt` | GET | ✅ | All | Daftar semua MRT |
| 15 | `/api/mobility/mrt/list-station` | GET | ✅ | All | Daftar stasiun MRT |
| 16 | `/api/mobility/lrt/create-lrt` | POST | ✅ | Petugas | Tambah jadwal LRT |
| 17 | `/api/mobility/lrt/list-lrt` | GET | ✅ | All | Daftar LRT (+ filter type) |
| 18 | `/api/mobility/lrt/detail-lrt/{id}` | GET | ✅ | All | Detail rute LRT |
| 19 | `/api/report` | POST | ✅ | Warga | Buat laporan baru |
| 20 | `/api/report/user-report` | GET | ✅ | Warga | Laporan milik user |
| 21 | `/api/report/all-report` | GET | ✅ | Petugas | Semua laporan |
| 22 | `/api/report/{id}` | PUT | ✅ | Petugas | Mark laporan selesai |
| 23 | `/api/report/{id}` | DELETE | ✅ | Warga | Hapus laporan |
| 24 | `/api/service` | POST | ✅ | Warga | Buat perjanjian kesehatan |
| 25 | `/api/service` | GET | ✅ | All | Daftar layanan kesehatan |
| 26 | `/api/service/user-booking` | GET | ✅ | Warga | Perjanjian milik user |
| 27 | `/api/service/all-booking` | GET | ✅ | Petugas | Semua perjanjian |
| 28 | `/api/service/accept-booking/{id}` | PUT | ✅ | Petugas | Terima perjanjian |
| 29 | `/api/service/reject-booking/{id}` | PUT | ✅ | Petugas | Tolak perjanjian |
| 30 | `/api/profile` | GET | ✅ | All | Ambil data profil |
| 31 | `/api/profile/data-profile` | PUT | ✅ | All | Ubah data profil |
| 32 | `/api/profile/photo-profile` | POST | ✅ | All | Upload foto profil |
| 33 | `/api/profile/delete-photo` | POST | ✅ | All | Hapus foto profil |

---

*Dokumen ini dibuat berdasarkan analisis menyeluruh terhadap backend Laravel (models, controllers, migrations, routes) dan spesifikasi dari prompt.md.*
