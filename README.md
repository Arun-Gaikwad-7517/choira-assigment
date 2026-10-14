# Project & Task Management REST API

A backend REST API built with Node.js, Express, MySQL, and MongoDB/Mongoose.

## Features
- User registration and login with bcrypt password hashing and JWT authentication
- Get and update the authenticated user's profile
- Project CRUD with ownership checks
- Task CRUD using MongoDB/Mongoose
- Task filtering by project, status, and priority
- Pagination for task listing
- Dashboard statistics
- Input validation and centralized error handling
- Project deletion rule: deletion is blocked with HTTP 409 if any task is `todo` or `in_progress`; deletion is allowed if all tasks are completed or no tasks exist

## Tech stack
Node.js, Express.js, MySQL, MongoDB, Mongoose, JWT, bcrypt, express-validator, dotenv, cors.

## Requirements
- Node.js and npm
- MySQL Server
- MongoDB Server
- Postman (recommended)

## Setup
1. Clone your GitHub repository:
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd project-task-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a local `.env` file based on `.env.example`. Add your own local database credentials and a strong JWT secret. Never commit `.env`.
4. Run `database/mysql.sql` in MySQL Workbench or the MySQL CLI to create the database and tables.
5. Start MongoDB and make sure `MONGODB_URI` in `.env` points to your MongoDB instance.
6. Start the API:
   ```bash
   npm run dev
   ```
   If your `package.json` defines a different script, use the script listed there. The API uses port `5000` by default.

Health check: `GET http://localhost:5000/health`

## Authentication
Register or log in to receive a JWT. For protected routes, send:
```http
Authorization: Bearer <JWT_TOKEN>
```
In Postman, use **Authorization → Bearer Token**.

## API endpoints
Base URL: `http://localhost:5000`

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login and get JWT |
| GET | `/api/auth/me` | Yes | Get current profile |
| PUT | `/api/auth/profile` | Yes | Update current profile |

Register body:
```json
{"name":"Example User","email":"user@example.com","password":"ExamplePass123"}
```

Login body:
```json
{"email":"user@example.com","password":"ExamplePass123"}
```

### Projects
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/projects` | Yes | Create project |
| GET | `/api/projects` | Yes | List current user's projects |
| GET | `/api/projects/:id` | Yes | Get project by MySQL ID |
| PUT | `/api/projects/:id` | Yes | Update project |
| DELETE | `/api/projects/:id` | Yes | Delete project when its tasks permit it |

Example project body:
```json
{"name":"Portfolio Website","description":"Personal portfolio project","status":"active"}
```
Allowed project statuses: `active`, `completed`, `archived`.

### Tasks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/tasks` | Yes | Create task |
| GET | `/api/tasks` | Yes | List tasks with optional filters and pagination |
| GET | `/api/tasks/:id` | Yes | Get task by MongoDB ObjectId |
| PUT | `/api/tasks/:id` | Yes | Update task |
| DELETE | `/api/tasks/:id` | Yes | Delete task |

Example task body:
```json
{"title":"Build homepage","description":"Create the first page","projectId":1,"status":"todo","priority":"medium"}
```
Allowed task statuses: `todo`, `in_progress`, `completed`. Allowed priorities: `low`, `medium`, `high`.

Optional list query parameters: `page`, `limit`, `projectId`, `status`, `priority`.

Example:
```http
GET /api/tasks?page=1&limit=10&status=todo&priority=high
```

Project IDs are MySQL integer IDs. Task IDs are MongoDB ObjectIds.

### Dashboard and health
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard` | Yes | Current user's project and task statistics |
| GET | `/health` | No | Health check |

## Project deletion business rule
Before deleting a project, the API checks its associated tasks in MongoDB:
- If any task is `todo` or `in_progress`, return HTTP `409 Conflict`.
- If all associated tasks are `completed`, deletion is allowed.
- If no associated tasks exist, deletion is allowed.

## Postman
Import `Choira-Project-Task-API.postman_collection.json` into Postman.
1. Run Login and use the returned JWT for protected endpoints.
2. Create a project and use its MySQL ID when creating tasks.
3. Test task filtering and pagination.
4. Test deletion with incomplete tasks (expect 409), all completed tasks (success), and no tasks (success).

## Demo data
If using the seed script, run it only against your intended development database. Demo credentials are for local testing only and should not be used in production.

## Security
- Do not commit `.env`, database passwords, JWT secrets, or access tokens.
- Keep `.env.example` limited to placeholder values.
- Use a strong JWT secret and separate production credentials.
