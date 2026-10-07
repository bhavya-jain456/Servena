# Node.js Backend Boilerplate

> **For AI Assistants & Developers**: This document explains how to work with this codebase, its architecture, conventions, and security patterns. Read this FIRST before making any changes.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Directory Structure](#directory-structure)
- [How Things Work](#how-things-work)
  - [Request Lifecycle](#request-lifecycle)
  - [Route Definition Pattern](#route-definition-pattern)
  - [Authentication & Authorization](#authentication--authorization)
  - [Validation (Joi)](#validation-joi)
  - [Response Format](#response-format)
  - [Database Models (Mongoose)](#database-models-mongoose)
  - [Environment Configuration](#environment-configuration)
  - [Swagger Documentation](#swagger-documentation)
- [How to Add a New Feature](#how-to-add-a-new-feature)
- [Security Architecture](#security-architecture)
- [Senior Developer Recommendations](#senior-developer-recommendations)

---

## Quick Start

```bash
# 1. Clone and install
cp .env.example .env    # Edit with your values
npm install

# 2. Run
npm run dev             # Development with nodemon
npm start               # Production
```

Health check: `GET http://localhost:3000/v1/health`
Swagger docs: `http://localhost:3000/documentation` (basic auth protected)

---

## Architecture Overview

```
Client Request
    │
    ▼
[Express App]
    │
    ├── Helmet (security headers)
    ├── CORS (origin validation)
    ├── Body Parser (JSON/URL-encoded)
    ├── Request Logger (timing, errors)
    │
    ▼
[Route Utils — routeUtils.js]
    │
    ├── 1. Multer middleware (if file upload)
    ├── 2. Joi validation middleware (body/params/query/headers)
    ├── 3. API Key validation middleware (X-API-KEY header)
    ├── 4. User authentication middleware (JWT in Authorization header)
    │
    ▼
[Controller]  →  [Service]  →  [Model (Mongoose)]
    │
    ▼
[Response Helper]  →  Standardized JSON response
```

**Key principle**: Routes define WHAT, Controllers orchestrate HOW, Services interact with WHY (data layer), Models define WHAT shape.

---

## Directory Structure

```
├── server.js                    # Entry point — boots DB, Redis, Express, Cron
├── config/
│   ├── index.js                 # Central config (merges env + defaults)
│   ├── swagger.js               # Swagger meta definition
│   └── env/
│       ├── development.js       # Dev overrides
│       ├── production.js        # Prod overrides
│       └── staging.js           # Staging overrides
├── app/
│   ├── controllers/             # Business logic handlers
│   │   └── index.js             # Barrel file — register every controller here
│   ├── helpers/
│   │   └── common/
│   │       └── resHelper.js     # createSuccessResponse() / createErrorResponse()
│   ├── hooks/                   # Mongoose post-save/update hooks (keep side effects here)
│   ├── models/                  # Mongoose schemas
│   │   └── index.js             # Barrel file — register every model here
│   ├── routes/
│   │   ├── index.js             # Combines v1 + v2
│   │   ├── v1/                  # API version 1 routes
│   │   │   └── index.js         # Barrel file — register every v1 route file here
│   │   └── v2/                  # API version 2 routes
│   │       └── index.js
│   ├── services/                # Data access layer (DB queries)
│   │   └── index.js             # Barrel file — register every service here
│   ├── startup/
│   │   ├── db_mongo.js          # MongoDB connection
│   │   ├── db_redis.js          # Redis connection
│   │   ├── expressStartup.js    # Middleware + route initialization
│   │   └── cronScheduler.js     # Cron job registration
│   └── utils/
│       ├── constants.js         # All enums, error types, messages, regex
│       ├── joiUtils.js          # Custom Joi extensions (objectId, email, timezone)
│       ├── routeUtils.js        # THE routing engine (validation → auth → handler → swagger)
│       └── utils.js             # JWT, bcryptjs, OTP, logging utilities
├── data/logs/                   # Error logs (winston)
├── public/                      # Static files (if needed)
├── swagger.json                 # Auto-generated at startup
├── .env.example
└── .gitignore
```

---

## How Things Work

### Request Lifecycle

Every HTTP request goes through this exact pipeline (defined in `routeUtils.route()`):

1. **Multer** — if route has `formData`, parse multipart upload
2. **Joi Validation** — validate `body`, `params`, `query`, `headers` against the route's `joiSchemaForSwagger`
3. **API Key Check** — unless `authFree: true`, check `X-API-KEY` header matches `config.API_AUTH_KEY`
4. **User Auth** — if route has `auth` property, validate JWT from `Authorization` header, check role
5. **Handler** — controller function receives a flat `payload` object with all validated data + `user` + `file`

### Route Definition Pattern

This is THE most important pattern in the codebase. Every route is an object:

```javascript
{
    method: 'POST',                           // HTTP method
    path: '/v1/resource/action',              // URL path
    joiSchemaForSwagger: {
        headers: {
            authorization: Joi.string().required().description("JWT token")
        },
        body: {
            name: Joi.string().required().description('Resource name'),
            type: Joi.number().valid(1, 2, 3).description('Resource type'),
        },
        params: {
            id: Joi.string().objectId().required().description('Resource ID'),
        },
        query: {
            page: Joi.number().optional().default(1),
            limit: Joi.number().optional().default(10),
        },
        group: 'Resource',                    // Swagger tag
        description: 'Create a new resource', // Swagger description
        model: 'CreateResource'               // Swagger model name
    },
    auth: AVAILABLE_AUTHS.ADMIN_STAFF,        // Who can access (see constants.js)
    handler: resourceController.create         // Controller function
}
```

**Special route properties**:
- `authFree: true` — skips API key validation entirely
- `auth: AVAILABLE_AUTHS.XXX` — requires JWT and role match
- `getExactRequest: true` — passes raw Express `request` instead of flat payload
- No `auth` + no `authFree` — requires API key but no JWT

### Authentication & Authorization

**Three-layer security model**:

| Layer | Header | Purpose | Skip with |
|-------|--------|---------|-----------|
| API Key | `X-API-KEY` | Identifies the calling application | `authFree: true` on route |
| JWT Token | `Authorization` | Identifies the logged-in user | No `auth` property on route |
| Role Check | (from JWT) | Restricts by user type | Use appropriate `AVAILABLE_AUTHS` value |

**Available auth roles** (`AVAILABLE_AUTHS` in constants.js):

| Value | Who can access |
|-------|---------------|
| `ADMIN` | Super Admin only |
| `STAFF` | Staff only |
| `USER` | End users only |
| `ADMIN_STAFF` | Admin + Staff |
| `USER_STAFF` | User + Staff |
| `ADMIN_USER` | Admin + User |
| `ALL` | Admin + Staff + User |
| `CRON` | Cron token only |

**JWT creation**: Use `utils.encryptJwt(payload, expiresIn)` from `utils/utils.js`
**JWT verification**: Handled automatically by `authService.userValidate()` middleware

### Validation (Joi)

Custom Joi extensions are in `utils/joiUtils.js`. Always import Joi from there:

```javascript
const { Joi } = require('../../utils/joiUtils');

// Custom validators:
Joi.string().objectId()         // Validates & converts to Mongoose ObjectId
Joi.string().isValidEmail()     // Validates email format
Joi.string().isValidTimeZone()  // Validates timezone string
Joi.date().dateOnly()           // Strips time, keeps only date

// File upload in route definition:
joiSchemaForSwagger: {
    formData: {
        file: Joi.file({ name: 'avatar', description: 'Profile image' }),
        body: {
            title: Joi.string().required()
        }
    }
}
```

### Response Format

**ALL responses** must use the helpers from `helpers/common/resHelper.js`:

```javascript
const { createSuccessResponse, createErrorResponse } = require('../helpers');
const { MESSAGES, ERROR_TYPES } = require('../utils/constants');

// Success (200)
return createSuccessResponse(MESSAGES.SUCCESS, dataObject);
// → { statusCode: 200, status: true, msg: "Success.", type: "Default", data: {...} }

// Error (400/401/403/404/500)
throw createErrorResponse(MESSAGES.NOT_FOUND, ERROR_TYPES.DATA_NOT_FOUND);
// → { statusCode: 404, msg: "Not found.", status: false, type: "DATA_NOT_FOUND" }
```

**NEVER** return raw objects or use `res.json()` directly from controllers. Always return/throw these response objects — the route handler in `routeUtils.js` manages the HTTP response.

### Database Models (Mongoose)

Follow this pattern for every model:

```javascript
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;

const exampleSchema = new Schema({
    name: { type: String, trim: true },
    status: { type: Number, enum: [1, 2, 3], default: 1 },
    userId: { type: Schema.Types.ObjectId, ref: 'users', index: true },
}, { timestamps: true, versionKey: false });

// Add compound indexes for common queries
exampleSchema.index({ userId: 1, status: 1 });

module.exports = MONGOOSE.model('examples', exampleSchema);
```

**Then register in `models/index.js`**:
```javascript
ExampleModel: require('./exampleModel'),
```

### Environment Configuration

All config lives in `config/index.js`. It:
1. Reads from `process.env` (via `.env` file)
2. Sets sensible defaults
3. Merges with environment-specific overrides (`config/env/development.js` etc.)

**To add a new config value**:
1. Add to `.env.example` with a descriptive comment
2. Add to `defaults` object in `config/index.js` with `process.env.YOUR_KEY || 'default'`
3. Access anywhere as `const CONFIG = require('../../config'); CONFIG.YOUR_KEY`

### Swagger Documentation

Swagger is auto-generated from route definitions. The `joiSchemaForSwagger` object on each route is automatically converted to Swagger parameters.

- Access at: `/documentation` (protected by basic auth: `SWAGGER_AUTH_USERNAME`/`SWAGGER_AUTH_PASSWORD`)
- The `swagger.json` file is regenerated on every server start
- No manual Swagger editing needed — just define routes correctly

---

## How to Add a New Feature

Follow this exact order:

### 1. Define the Model (`app/models/featureModel.js`)
```javascript
// Create schema, add indexes, export model
// Register in models/index.js
```

### 2. Create the Service (`app/services/featureService.js`)
```javascript
// CRUD operations using the model
// Register in services/index.js
```

### 3. Create the Controller (`app/controllers/featureController.js`)
```javascript
// Business logic, uses services, returns createSuccessResponse/createErrorResponse
// Register in controllers/index.js
```

### 4. Define Routes (`app/routes/v1/featureRoutes.js`)
```javascript
// Route objects with Joi schemas, auth, and handler
// Register in routes/v1/index.js
```

### 5. Registration Checklist
- [ ] Model registered in `app/models/index.js`
- [ ] Service registered in `app/services/index.js`
- [ ] Controller registered in `app/controllers/index.js`
- [ ] Routes registered in `app/routes/v1/index.js`
- [ ] New env vars added to `.env.example`

---

## Security Architecture

### Current Security Layers

| Layer | Implementation | File |
|-------|---------------|------|
| Security Headers | `helmet` middleware | `startup/expressStartup.js` |
| CORS | Whitelist-based origin check | `startup/expressStartup.js` |
| API Key Gate | `X-API-KEY` header validation | `services/authService.js` |
| JWT Authentication | Token verification + user lookup | `services/authService.js` |
| Role-Based Access | `AVAILABLE_AUTHS` enum per route | `utils/constants.js` |
| Input Validation | Joi schemas on every route | `utils/routeUtils.js` |
| Rate Limiting | `express-rate-limit` | `services/authService.js` |
| Password Hashing | `bcryptjs` with salt rounds | `utils/utils.js` |
| Request Logging | Winston + console | `startup/expressStartup.js` |
| Swagger Auth | HTTP Basic Auth | `utils/routeUtils.js` |

---

## Senior Developer Recommendations

### 🔴 CRITICAL — Fix Before Going to Production

1. **Rotate all default secrets immediately**
   - `API_AUTH_KEY`, `JWT_SECRET`, `ADMIN_JWT_SIGN_KEY`, `ENCRYPTION_SECRET_KEY` — all have hardcoded fallback defaults. If `.env` is missing, these become your "password". Generate 256-bit random keys for production.

2. **Add `express-mongo-sanitize`**
   - Your MongoDB queries use user input. Without sanitization, NoSQL injection is possible via `$gt`, `$ne` operators in query/body params.
   ```bash
   npm install express-mongo-sanitize
   ```
   ```javascript
   const mongoSanitize = require('express-mongo-sanitize');
   app.use(mongoSanitize());
   ```

3. **Add global rate limiting**
   - Currently only specific routes have rate limiting. Add a global rate limiter to ALL routes to prevent DDoS:
   ```javascript
   const rateLimit = require('express-rate-limit');
   app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
   ```

4. **Never log DB connection strings**
   - The `db_mongo.js` logs the full connection URL including credentials. Replace with:
   ```javascript
   console.log('MongoDB connected at', MONGODB.HOST + ':' + MONGODB.PORT + '/' + MONGODB.NAME);
   ```

5. **Use `HttpOnly`, `Secure`, `SameSite` cookies for web tokens**
   - If you serve web clients, JWT in `Authorization` header is vulnerable to XSS. Use HttpOnly cookies instead.

### 🟡 HIGH PRIORITY — Security Hardening

6. **Add request body size limits per route**
   - The global 50MB limit is too generous. Set specific limits per route type (e.g., 1MB for JSON APIs, 10MB for file uploads).

7. **Implement token refresh mechanism**
   - Currently JWTs have a fixed expiry. Add refresh tokens to avoid forcing users to re-login.

8. **Add `helmet` CSP (Content Security Policy)**
   - Default helmet is good but doesn't set CSP. If you serve any HTML:
   ```javascript
   app.use(helmet.contentSecurityPolicy({
       directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"] }
   }));
   ```

9. **Validate file upload types**
   - Multer accepts any file type. Add a `fileFilter` to restrict by MIME type:
   ```javascript
   const upload = multer({
       fileFilter: (req, file, cb) => {
           const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
           cb(null, allowed.includes(file.mimetype));
       },
       limits: { fileSize: 5 * 1024 * 1024 } // 5MB
   });
   ```

10. **Add CORS origin validation for production**
    - When `ALLOWED_ORIGINS` is empty, CORS falls back to `*` (allow all). This MUST be set for production.

### 🟢 RECOMMENDED — Best Practices

11. **Add request correlation IDs**
    - Generate a UUID per request and include it in all logs. This makes debugging distributed issues trivial:
    ```javascript
    const { v4: uuidv4 } = require('uuid');
    app.use((req, res, next) => {
        req.correlationId = req.headers['x-correlation-id'] || uuidv4();
        res.setHeader('x-correlation-id', req.correlationId);
        next();
    });
    ```

12. **Add health check with dependency status**
    - The health endpoint should check MongoDB and Redis connectivity:
    ```javascript
    controller.healthCheck = async () => {
        const mongoOk = mongoose.connection.readyState === 1;
        const redisOk = redisClient.isReady;
        const statusCode = (mongoOk && redisOk) ? 200 : 503;
        return { statusCode, status: mongoOk && redisOk, data: { mongo: mongoOk, redis: redisOk } };
    };
    ```

13. **Add graceful shutdown**
    ```javascript
    process.on('SIGTERM', async () => {
        console.log('SIGTERM received. Shutting down gracefully...');
        server.close(() => {
            mongoose.connection.close();
            redisClient.quit();
            process.exit(0);
        });
    });
    ```

14. **Add API versioning deprecation headers**
    - When you move to v2, add deprecation headers to v1 routes:
    ```javascript
    res.setHeader('Deprecation', 'true');
    res.setHeader('Sunset', '2025-12-31');
    ```

15. **Implement audit logging**
    - Log all CREATE/UPDATE/DELETE operations with who did what, when, and the before/after state. Critical for compliance.

16. **Add `hpp` (HTTP Parameter Pollution) protection**
    ```bash
    npm install hpp
    ```
    ```javascript
    const hpp = require('hpp');
    app.use(hpp());
    ```

17. **Add structured error handling middleware**
    - Add a catch-all error handler at the end of express middleware chain to handle unexpected errors uniformly:
    ```javascript
    app.use((err, req, res, next) => {
        logger.error({ correlationId: req.correlationId, error: err.message, stack: err.stack });
        res.status(500).json(createErrorResponse('Internal Server Error', 'INTERNAL_SERVER_ERROR'));
    });
    ```

18. **Use environment-specific logging levels**
    - Don't `console.log` in production. Use Winston with level controls:
      - Development: `debug`
      - Staging: `info`
      - Production: `warn` + `error` only

19. **Add database connection retry logic**
    - If MongoDB is temporarily unreachable at startup, the server crashes. Add retry with exponential backoff.

20. **Set up Snyk or `npm audit` in CI/CD**
    - Regularly scan dependencies for known vulnerabilities. The original project had `snyk` but it was pinned to a specific (potentially outdated) version.

### 🔵 NICE TO HAVE — Developer Experience

21. **Add ESLint + Prettier** — Enforce consistent code style across the team.
22. **Add Jest + Supertest** — Unit and integration tests from day one.
23. **Add a `seeds/` directory** — Database seeding scripts for local dev and testing.
24. **Add Husky + lint-staged** — Pre-commit hooks for linting and testing.
25. **Add `.nvmrc`** — Pin the Node.js version for the team.

---

## Cron Jobs

Add cron jobs in `app/startup/cronScheduler.js`:

```javascript
const cron = require('node-cron');

// Every day at midnight UTC
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily cleanup...');
    // your logic here
});
```

Set `RUN_CRON=true` in `.env` to enable.

---

## Conventions & Rules for AI Assistants

1. **ALWAYS** use `createSuccessResponse` / `createErrorResponse` for responses
2. **ALWAYS** validate input with Joi in the route definition, never in the controller
3. **ALWAYS** register new files in their respective `index.js` barrel files
4. **ALWAYS** add new env vars to `.env.example` with a comment
5. **NEVER** use `res.json()` directly — the route handler does this
6. **NEVER** put DB queries in controllers — use services
7. **NEVER** hardcode strings — use `MESSAGES` and `CONSTANTS`
8. **NEVER** skip the `auth` property on routes that need protection
9. **File naming**: `camelCase` for all files (e.g., `userService.js`, `authRoutes.js`)
10. **Route paths**: `/v{version}/{resource}/{action}` (e.g., `/v1/user/login`)
