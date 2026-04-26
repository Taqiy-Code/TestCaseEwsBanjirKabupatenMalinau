# Description
Proyek ini merupakan test case untuk Pijar Teknologi Mediatama. Dikerjakan selama 3 hari. 

# Prerequisite
1. Node JS (versions 20.19+, 22.12+, 24.0+)
2. Docker Desktop (Containerization)
3. PostgreSQL (Database)
4. Node Package Manager (NPM) 

# Getting Started
## Clone Repository
```bash 
git clone https://github.com/Taqiy-Code/TestCaseEwsBanjirKabupatenMalinau.git
cd TestCaseEwsBanjirKabupatenMalinau
```
# Docker Setup 
Pastikan docker engine menyala.
```bash
docker compose up 
```

# No Docker Setup
## Setup Environment
Buat file .env di root direktori
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/database?schema=public"
```

## Install Depedencies
```bash
npm install
```

## Database Setup
Pastikan database PostgreSql sudah menyala. 
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

## Run Development Server
```bash
npm run dev
```

## User Interface 
![Dashboard EWS Malinau](./public/screenshots/dashboard-preview.png)


# Analysis Tasks
## Dari Batch ke Realtime.
Di produksi nanti, sensor akan terus mengirim data via API setiap 1 menit (bukan file statis seperti di test ini). Komponen apa yang perlu ditambahkan ke arsitektur Anda? Apa yang bertugas mengambil data, menyimpan, dan memicu perubahan UI.

Pada sistem yang beralih dari batch ke realtime, arsitektur yang perlu ditambah yaitu, pertama, diperlukan ingestion layer berupa API endpoint dengan service Terpisah seperti Express yang bertugas menerima data dari sensor setiap menit. Namun jika diperlukan ketahanan dan skalabilitas, bisa ditambahkan message broker seperti EMQX (Online) atau Mosquitto (Lokal). 
Setelah masuk melalui service, data kemudian diproses oleh service untuk menyimpan data ke database sekaligus menentukan status (normal, waspada, awas). 
Untuk memicu perubahan UI secara realtime, bisa digunakan WebSocket sehingga dashboard langsung ter-update tanpa refresh manual.

## Flow Notifikasi.
Saat status sensor naik ke WASPADA atau AWAS, sistem harus mengirim notifikasi (misalnya WhatsApp atau SMS ke petugas BPBD). Jelaskan:
- Kapan notifikasi dikirim? (tiap reading baru? tiap perubahan level? tiap periode tertentu?)
- Kalau nilai sensor naik-turun tipis di dekat threshold (misal: 199 → 201 → 199 → 201) sehingga status bolak-balik, bagaimana mencegah notifikasi terkirim berulang-ulang? Komponen mana di arsitektur Anda yang bertanggung jawab?

Notifikasi tidak dikirim setiap ada reading baru, tetapi hanya saat terjadi perubahan level status (aman ke waspada atau waspada ke awas). Ini penting untuk menghindari spam notifikasi. Namun, jika kondisi tetap berada di level berbahaya dalam waktu lama, bisa ditambahkan notifikasi periodik (misalnya setiap 30 menit sebagai reminder). 
Nilai sensor yang naik-turun tipis di dekat threshold, saya akan menggunakan debounce logic. Dengan memberi jarak threshold naik dan turun, misalnya harus konsisten di atas threshold selama 3–5 menit sebelum dianggap naik level. Komponen yang bertanggung jawab adalah processing layer. Melakukan penyimpanan state terakhir sensor dan memutuskan apakah perubahan cukup signifikan untuk memicu notifikasi. 

## Sensor Mati.
Kalau sebuah sensor tiba-tiba berhenti kirim data (hardware rusak, sinyal hilang, battery habis), sistem harus tetap sadar ada masalah — karena "tidak ada data" ≠ "aman". Jelaskan:
- Bagaimana aplikasi Anda mendeteksi sensor yang mati?
- Apa yang ditampilkan di dashboard?
- Apakah ini memicu notifikasi tersendiri? 

Untuk mendeteksi sensor yang mati, sistem perlu menerapkan interval monitoring, yaitu mencatat timestamp terakhir setiap sensor mengirim data. Jika dalam periode tertentu (misalnya >3–5 menit dari interval normal) tidak ada data masuk, maka sensor dianggap offline. Deteksi ini dapat dilakukan oleh scheduler atau background job yang berjalan berkala. 
Di dashboard, status sensor tersebut harus ditampilkan secara jelas. Misalnya dengan label “OFFLINE” atau warna khusus (abu-abu/merah) agar operator langsung sadar bahwa ini bukan kondisi aman, melainkan masalah perangkat. 
Kondisi ini harus memicu notifikasi karena sensor mati (tidak ada data) bisa lebih berbahaya daripada data normal.