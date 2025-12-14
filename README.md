# 🍬 SweetHarmony Manager

# 🍬 SweetHarmony Manager

<div align="center">

  ![Last Commit](https://img.shields.io/github/last-commit/Sanganisathwik/sweet-harmony-manager?style=for-the-badge&color=blue)
  ![Top Language](https://img.shields.io/github/languages/top/Sanganisathwik/sweet-harmony-manager?style=for-the-badge&color=blue)
  ![Repo Size](https://img.shields.io/github/repo-size/Sanganisathwik/sweet-harmony-manager?style=for-the-badge&color=blue)

  <br />

  ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
  
  ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
  ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

  ![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
  ![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)
  ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
  ![TanStack Query](https://img.shields.io/badge/-TanStack%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)

  <p align="center">
    <strong>Bridging Artisanal Tradition with Modern E-Commerce Technology</strong>
  </p>

</div>
-----

## 📖 Overview

**SweetHarmony Manager** is a robust, full-stack web application designed to modernize the operations of a premium sweet shop. By bridging the gap between a delightful customer shopping experience and rigorous inventory management, SweetHarmony offers a dual-interface solution:

1.  **For Customers:** A sleek, visually rich e-commerce platform to browse and purchase artisanal sweets.
2.  **For Owners:** A secure, role-protected admin dashboard for real-time inventory control and stock management.

-----

## ⚡ Tech Stack

Built with performance and scalability in mind, leveraging the latest standards in web development.

| Domain | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | **[React 18](https://react.dev/)** | Core UI Library |
| | **[TypeScript](https://www.typescriptlang.org/)** | Type Safety & Developer Experience |
| | **[Vite](https://vitejs.dev/)** | Lightning-fast Build Tool |
| | **[Tailwind CSS](https://tailwindcss.com/)** | Utility-first Styling |
| | **[shadcn/ui](https://ui.shadcn.com/)** | Accessible UI Components |
| | **[TanStack Query](https://tanstack.com/query/latest)** | Server State Management |
| | **[Zod](https://zod.dev/)** | Schema Validation |
| **Backend** | **[Node.js](https://nodejs.org/)** | Runtime Environment |
| | **[Express.js](https://expressjs.com/)** | Server Framework |
| **Data & Auth**| **[Supabase](https://supabase.com/)** | PostgreSQL Database, Auth & Storage |

-----

## 🎨 Key Features

### 🛍️ Customer Experience

> *A seamless journey from discovery to checkout.*

  * **Immersive Landing Page:** A visual showcase of premium sweets and community stories.
  * **Dynamic Sweets Catalog:** Advanced filtering and search capabilities to find the perfect treat.
  * **Smart Cart System:** Persistent cart management for a smooth checkout flow.
  * **User Profiles:** Secure dashboard for order history and personal details.
  * **Secure Authentication:** Powered by Supabase Auth for safe Sign Up/In.

### 🛡️ Admin Command Center

> *Total control over inventory and operations.*

  * **Role-Based Security:** Middleware protection ensures only verified Admins can access these routes.
  * **Live Inventory Management:**
      * ➕ **Create:** Add new SKU entries with image uploads.
      * ✏️ **Update:** Modify pricing, descriptions, and metadata.
      * 🗑️ **Delete:** Remove discontinued items.
      * 🔄 **Restock:** One-click stock quantity adjustments.

-----

## 📸 Application Previews

| Customer Dashboard | Admin Inventory |
|:---:|:---:|
| \<img src="[https://placehold.co/600x400?text=Customer+UI+Preview](https://www.google.com/search?q=https://placehold.co/600x400%3Ftext%3DCustomer%2BUI%2BPreview)" alt="Customer UI" width="400"/\> | \<img src="[https://placehold.co/600x400?text=Admin+Dashboard+Preview](https://www.google.com/search?q=https://placehold.co/600x400%3Ftext%3DAdmin%2BDashboard%2BPreview)" alt="Admin UI" width="400"/\> |

-----

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed:

  * **Node.js** (v18 or higher)
  * **npm** or **bun**
  * **Git**

### 1\. Clone the Repository

```bash
git clone https://github.com/Sanganisathwik/sweet-harmony-manager.git
cd sweet-harmony-manager
```

### 2\. Frontend Configuration

Navigate to the client directory and install dependencies:

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the client:

```bash
npm run dev
```

> The application will launch at `http://localhost:8080`

### 3\. Backend Configuration

Open a new terminal, navigate to the server directory:

```bash
cd ../Backend
npm install
```

Create a `.env` file in the `Backend` root:

```env
PORT=5000
NEXT_PUBLIC_SUPABASE_URL=https://pcktxsjzuuvgtrmebmhb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_C1o9nwIazDyEKYdd7ArO0A_lm4qJmkh

```

Run the server:

```bash
npm start
```

> The API will listen on `http://localhost:5000`

-----

## 🔐 Admin Access Credentials

To explore the **Admin Dashboard** features immediately, use the pre-configured credentials below.

> **Note:** To access admin features, you **must** check the **"Login as Admin"** box on the Sign-In page.

| Role | Username | Email | Password |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `Sat***` | `sat*****` | `Sat*********` |

-----

## 📂 Project Structure

A clean separation of concerns for maintainability.

```text
SweetHarmony/
├── Frontend/               # React Client Application
│   ├── src/
│   │   ├── components/     # Reusable shadcn/ui components
│   │   ├── pages/          # Route views (Auth, Admin, Storefront)
│   │   ├── hooks/          # Custom business logic hooks
│   │   ├── contexts/       # Global state (AuthContext)
│   │   └── lib/            # Zod schemas and Supabase clients
│   └── public/             # Static assets
│
├── Backend/                # Node.js Server
│   ├── src/                # API Routes and Controllers
│   └── scripts/            # Database seeding and utility scripts
│
└── README.md               # Documentation
```

----

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

-----

\<div align="center"\>

**Made with ❤️ by [Sathwik](https://www.google.com/search?q=https://github.com/Sanganisathwik)**

\</div\>
