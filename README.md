# JWT Authentication App

A full-stack application that demonstrates JWT-based authentication using a React frontend and Express.js backend.

> [!IMPORTANT]
> **Requires Node.js 22 or earlier.** `jsonwebtoken` depends transitively on
> `buffer-equal-constant-time`, which uses `SlowBuffer` — removed in Node 24.
> On newer Node the backend crashes at startup with
> `TypeError: Cannot read properties of undefined (reading 'prototype')`.

## Setup

1. **Backend**: from the `backend` directory run `npm install`, then copy
   `.env.example` to `.env` and fill it in:

   ```bash
   cp .env.example .env
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"  # JWT_SECRET
   ```

   The server refuses to start if `JWT_SECRET` or `MONGODB_URI` are missing —
   this is intentional, so a missing secret fails loudly instead of silently
   producing tokens anyone could forge.

2. **Frontend**: from the `frontend` directory run `npm install`.

## Running the App

- **Backend**: in the `backend` directory, run `node server.js`.
- **Frontend**: in the `frontend` directory, run `npm start`.

## API

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Create an account. Password must be at least 8 characters. |
| `POST` | `/api/auth/login` | — | Returns `{ token }`. The token expires after `JWT_EXPIRES_IN` (default `1h`). |
| `GET` | `/api/auth/me` | Bearer | Returns the current user. Example of a route verified server-side. |

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/auth/me
```

## Features

- User registration with password length validation
- User login with bcrypt password hashing
- JWT tokens with expiry, signed with a secret read from the environment
- `requireAuth` middleware that verifies the token server-side
- CORS restricted to the origins listed in `CORS_ORIGIN`
- Request bodies type-checked before reaching MongoDB (prevents NoSQL operator injection)

## Known limitations

This is a teaching example, not production-ready. Before real use you would also want:

- **Token storage**: the frontend keeps the token in `localStorage`, which any
  XSS can read. Production apps should prefer an `HttpOnly` cookie.
- **Rate limiting**: `/login` has none, so it is open to brute force. Add
  something like `express-rate-limit`.
- **Refresh tokens / revocation**: there is no way to invalidate an issued token
  before it expires. The unused `tokens[]` array on the user model was a start
  in that direction.
- **Account lockout, email verification, password reset** — none implemented.

## Contribute

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

---

ReactAuthenticationJWT is free and open source. If you find it useful, please [⭐️ star the repo](https://github.com/simonsruggi/ReactAuthenticationJWT) — and if you'd like to support my open-source work, you can [💛 sponsor me on GitHub](https://github.com/sponsors/simonsruggi) or [☕️ buy me a coffee](https://buymeacoffee.com/simonsruggi). Completely optional, always appreciated. 🙏
