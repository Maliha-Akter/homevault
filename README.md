# 🏠 HomeVault

HomeVault is a modern full-stack Home Inventory Management System that helps users organize, track, and manage household belongings in one secure place. From electronics and furniture to documents and vehicles, HomeVault makes it easy to store item information, purchase records, warranty details, and images.

---

## 🌐 Live Demo

**Live Website:** https://homevault-five.vercel.app/

**Client Repository:** https://github.com/Maliha-Akter/homevault

**Server Repository:** https://github.com/Maliha-Akter/homevault-backend

---

# 📖 Project Overview

Managing household belongings can be difficult, especially when keeping track of purchase dates, warranties, estimated values, and item locations.

HomeVault provides a centralized platform where users can:

- Organize household items
- Create custom categories
- Store item information securely
- Track warranties
- Upload item images
- View inventory statistics
- Search and filter items easily

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Role-based Authorization (Admin & User)

---

## 📂 Category Management

- View default categories
- Create custom categories
- Category details page
- Category approval system
- Category information including:
  - Item Types
  - Popular Brands
  - Organization Tips

---

## 📦 Inventory Management

- Add Inventory
- View Inventory
- Delete Inventory
- Upload Item Images
- Purchase Information
- Warranty Tracking
- Estimated Value
- Room Location
- Item Condition
- Personal Notes

---

## 🔍 Smart Search & Filtering

- Search Inventory
- Filter by Category
- Filter by Condition
- Sort Items
- Pagination

---

## 📊 Dashboard Analytics

- Total Categories
- Total Inventory
- Active Users
- Default Categories
- Community Categories
- Total Inventory Value

---

## 👨‍💼 Admin Features

- Dashboard Overview
- Manage Users
- Manage Categories
- Approve Custom Categories
- Delete Categories
- View Platform Statistics

---

## 👤 User Features

- Personal Dashboard
- Manage Personal Inventory
- Create Custom Categories
- View Category Details
- Profile Management

---

# 🖥️ Pages

## Public Pages

- Home
- Categories
- Category Details
- About
- Contact
- Help & Support
- Login
- Register

---

## Protected Pages

- Dashboard
- Add Inventory
- Manage Inventory
- Add Category
- Manage Categories

---

## Admin Pages

- Dashboard Overview
- Manage Users
- Manage Categories
- Platform Statistics

---

# 🛠️ Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- HeroUI
- Lucide React
- React Hook Form
- React Toastify
- Chart.js / Recharts

---

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- JWT Authentication

---

## Database

MongoDB Collections

- users
- categories
- inventory

---

# 📁 Project Structure

```
client
│
├── app
├── components
├── hooks
├── services
├── types
├── lib
└── utils

server
│
├── routes
├── controllers
├── middleware
├── models
├── utils
└── config
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/homevault-client.git

git clone https://github.com/yourusername/homevault-server.git
```

---

## Install Dependencies

Client

```bash
npm install
```

Server

```bash
npm install
```

---

## Environment Variables

### Client

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Server

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_secret
```

---

## Run Client

```bash
npm run dev
```

---

## Run Server

```bash
npm run dev
```

---

# 📊 Database Collections

## Users

```text
_id
name
email
image
role
createdAt
updatedAt
```

---

## Categories

```text
_id
name
slug
icon
image
shortDescription
fullDescription
itemTypes
popularBrands
organizationTips
createdBy
isDefault
isApproved
createdAt
updatedAt
```

---

## Inventory

```text
_id
userId
categoryId
title
brand
room
purchaseDate
purchasePrice
estimatedValue
warrantyExpiry
condition
image
notes
createdAt
updatedAt
```

---

# 🔒 Authentication

- JWT Authentication
- Protected Routes
- Secure APIs
- Role-based Authorization
- Unauthorized Route Protection

---

# 🎨 UI/UX Features

- Responsive Design
- Sticky Navbar
- Skeleton Loading
- Toast Notifications
- Consistent Card Design
- Interactive Dashboard
- Modern Animations
- Professional Color Palette

---

# 📈 Future Improvements

- Barcode Scanner
- Receipt Upload (PDF)
- Warranty Expiry Email Reminder
- Inventory Export (PDF/Excel)
- QR Code Labels
- Dark Mode
- Multi-language Support

---

# 👤 Demo Credentials

## User

Email:

```
demo@homevault.com
```

Password

```
Password123!
```

---

## Admin

Email

```
maliha1m@admin.com
```

Password

```
Maliha1m@admin.com
```

---

# 👩‍💻 Author

**Maliha Akter Miti**


---

