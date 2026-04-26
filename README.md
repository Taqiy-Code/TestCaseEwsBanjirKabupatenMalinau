## Description
Proyek ini merupakan test case untuk Pijar Teknologi Mediatama. Dikerjakan selama 3 hari. 
Teknologi Proyek : 
1. Node JS (v20+)
2. Next JS v15 (App Router)
3. Docker Desktop (Containerization)
4. PostgreSQL (Database)
5. Prisma (ORM)
6. Node Package Manager (NPM) 
7. Shadcn & Tailwind CSS (Styling)

## Getting Started
# Clone Repository
```bash 
git clone https://github.com/Taqiy-Code/TestCaseEwsBanjirKabupatenMalinau.git
cd TestCaseEwsBanjirKabupatenMalinau
```
## Docker Setup 
Pastikan docker engine menyala.
```bash
docker compose up --build
```

## No Docker Setup
# Setup Environment
Buat file .env di root direktori
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/database?schema=public"
```

# Install Depedencies
```bash
npm install
```

# Database Setup
Pastikan database PostgreSql sudah menyala. 
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

# Run Development Server
```bash
npm run dev
```

