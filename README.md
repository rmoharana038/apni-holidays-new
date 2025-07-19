# Apni Holidays 🏖️

A modern travel booking website built using React (Vite), Tailwind CSS, Firebase, and Drizzle ORM.

---

## 📁 Project Structure

```
apni-holidays-new-main/
├── .env.example            # Sample environment variables
├── client/
│   ├── index.html          # Main HTML file
│   └── src/
│       ├── App.tsx         # Root React component
│       ├── main.tsx        # Entry point
│       ├── index.css       # Tailwind styles
│       └── components/     # Custom + UI components
│           └── ui/         # ShadCN UI components
├── drizzle.config.ts       # Drizzle ORM configuration
├── tailwind.config.ts      # Tailwind config
├── vite.config.ts          # Vite bundler config
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

---

## 🚀 Features

- 🔐 Firebase Auth with role-based access control
- ☁️ Firestore integration for dynamic data (packages, users, etc.)
- ✨ Modern UI using Tailwind + ShadCN
- 🧠 Clean project structure using reusable components
- 🧪 Cypress testing setup
- 🛠️ Drizzle ORM for clean backend DB schema

---

## 🛠️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/rmoharana038/apni-holidays-new.git
cd apni-holidays-new/client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

Create a `.env` file in the root (based on `.env.example`) and fill in Firebase project credentials.

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
...
```

### 4. Run the development server

```bash
npm run dev
```

---

## 🧪 Running Tests

```bash
npx cypress open
```

---

## 🧱 Built With

- [React + Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Auth + Firestore](https://firebase.google.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [ShadCN UI](https://ui.shadcn.dev/)
- [Cypress](https://www.cypress.io/)

---

## 📄 License

MIT © [rmoharana038](https://github.com/rmoharana038)
