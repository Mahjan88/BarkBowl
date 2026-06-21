# 🐾 PawBowl

> Fresh, customizable dog meals. Build the perfect bowl for your best friend.

A full-stack MVP with React + Vite (frontend), Node.js + Express (backend), and Supabase (auth + database).

---

## Project Structure

```
PawBowl/
├── frontend/          # React + Vite app
├── backend/           # Node.js + Express API
└── supabase/          # SQL schema & seed data
    ├── schema.sql
    └── seed.sql
```

---

## 1 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the Supabase dashboard, open **SQL Editor**.
3. Run `supabase/schema.sql` — creates all tables and RLS policies.
4. Run `supabase/seed.sql` — populates meals and ingredients.
5. From **Project Settings → API**, copy:
   - **Project URL** → `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role secret key** → `SUPABASE_SERVICE_ROLE_KEY` (backend only — keep secret)

---

## 2 — Configure Environment Variables

**Frontend** — create `frontend/.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Backend** — create `backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=3001
```

---

## 3 — Install & Run

Open two terminals:

**Terminal 1 — Backend**
```bash
cd backend
npm install
npm run dev
# API running at http://localhost:3001
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Features (MVP)

| Feature | Status |
|---|---|
| Email auth (sign up / sign in) | ✅ |
| Dog profile (name, breed, age, weight, allergies, health goals) | ✅ |
| Ready-made meals with filters | ✅ |
| Build Your Own Bowl wizard (4-step: protein → base → veg → booster) | ✅ |
| Portion size selection | ✅ |
| Live nutrition score | ✅ |
| Cart with quantity controls | ✅ |
| Checkout with subscription options (weekly/biweekly/monthly) | ✅ |
| Subscription discounts (5–10%) | ✅ |
| Order history with tracking status | ✅ |
| Save custom bowl as favorite | ✅ |
| Bottom navigation | ✅ |

---

## API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/meals` | — | List all active meals |
| GET | `/api/meals/:id` | — | Single meal |
| GET | `/api/ingredients` | — | All ingredients grouped by category |
| GET | `/api/pets` | ✅ | User's pets |
| POST | `/api/pets` | ✅ | Create pet |
| PUT | `/api/pets/:id` | ✅ | Update pet |
| DELETE | `/api/pets/:id` | ✅ | Delete pet |
| GET | `/api/orders` | ✅ | Order history |
| POST | `/api/orders` | ✅ | Place order |
| PATCH | `/api/orders/:id/cancel` | ✅ | Cancel order |
| GET | `/api/bowls` | ✅ | Saved custom bowls |
| POST | `/api/bowls` | ✅ | Save custom bowl |
| PATCH | `/api/bowls/:id/favorite` | ✅ | Toggle favorite |
| DELETE | `/api/bowls/:id` | ✅ | Delete bowl |

---

## Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide icons
- **Backend**: Node.js, Express, Supabase JS client
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Auth**: Supabase Auth (email/password)

---

## Next Steps (Post-MVP)

- AI meal recommendations based on dog profile
- Real payment integration (Stripe)
- Push notifications for delivery updates
- Multi-dog household support
- Loyalty points system
- Vet/nutritionist consultation booking
- Admin dashboard for managing menu
# PawBowl
