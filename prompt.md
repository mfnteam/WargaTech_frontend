Saya ingin kamu membuat tampilan website yang keren dan modern dengan menggunakan tailwind css dan Shadcn UI. Untuk api sudah saya sediakan di folder Wargatech_be/ untuk port api adalah http://localhost:8080/.

Saya ingin kamu menggunakan tema seperti yang ada di folder Wargatech_fe/concept. Tolong kamu analisis terlebih dahulu konsep tersebut dan implementasikan di website ini.

Website ini memiliki 2 role (warga & petugas) sehingga terdapat 2 tampilan untuk masing masing role (petugas/warga). dan masing masing role akan memiliki halaman landing page, dan halaman lainnya yang berbeda sesuai dengan role nya.

Terdapat beberapa bagian/halaman pada website ini, yaitu:

1. Login Page
    user dapat login menggunakan email dan password, apabila user tidak memiliki akun maka akan diarahkan untuk mendaftar terlebih dahulu. Apabila email belum diverifikasi, user akan otomatis dipindahkan ke halaman verifikasi untuk memverifikasi alamat email yang di daftarkan

2. Verify Page
    User akan dikirimkan 6 digit kode otp yang akan masuk melalui email, user harus memasukkan kode tersebut untuk verifikasi. Terdapat juga fitur untuk mengirim ulang kode jika user tidak menerimanya.

3. Register Page
    User dapat mendaftar dengan memasukkan nama, email, password, jenis kelamin, nomor telepon, tanggal lahir, NIK, dan Nomor KK. lalu terdapat tombol daftar untuk melakukan pendaftaran. apabila user berhasil mendaftar akan otomatis diarahkan ke halaman verify.

4. Landing Page
    Setelah user berhasil login, user akan diarahkan ke landing page. terdapat beberapa bagian pada landing page, yaitu:

    - Tampilan Utama yang berisi tulisan "Koneksi Digital untuk Kota Berkelanjutan" dan tulisan kecil dibawahnya bertuliskan "Akses layanan publik terpadu, pantau mobilitas ramah lingkungan, dan ikut serta membangun lingkungan masyarakat yang lebih cerdas dan aman melalui satu platform." dan ditambahkan logo provinsi DKI Jakarta di sebelah kanan.

    - Tulisan yang bertuliskan "Layanan Pintar untuk Warga Cerdas" dan tulisan kecil dibwaahnya yang bertuliskan "Akses berbagai fasilitas dan layanan publik perkotaan secara terintegrasi untuk mendukung efisiensi kehidupan sosial masyarakat." dilanjutkan dengan daftar Fitur pada platform seperti Layanan kesehatan, Mobilitas Sosial, dan Stabilitas Lingkungan.

    - Laporan warga, dimana warga bisa melaporkan permasalahan yang ada di lingkungan sekitar, seperti Jalan Berlubang, Fasilitas Umum yang rusak, Lingkungan Kotor, dan Pelanggaran umum. Terdapat formulir untuk dapat melakukan laporan, yaitu jenis laporan, lokasi, deskripsi, dan lampiran gambar. Kemudian dibawahnya terdapat tombol "buat laporan" yang langsung mengirimkan formulir ke backend atau API. Pastikan gambar yang diunggah tidak melampaui batas maksimal 5MB. Kemudian dibawahnya terdapat daftar laporan yang sudah diunggah oleh pengguna tersebut beserta status laporannya (finish/unfinished).

    - Daftar Kereta, Bus, MRT, Atau LRT dengan waktu tunggu tercepat dari jadwal berangkat dengan jam saat ini sehingga pengguna bisa mengetahui kendaraan apa yang akan datang terdekat.

5. Layanan kesehatan
    Terdapat beberapa daftar layanan kesehatan yang tersedia seperti dokter umum beserta lokasi, jam buka, dan jam tutup. user dapat memfilter berdasarkan kategori. Terdapat tombol untuk membuat perjanjian antar dokter, user disuruh untuk memasukkan tanggal perjanjian, dan waktu perjanjian. Jika berhasil akan ada status terkonfirmasi. Pada tampilan petugas, petugas dapat mengubah status perjanjian tersebut menjadi "accepted" atau "rejected", apabila status sudah diubah menjadi salah satu dari itu, petugas tidak bisa mengubahnya lagi menjadi status yang lain.

