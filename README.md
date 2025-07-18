# Apni Holidays - Travel Booking Platform

A modern travel booking platform specializing in international destinations from India including Thailand, Dubai, Bali, Singapore, Maldives, Turkey, and more.

## Features

- **Modern Responsive Design**: Works perfectly on mobile and desktop
- **Firebase Authentication**: Email/password and Google sign-in
- **International Travel Packages**: Detailed packages with itineraries, inclusions, and exclusions
- **Admin Panel**: Manage packages, users, and bookings
- **Search & Filter**: Find packages by destination, price, duration
- **User Profiles**: Manage personal information and bookings
- **Database Storage**: PostgreSQL with type-safe Drizzle ORM

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage (for images)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **State Management**: TanStack Query

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Enable Storage
   - Get your Firebase config values

3. **Database Setup**
   - Set up PostgreSQL database
   - Add DATABASE_URL to your environment variables
   - Run database migrations:
   ```bash
   npm run db:push
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=your_postgresql_connection_string
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_APP_ID=your_app_id_here
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   ```

5. **Run the Application**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Open your browser to `http://localhost:5000`
   - The application will be running with both frontend and backend

## Project Structure

```
apni-holidays/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities and Firebase config
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database storage layer
│   └── db.ts             # Database configuration
├── shared/                 # Shared types and schemas
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema (if using PostgreSQL)

## Admin Access

To access the admin panel:
1. Create an account or sign in
2. You'll need to manually set `isAdmin: true` in the Firebase user document
3. Access `/admin` to manage packages

## Sample Data

The application comes with sample international travel packages including:
- Thailand Paradise (Bangkok & Phuket)
- Dubai Luxury Experience
- Bali Island Paradise
- Singapore Highlights
- Maldives Honeymoon Special
- Turkey Cultural Journey

## Firebase Setup Instructions

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (add your domain to authorized domains)

3. **Set up Firestore**
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode"

4. **Configure Storage**
   - Go to Storage
   - Click "Get started"
   - Use default security rules for development

5. **Get Configuration**
   - Go to Project Settings
   - Scroll to "Your apps"
   - Copy the Firebase config values

## Deployment

For production deployment:
1. Set environment variables on your hosting platform
2. Run `npm run build`
3. Deploy the built files
4. Update Firebase authorized domains

## Support

For support or questions about this travel booking platform, please contact the development team.

---

Built with ❤️ for Apni Holidays, Raipur, India