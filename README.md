
# 🌴 Apni Holidays

**Apni Holidays** is a full-stack, modern travel booking web application built with a clean, scalable architecture. It offers dynamic holiday package listings, user authentication, admin panel, responsive UI, and much more.

**Live Site**: [apni-holidays-new.onrender.com](https://apni-holidays-new.onrender.com)  
**Repository**: [github.com/rmoharana038/apni-holidays-new](https://github.com/rmoharana038/apni-holidays-new)

---

## 🚀 Features

### 🧑‍💻 User Features
- 🧾 Browse dynamic holiday packages
- 🔍 Filter/search destinations
- 🧳 View detailed package info
- 🔐 User authentication via Firebase
- 🎫 Book and manage trips (WIP)
- 🖥️ Mobile-first responsive design

### 🛠️ Admin Features
- 🔐 Admin authentication with RBAC
- ➕ Add/update/delete travel packages
- 📊 Manage bookings (WIP)
- 📁 Upload images using Firebase Storage

### 🌐 Technical Features
- ⚡ Vite for blazing-fast development
- 🎨 Tailwind CSS with ShadCN UI components
- 🔄 Real-time updates via Firebase Firestore
- 🧠 Drizzle ORM for structured schema handling
- 🧪 Cypress for E2E testing

---

## 🗂 Project Structure

```
apni-holidays-new/
├── client/                   # Frontend (React + Vite)
│   ├── index.html
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── index.css
│       ├── components/       # Reusable and UI components (ShadCN)
│       ├── hooks/            # Custom React hooks
│       ├── lib/              # Firebase and utility logic
│       └── pages/            # Page-level components
├── server/                   # Server-side logic
│   ├── db.ts                 # Drizzle DB config
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API endpoints
│   ├── storage.ts            # File/image storage setup
│   └── vite.ts               # Server config for Vite
├── shared/
│   └── schema.ts             # Shared DB schema
├── drizzle.config.ts         # Drizzle ORM setup
├── tailwind.config.ts        # Tailwind customization
├── vite.config.ts            # Vite bundler setup
├── tsconfig.json             # TypeScript config
├── .env.example              # Env variables template
└── package.json              # Dependencies and scripts
```

---

## ⚙️ Requirements

- Node.js (v18+ recommended)
- Firebase Project (Auth + Firestore + Storage)
- SQLite/PostgreSQL for Drizzle (based on usage)
- Render or Vercel (for deployment)
- Cypress (for testing)

---

## 🔧 Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/rmoharana038/apni-holidays-new.git
cd apni-holidays-new
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
# Fill in Firebase credentials, Drizzle config, etc.
```

4. **Run development server**

```bash
npm run dev
```

5. **Run backend (if separate)**

```bash
# Inside /server
ts-node index.ts
```

---

## ✅ Implementation Flow

1. **Frontend with Vite & React**
   - Organized with components, pages, and hooks
   - UI via Tailwind CSS + ShadCN
   - State managed via custom hooks or context

2. **Backend & API**
   - Node.js server using TypeScript
   - Firestore + Drizzle ORM for hybrid data storage
   - Routes defined in `routes.ts`
   - Firebase handles authentication and file storage

3. **Database Schema**
   - Defined via `shared/schema.ts`
   - Managed using Drizzle ORM and CLI

4. **Authentication**
   - Firebase email/password login
   - Role-based guards on admin routes

---

## 🧪 Testing

```bash
# Run Cypress tests
npx cypress open
```

Tests cover:
- User login
- Admin dashboard access
- Package creation/deletion
- UI responsiveness

---

## 📦 Tech Stack

| Layer        | Tools/Libraries                      |
|--------------|---------------------------------------|
| Frontend     | React, TypeScript, Vite, Tailwind, ShadCN |
| Backend      | Node.js, Express, Firebase, Drizzle ORM |
| Auth         | Firebase Authentication              |
| DB           | Firestore (NoSQL) + Drizzle (Relational) |
| UI Components| Tailwind CSS, ShadCN                  |
| Testing      | Cypress                               |
| Deployment   | Render (SSR ready)                    |

---

## 🛡️ Security

- Environment variables via `.env`
- Role-based access (admin vs user)
- Firebase security rules applied (recommended to audit)

---

## 📜 License

MIT License © [rmoharana038](https://github.com/rmoharana038)

---

## 💬 Contact

For feedback or contributions, please open an issue or contact [@rmoharana038](https://github.com/rmoharana038).