6. Mobilitas Sosial
    Pada halaman mobilitas sosial terdapat beberapa daftar transportasi umum yang tersedia seperti Kereta, Bus, MRT, Atau LRT. User dapat memfilter berdasarkan kategori. Terdapat tombol untuk dapat melihat jadwal keberangkatan dari transportasi umum tersebut. Pada tampilan petugas, petugas dapat menambahkan jadwal keberangkatan dari transportasi umum tersebut. Pada tampilan warga, user dapat melihat jadwal keberangkatan dari transportasi umum tersebut. user dapat mencari informasi jadwal terdekat berdasarkan jam saat ini.

7. Stabilitas Lingkungan
    Pada halaman ini, user diberikan sebuah Infografis mengenai pemilahan sampah dan jenis jenis sampah, seperti sampah organik, anorganik, limbah B3, dan residu. Terdapat artikel mengenai masing masing jenis sampah. Terdapat juga fitur untuk dapat melaporkan jika terdapat tumpukan sampah di sekitar lingkungan warga yang mengarahkannya ke halaman laporan warga. Berikan gambar setiap jenis sampah agar terlihat menarik untuk dipandang.

8. Navbar
    Terdapat navbar di bagian paling atas website dan akan selalu menempel dimanapun user scroll atau berpindah halaman. pada navbar terdapat logo yang sudah saya sediakan di assets/logo.png dan tulisan "WargaTech" disebelahnya. kemudian terdapat beberapa menu navigasi yaitu: Beranda, Layanan Kesehatan, Mobilitas Sosial, Stabilitas Lingkungan, dan Profil Pengguna, pada Profil pengguna. terdapat dropdown yang berisi menu menu seperti Laporan Saya, Pengaturan, dan Keluar. Terdapat juga mode gelap dan terang pada navbar. Terdapat juga status user (petugas/warga).

9. Pengaturan
    Pengguna dapat mengubah data diri serta foto profil mereka. Namun apabila pengguna ingin mengubah data diri, mereka harus melakukan verifikasi kembali dengan 8 digit kode campuran huruf dan angka yang dikirimkan ke email mereka. kemudian harus memasukkan kode verifikasi nya ke formulir untuk menuliskan kode verifikasi. Pengguna dapat mengunggah foto profil mereka sendiri atau menghapus foto profil yang sudah ada.


API sudah saya siapkan dengan format url seperti berikut:


Base URL : http://localhost:8080/

1. Auth
    - /api/auth/register -> POST
    - /api/auth/login -> POST
    - /api/auth/logout -> POST
    - /api/auth/verify -> POST
    - /api/auth/resend -> POST

2. Mobilitas
    - Train
        /api/mobility/train/list-station -> GET
        /api/mobility/train/create-train -> POST
        /api/mobility/train/list-train -> GET
        /api/mobility/train/detail-train/{id} -> GET
    - Bus
        /api/mobility/bus/create-bus -> POST
        /api/mobility/bus/list-bus -> GET
        /api/mobility/bus/list-corridor -> GET
    - MRT
        /api/mobility/mrt/create-mrt -> POST
        /api/mobility/mrt/list-mrt -> GET
        /api/mobility/mrt/list-station -> GET
    - LRT
        /api/mobility/lrt/create-lrt -> POST
        /api/mobility/lrt/list-lrt -> GET
        /api/mobility/lrt/detail-lrt/{id} -> GET

3. Report
    - /api/report -> POST
    - /api/report/user-report -> GET
    - /api/report/all-report -> GET
    - /api/report/{id} -> PUT
    - /api/report/{id} -> DELETE

4. Service
    /api/service -> POST
    /api/service -> GET
    /api/service/user-booking -> GET
    /api/service/all-booking -> GET
    /api/service/accept-booking/{id} -> PUT
    /api/service/reject-booking/{id} -> PUT

5. Profile
    /api/profile -> GET
    /api/profile/data-profile -> PUT
    /api/profile/photo-profile -> POST
    /api/profile/delete-photo -> DELETE

Tolong kamu analisis kebutuhan pada projek ini, apabila ada API yang kurang tolong tambahkan saja. 
Semoga berhasil!