# 📚 Bookmarked — Personal Book Manager

I've always had a complicated relationship with my reading list. Books saved in notes apps, wishlists scattered across browsers, half-remembered titles I told myself I'd get to "someday." So I built Bookmarked — a quiet little corner of the internet that's just for you and your books.

No social features. No ratings for the algorithm. Just your collection, organised the way you actually think about reading.

---

## What it does

At its core, Bookmarked lets you keep track of what you're reading, what you want to read, and what you've finished. But the details matter:

- You can **tag books** however makes sense to you — by genre, by mood, by "books my friend won't stop recommending"
- Each book has a **coloured spine** you pick yourself, so your shelf actually looks like yours
- You can leave **personal notes** — a quote that hit you, a reminder of why you added it, a half-formed thought
- **Click a book's status** to cycle it through Want to Read → Reading → Completed. No menus, no extra steps
- The dashboard shows you the shape of your reading life at a glance — not as a productivity metric, just as a gentle reflection

---

## Tech Stack

Built with the MERN stack and Next.js because I wanted something fast, clean, and easy to deploy anywhere.

| Layer | What I used |
|-------|-------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS + hand-crafted CSS variables |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT — stored in cookies, protected on both ends |
| Fonts | Playfair Display + Lora — because books deserve good typography |

---

## Project Structure

Nothing clever here, just a clean separation that makes it easy to find things:

```
book-manager/
├── backend/
│   ├── models/
│   │   ├── User.js          # bcrypt-hashed passwords, nothing fancy
│   │   └── Book.js          # the main event — title, author, tags, status, notes
│   ├── routes/
│   │   ├── auth.js          # signup, login, /me
│   │   └── books.js         # full CRUD, search, tag filtering
│   ├── middleware/
│   │   └── auth.js          # JWT check on every protected route
│   ├── server.js
│   └── .env.example
│
├── frontend/
│   ├── app/
│   │   ├── layout.js        # fonts, AuthProvider, the usual
│   │   ├── login/page.js
│   │   ├── signup/page.js
│   │   └── dashboard/page.js  # where you'll spend most of your time
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── BookCard.js      # the coloured spine lives here
│   │   └── BookModal.js     # add/edit, with the colour picker
│   └── lib/
│       ├── api.js           # axios + auto token attachment
│       └── auth.js          # context + useAuth hook
│
└── README.md                # you are here
```

---

## Running it locally

You'll need Node 18+ and a MongoDB connection (Atlas free tier works perfectly).

**1. Clone it**
```bash
git clone https://github.com/yourusername/Bookmarked.git
cd Bookmarked
```

**2. Start the backend**
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MongoDB URI and a JWT secret (any long random string)
npm run dev
```

**3. Start the frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

**4. Open [http://localhost:3000](http://localhost:3000) and add your first book**

> **Heads up:** if your frontend runs on port 3001 instead of 3000, update `CLIENT_URL` in your backend `.env` to match. That's the most common first-run hiccup.

---

## Environment Variables

### `backend/.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/book-manager
JWT_SECRET=something_long_and_random_that_only_you_know
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Deploying

The stack I'd recommend: **Vercel** for the frontend, **Railway or Render** for the backend, **MongoDB Atlas** for the database. All have generous free tiers.

**Backend (Railway / Render)**
- Point it at your `/backend` folder
- Add your env variables in the dashboard
- Start command: `node server.js`

**Frontend (Vercel)**
- Import the repo, set root directory to `frontend`
- Add `NEXT_PUBLIC_API_URL` pointing to your deployed backend URL
- Hit deploy — Vercel handles the rest

**MongoDB Atlas**
- Free M0 cluster is more than enough to start
- Don't forget to whitelist `0.0.0.0/0` in Network Access so your backend can reach it

---

## API Reference

### Auth
| Method | Endpoint | Body | What it does |
|--------|----------|------|--------------|
| POST | `/api/auth/signup` | `{name, email, password}` | Create an account |
| POST | `/api/auth/login` | `{email, password}` | Get a JWT back |
| GET | `/api/auth/me` | — | Who am I? (auth required) |

### Books
All book routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/books` | Supports `?status=`, `?tag=`, `?search=` |
| POST | `/api/books` | Create a new book |
| GET | `/api/books/:id` | Single book |
| PUT | `/api/books/:id` | Update anything |
| DELETE | `/api/books/:id` | Gone |
| GET | `/api/books/tags/all` | All your unique tags |

---

## A note on the design

I wanted Folio to feel like a physical reading journal — something you'd actually enjoy opening. That meant warm parchment tones, paper grain texture, and serif fonts that take reading seriously. The coloured spines on each card are a small touch that makes the collection feel genuinely personal. The whole thing is meant to be calm and distraction-free — the opposite of a productivity dashboard.

---

## License

MIT. Take it, remix it, make it yours.