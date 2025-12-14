# SweetHarmony Manager 🍬

SweetHarmony is a full-stack web application for managing a premium sweet shop. It features a modern e-commerce interface for customers to browse and purchase sweets, and a dedicated admin dashboard for inventory management.

## 🚀 Tech Stack

### Frontend
- **Framework:** [React](https://react.dev/) (v18)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** [TanStack Query](https://tanstack.com/query/latest)
- **Routing:** [React Router](https://reactrouter.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database Integration:** [Supabase Client](https://supabase.com/docs/reference/javascript/introduction)
- **Security:** Helmet, CORS

### Database & Auth
- **Platform:** [Supabase](https://supabase.com/)
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth (Email/Password)
- **Storage:** Supabase Storage (for sweet images)

---

## ✨ Key Features

### 🛍️ Customer Features
- **Landing Page:** Beautiful showcase of premium sweets and community initiatives.
- **Sweets Dashboard:** Browse available sweets with filtering options.
- **Cart System:** Add items to cart and manage purchases.
- **User Profile:** Manage personal details and view order history.
- **Authentication:** Secure Sign Up and Sign In.

### 🛡️ Admin Features
- **Admin Dashboard:** Exclusive access for administrators.
- **Inventory Management:**
  - **Create:** Add new sweets with details and images.
  - **Update:** Edit sweet details and prices.
  - **Delete:** Remove items from the catalog.
  - **Restock:** Update stock quantities instantly.
- **Role-Based Access:** Secure route protection ensuring only admins can access management tools.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or bun
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Sanganisathwik/sweet-harmony-manager.git
cd sweet-harmony-manager
```

### 2. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the development server:
```bash
npm run dev
```
The application will open at `http://localhost:8080`.

### 3. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd ../Backend
npm install
```

Create a `.env` file in the `Backend` directory:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
```

Start the backend server:
```bash
npm start
```
The server will run on `http://localhost:5000`.

---

## 🔐 Admin Access

To access the Admin Dashboard, you can use the pre-configured admin account or create one using the provided scripts.

**Default Admin Credentials:**
- **Username:** `Satzz` (or email `satzz@admin.com`)
- **Password:** `Sathwik@2612`

**Login Steps:**
1. Go to the **Sign In** page.
2. Enter the credentials above.
3. Check the box **"Login as Admin"**.
4. Click **Sign In**.

---

## 📂 Project Structure

```
SweetHarmony/
├── Frontend/           # React Client Application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route pages (Auth, Admin, Index, etc.)
│   │   ├── hooks/      # Custom React hooks
│   │   ├── contexts/   # Context providers (Auth)
│   │   └── lib/        # Utilities and API clients
│   └── public/         # Static assets
│
├── Backend/            # Node.js Server
│   ├── src/            # Source code
│   └── scripts/        # Database setup and utility scripts
│
└── README.md           # Project Documentation
```

## 🤝 Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

**Made with ❤️ by Sathwik**
