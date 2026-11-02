# Task API (SYD204)

Express + MySQL (Aiven) REST API with a simple frontend.

## Steps (simple)

1. **Install Node.js 18+** — check with `node --version`.
2. **Open this folder in VS Code**, then in the terminal:
   ```
   npm install
   ```
3. **Create your Aiven user** (Aiven → service `mysql-20713dd0` → Users → Create service user,
   password type `caching_sha2_password`). Copy the password.
4. **Edit `.env`** — only change these two lines:
   ```
   DB_USER=your_username
   DB_PASS=your_password
   ```
5. **Create the table** — open MySQL Workbench (host `mysql-20713dd0-rub-a06b.b.aivencloud.com`,
   port `15308`, SSL required), run everything in `database/schema.sql`.
6. **Test the connection:**
   ```
   node test-db.js
   ```
   Expect `Connected to MySQL`. Then delete `test-db.js`.
7. **Start the server:**
   ```
   npm start
   ```
8. **Open http://localhost:3000** — the frontend. Add, tick, edit and delete tasks.
9. **Test the API** in Thunder Client / Postman (`GET http://localhost:3000/tasks`, etc.).

## Folder map (restaurant analogy)

| Folder / file | Role |
|---|---|
| `frontend/` | Dining room (HTML, CSS, JS) |
| `server-mvc.js` | Kitchen entry point |
| `src/routes/` | Menu |
| `src/controllers/` | Chef |
| `src/models/` | Pantry (SQL) |
| `src/db.js` | Connection pool |
| `.env` | Secret recipe book (never commit) |
| `server.js` | Part 2 single-file version (reference) |
| `part1-memory-server.js` | Part 1 in-memory version (reference) |

## Endpoints

| Method | URL | Body | Status |
|---|---|---|---|
| GET | /tasks | | 200 |
| GET | /tasks/:id | | 200 / 404 |
| POST | /tasks | `{"title":"..."}` | 201 / 400 |
| PUT | /tasks/:id | `{"title":"...","completed":true}` | 200 / 400 / 404 |
| PATCH | /tasks/:id | `{"completed":true}` | 200 / 400 / 404 |
| DELETE | /tasks/:id | | 204 / 404 |

## Push to GitHub

```
git init
git add .
git commit -m "Task API with MVC and frontend"
git branch -M main
git remote add origin https://github.com/Puru54/TaskAPIs.git
git push -u origin main
```
`.env` is in `.gitignore`, so your password is not uploaded.
