# 🌍 Apni Holidays - Travel Booking Platform

Welcome to **Apni Holidays**, a modern travel booking platform specializing in international holiday packages. This repository contains a full-stack web application built with React, TypeScript, Vite, Drizzle ORM, ShadCN UI, and Tailwind CSS.

---

## ✈️ Features

- ⚡ **Beautiful UI**: Modern, fully responsive design
- 🌏 **International Packages**: Thailand, Dubai, Bali, Singapore, Maldives, Turkey, and more
- 🔍 **Advanced Search**: Quickly find packages by destination, price, or duration
- 📝 **User Authentication**: Secure login & registration (with Firebase Auth)
- 👤 **Profile & Bookings**: Manage your bookings and preferences
- 🛠️ **Admin Panel**: Manage packages, users, and bookings (admin only)
- ☁️ **Image Storage**: Package photos stored in Firebase Storage
- 🧪 **Testing**: E2E tests with Cypress

---

## 🏗️ Project Structure

apni-holidays-new-main/
├── .env
├── .env.example
├── .gitignore
├── README.md
├── components.json
├── cypress.config.cjs
├── drizzle.config.ts
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── client/
├── index.html
└── src/
├── App.tsx
├── index.css
├── main.tsx
└── components/
├── auth-modal.tsx
├── featured-destinations.tsx
├── footer.tsx
├── hero-section.tsx
├── navigation.tsx
├── why-choose-us.tsx
└── ui/
├── button.tsx
├── card.tsx
├── modal.tsx
└── ...

text

---

## ⚙️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, ShadCN UI
- **Backend**: Express.js (TypeScript)
- **Database**: PostgreSQL, Drizzle ORM
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Testing**: Cypress

---

## 🚀 Getting Started

### 1. Clone Repository

git clone https://github.com/rmoharana038/apni-holidays-new.git
cd apni-holidays-new-main

text

### 2. Install Dependencies

npm install

text

### 3. Config Environment Variables

- Copy `.env.example` to `.env` and add your credentials for **Firebase**, **PostgreSQL**, etc.

### 4. Firebase Setup

- Create a [Firebase project](https://console.firebase.google.com/)
- Enable **Email/Password & Google Auth**
- Enable **Firestore/Realtime Database** and **Storage**
- Update `.env` with your Firebase configuration

### 5. Database Setup

npm run db:push

text

### 6. Running the App

npm run dev

text

### 7. Building for Production

npm run build

text

---

## 🧪 Running Tests

npx cypress open

text
_or_
npx cypress run

text

---

## 👨‍💼 Admin Access

- To promote a user as admin, set `isAdmin: true` in Firebase Auth or database manually.
- Visit `/admin` route for admin panel.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature-x`)
3. Commit your changes (`git commit -am 'Add feature x'`)
4. Push to the branch (`git push origin feature-x`)
5. Create a new Pull Request

---

## 📄 License

[MIT License](LICENSE)

---

## 📬 Contact

For queries, support or feedback contact:  
[apniholidays@yourmail.com](mailto:apniholidays@yourmail.com)

---

> Happy Travels from the **Apni Holidays** Team! 🎒
