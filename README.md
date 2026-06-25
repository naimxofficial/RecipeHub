# 🍳 RecipeHub

> **Create, share, and discover recipes — all in one place.**

RecipeHub is a full-stack recipe sharing platform where food enthusiasts can publish their own recipes, browse recipes shared by the community, save favorites, purchase premium recipes via Stripe, and unlock unlimited recipe uploads with a premium membership. Built with Next.js, Better Auth, and MongoDB.

🌐 **Live Site:** [https://recipehub-lyart.vercel.app/](https://recipehub-lyart.vercel.app/)

---

## ✨ Features

| Feature | Details |
|--------|---------|
| 🍽️ **Browse Recipes** | Browse all community recipes in a responsive card layout with filtering by category |
| 📖 **Recipe Details** | Full recipe info with like, favorite, report, and purchase actions |
| ❤️ **Like System** | Like any recipe and see the live like count update |
| ⭐ **Favorites** | Save recipes to favorites and manage them from your dashboard |
| 🚩 **Report Recipe** | Report inappropriate recipes (spam, offensive content, copyright issue) via modal |
| 💳 **Stripe Payments** | Purchase individual recipes or upgrade to Premium membership via Stripe Checkout |
| 👑 **Premium Membership** | Unlock unlimited recipe uploads and a premium profile badge |
| 📝 **Add / Manage Recipes** | Add, update, and delete your own recipes (limit of 2 for free users) |
| 🛒 **Purchased Recipes** | View all recipes you've purchased in one place |
| 🛠️ **Admin Dashboard** | Manage users, manage recipes, feature recipes, and review reports |
| 🔐 **Email & Google Auth** | Register & login with Better Auth, including Google OAuth |
| 🌗 **Dark / Light Mode** | Theme toggle with system preference sync via next-themes |
| 🔔 **Toast Notifications** | Real-time feedback on bookings, likes, reports, and auth errors |
| 📄 **Pagination** | Server-side pagination on recipe listing pages |
| 📱 **Fully Responsive** | Clean, professional UI across all screen sizes |
| 🚫 **Custom 404 Page** | Friendly error page with a "Back Home" button |
| 🎞️ **Motion Animations** | Smooth section animations powered by Motion (Framer Motion) |

---

## 📄 Pages & Routes

| Route | Page | Auth |
|-------|------|:----:|
| `/` | Home — Banner, Featured Recipes, Popular Recipes, extra sections | ✗ |
| `/recipes` | Browse all recipes with category filter & pagination | ✗ |
| `/recipes/:id` | Recipe details — like, favorite, report, purchase | ✗ |
| `/login` | Sign in (Credential + Google) | ✗ |
| `/register` | Create account | ✗ |
| `/dashboard` | Dashboard overview — recipes, favorites, likes received | ✓ |
| `/dashboard/my-recipes` | View, update & delete own recipes | ✓ |
| `/dashboard/add-recipe` | Add a new recipe (limited for free users) | ✓ |
| `/dashboard/favorites` | View & remove favorite recipes | ✓ |
| `/dashboard/purchased-recipes` | View purchased recipes | ✓ |
| `/dashboard/profile` | Update name & profile image | ✓ |
| `/dashboard/admin/users` | Manage users — block/unblock (Admin) | ✓ |
| `/dashboard/admin/recipes` | Manage all recipes — edit/delete/feature (Admin) | ✓ |
| `/dashboard/admin/reports` | Review & resolve reports (Admin) | ✓ |
| `*` | Custom 404 | ✗ |

---

## 🛠️ Built With

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![HeroUI](https://img.shields.io/badge/HeroUI-3-000000?style=flat&logo=react&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better--Auth-gray?style=flat)
![Stripe](https://img.shields.io/badge/Stripe-22-635BFF?style=flat&logo=stripe&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-12-0055FF?style=flat&logo=framer&logoColor=white)
![React Icons](https://img.shields.io/badge/React--Icons-E91E63?style=flat&logo=react&logoColor=white)
![React Toastify](https://img.shields.io/badge/React--Toastify-FFCD00?style=flat&logo=react&logoColor=black)
![Lucide React](https://img.shields.io/badge/Lucide--React-F56565?style=flat&logo=lucide&logoColor=white)
![next-themes](https://img.shields.io/badge/next--themes-000000?style=flat&logo=nextdotjs&logoColor=white)

---


## 🔐 Environment Variables

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
MONGODB_URI=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_URL=
NEXT_PUBLIC_IMGBB_API_KEY=
```

---

## 👤 User Roles

- **Normal User** — Add up to 2 recipes, browse, like, favorite, and report recipes
- **Premium User** — Unlimited recipe uploads + premium profile badge (via Stripe)
- **Admin** — Manage users, manage recipes, feature recipes, and review reports

---

## 📜 License

This project is built for educational purposes.