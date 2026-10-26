# Frontend API Integration Reference

This document defines the complete backend API contract for frontend developers and coding agents integrating the client application and admin dashboard.

---

## 1. Connection & Protocol Specifications

### 1.1 Base URL & Routing
- **Base Prefix**: `/api` (e.g. `http://localhost:5175/api` in development).
- **Format**: All JSON payloads must be formatted as UTF-8 with `Content-Type: application/json` unless uploading files via `multipart/form-data`.

### 1.2 Cross-Origin Resource Sharing (CORS) & Credentials
The backend enforces CORS restricting origins to the configured `FRONTEND_URL` and requires credentials:
- **Cookie Transport**: Session authentication uses an **HTTP-only cookie** named `token`.
- **Browser Fetch**: Requests must include `credentials: "include"`.
  ```javascript
  fetch("http://localhost:5175/api/auth/me", {
      method: "GET",
      credentials: "include",
  });
  ```
- **Axios**: Set `withCredentials: true` globally or per request:
  ```javascript
  axios.defaults.withCredentials = true;
  ```
- **Bearer Token Alternative**: If cookies are not supported or in non-browser environments, the backend also inspects the header:
  ```http
  Authorization: Bearer <token>
  ```

### 1.3 Standard Response Envelope

All API endpoints return JSON conforming to one of the following standard envelopes:

#### Success (Single Item or Operation)
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "results": { ... }
}
```

#### Success (Paginated List)
```json
{
  "status": "success",
  "message": "Data retrieved successfully",
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalResults": 54,
    "totalPages": 3,
    "nextPage": 2,
    "prevPage": null
  },
  "results": [ ... ]
}
```

#### Operational Error (Client / Server Failures)
```json
{
  "status": "fail",
  "message": "Description of operational error"
}
```
*(Status is `"fail"` for 4xx errors and `"error"` for 500 errors. In development mode `MODE_DEV=development`, a `stack` trace field is included on 500s).*

#### Validation Error (HTTP 400 Zod Failure)
```json
{
  "status": "fail",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

### 1.4 Global Rate Limiting
- **Global API**: 200 requests per 15-minute window (`apiRateLimit`).
- **Auth Limits**: 5 requests per 10-minute window for auth mutations; 3 requests per 5 minutes for OTP actions.
- **Contact Form**: 5 messages per 15-minute window (`messageRateLimit`).
- **Visitor Events**: 60 events per 1-minute window (`visitorEventRateLimit`).

---

## 2. Authentication & Admin Identity (`/api/auth`)

### 2.1 Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public (Rate-limited: 5 requests / 10 min)
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",     // string, required, valid email
    "password": "secretpassword"      // string, required
  }
  ```
- **Behavior**: Verifies credentials, confirms `user.is_active === true` and `user.role === 'admin'`. Sets HTTP-only `token` cookie (7 days expiry, `SameSite: Lax`).
- **Response** (`200 OK`):
  ```json
  {
    "status": "success",
    "message": "You have been logged in successfully",
    "results": {
      "user": {
        "id": "uuid-v4",
        "email": "admin@example.com",
        "role": "admin",
        "is_active": true
      }
    }
  }
  ```
- **Errors**: `401 Unauthorized` (Invalid credentials or inactive account), `403 Forbidden` (User is not an admin).

### 2.2 Register
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public (Rate-limited: 5 requests / 10 min)
- **Request Body**:
  ```json
  {
    "full_name": "Admin User",   // string, required, 2-150 chars
    "email": "admin@domain.com", // string, required, valid email, max 255 chars
    "password": "Password123"    // string, required, 8-128 chars
  }
  ```
- **Response** (`201 Created`): Returns verification message; sends 6-digit OTP code to user email.

### 2.3 Verify Email OTP
- **Endpoint**: `POST /api/auth/verify-email-otp`
- **Access**: Public (Rate-limited: 5 requests / 10 min)
- **Request Body**:
  ```json
  {
    "email": "admin@domain.com",  // string, required, valid email
    "otp": "123456"               // string, required, exactly 6 digits
  }
  ```
- **Response** (`200 OK`): Marks email verified and logs user in, setting the `token` cookie.

### 2.4 Resend OTP
- **Endpoint**: `POST /api/auth/resend-otp`
- **Access**: Public (Rate-limited: 3 requests / 5 min)
- **Request Body**:
  ```json
  {
    "email": "admin@domain.com"   // string, required
  }
  ```
- **Response** (`200 OK`): Resends 6-digit OTP to the registered unverified address.

### 2.5 Forgot Password
- **Endpoint**: `POST /api/auth/forgot-password`
- **Access**: Public (Rate-limited: 3 requests / 5 min)
- **Request Body**:
  ```json
  {
    "email": "admin@domain.com"   // string, required, valid email
  }
  ```
- **Response** (`200 OK`): Generates password reset OTP and emails it.

### 2.6 Verify Password Reset Code
- **Endpoint**: `POST /api/auth/verify-reset-code`
- **Access**: Public (Rate-limited: 5 requests / 10 min)
- **Request Body**:
  ```json
  {
    "email": "admin@domain.com",  // string, required
    "otp": "123456"               // string, required, 6 digits
  }
  ```
- **Response** (`200 OK`): Confirms reset OTP validity.

### 2.7 Reset Password
- **Endpoint**: `POST /api/auth/reset-password`
- **Access**: Public (Rate-limited: 5 requests / 10 min)
- **Request Body**:
  ```json
  {
    "email": "admin@domain.com",        // string, required
    "newPassword": "newPassword123",    // string, required, min 6 chars
    "confirmPassword": "newPassword123" // string, required, must match newPassword
  }
  ```
- **Response** (`200 OK`): Updates user password hash; invalidates reset token.

### 2.8 Logout
- **Endpoint**: `POST /api/auth/logout`
- **Access**: Public
- **Request Body**: None
- **Response** (`200 OK`): Clears the `token` cookie.
  ```json
  {
    "status": "success",
    "message": "You have successfully logged out"
  }
  ```

### 2.9 Get Current Authenticated User (`/me`)
- **Endpoint**: `GET /api/auth/me`
- **Access**: Protected (Role: `admin`)
- **Headers/Cookies**: Requires active `token` cookie or `Authorization: Bearer <token>`.
- **Response** (`200 OK`):
  ```json
  {
    "status": "success",
    "message": "User data was retrieved successfully",
    "results": {
      "user": {
        "id": "uuid-v4",
        "full_name": "Site Admin",
        "email": "admin@example.com",
        "role": "admin",
        "is_active": true,
        "created_at": "2026-01-01T00:00:00Z",
        "updated_at": "2026-01-01T00:00:00Z"
      }
    }
  }
  ```
- **Errors**: `401 Unauthorized` (Not authenticated / token expired), `403 Forbidden` (Not an admin).

---

## 3. Projects (`/api/projects`)

### 3.1 Admin Dashboard: List All Projects
- **Endpoint**: `GET /api/projects/dashboard`
- **Access**: Protected (Role: `admin`)
- **Query Parameters**:
  - `page` (number, default: `1`): Page number.
  - `limit` (number, default: `20`): Items per page.
  - `status` (string, optional): Filter by `"draft"`, `"published"`, or `"hidden"`.
  - `search` (string, optional): Case-insensitive slug search.
- **Response** (`200 OK`): Standard paginated envelope with array of project records.

### 3.2 Public / Dual-View: List Published Projects
- **Endpoint**: `GET /api/projects`
- **Access**: Public (Dual-view: Admin session returns all statuses; public gets published only)
- **Query Parameters**:
  - `page` (number, default: `1`)
  - `limit` (number, default: `20`)
  - `locale` (string, optional): `"ar"` or `"en"`. If provided, joins and flattens matching `project_translations` object onto `translation` key.
- **Response** (`200 OK`): Paginated project list.

### 3.3 Get Single Project by Slug
- **Endpoint**: `GET /api/projects/:slug`
- **Access**: Public / Dual-view
- **Path Parameters**:
  - `slug` (string, required): Project slug (e.g. `ecommerce-platform`).
- **Query Parameters**:
  - `locale` (string, optional): `"ar"` or `"en"`. Flattens translation onto project object.
- **Response** (`200 OK`):
  ```json
  {
    "status": "success",
    "message": "Project retrieved successfully",
    "results": {
      "id": "uuid-v4",
      "slug": "ecommerce-platform",
      "status": "published",
      "featured": true,
      "sort_order": 0,
      "live_url": "https://example.com",
      "github_url": "https://github.com/...",
      "created_at": "...",
      "updated_at": "...",
      "translation": {
        "title": "E-Commerce App",
        "description": "...",
        "role": "Lead Developer",
        "challenge": "...",
        "solution": "...",
        "result": "...",
        "meta_title": "...",
        "meta_description": "...",
        "locale": "en"
      }
    }
  }
  ```

### 3.4 Create Project
- **Endpoint**: `POST /api/projects`
- **Access**: Protected (Role: `admin`)
- **Request Body** (`application/json`):
  ```json
  {
    "slug": "portfolio-backend",        // string, required, lowercase alphanumeric + hyphens
    "status": "draft",                   // string, optional, "draft" | "published" | "hidden" (default: "draft")
    "featured": false,                   // boolean, optional (default: false)
    "sort_order": 0,                     // integer, optional (default: 0)
    "live_url": "https://example.com",   // string, optional, valid URL or null
    "github_url": "https://github.com"   // string, optional, valid URL or null
  }
  ```
- **Response** (`201 Created`): Returns newly created project in `results`.
- **Errors**: `400 Bad Request` (Invalid format), `409 Conflict` (Slug already exists).

### 3.5 Update Project
- **Endpoint**: `PUT /api/projects/:id`
- **Access**: Protected (Role: `admin`)
- **Path Parameters**: `id` (UUID, required)
- **Request Body**: Same fields as Create Project, all optional.
- **Response** (`200 OK`): Updated project object.

### 3.6 Update Project Status
- **Endpoint**: `PATCH /api/projects/:id/status`
- **Access**: Protected (Role: `admin`)
- **Path Parameters**: `id` (UUID, required)
- **Request Body**:
  ```json
  {
    "status": "published" // string, required: "draft" | "published" | "hidden"
  }
  ```
- **Response** (`200 OK`): Updated project object.

### 3.7 Delete Project
- **Endpoint**: `DELETE /api/projects/:id`
- **Access**: Protected (Role: `admin`)
- **Path Parameters**: `id` (UUID, required)
- **Behavior**: Cascades deletion across associated translations, images, technologies, categories, and clears cache.
- **Response** (`200 OK`): `{ "status": "success", "message": "Project deleted successfully" }`.

---

## 4. Project Nested Sub-Resources

### 4.1 Project Translations (`/api/projects/:projectId/translations`)

- **List Translations**: `GET /api/projects/:projectId/translations`
  - Access: Public (published projects) / Admin (all)
- **Get Translation by Locale**: `GET /api/projects/:projectId/translations/:locale`
  - Access: Public / Admin (`locale`: `"ar"` or `"en"`)
- **Create / Upsert Translation**:
  - `POST /api/projects/:projectId/translations`
  - `PUT /api/projects/:projectId/translations/:locale`
  - Access: Protected (Role: `admin`)
  - Request Body:
    ```json
    {
      "locale": "ar",                       // string, "ar" | "en" (required on POST or taken from PUT path)
      "title": "عنوان المشروع",              // string, required, 1-200 chars
      "description": "تفاصيل المشروع...",    // string, optional
      "role": "مطور رئيسي",                 // string, optional
      "challenge": "التحدي التقني...",       // string, optional
      "solution": "الحل الهندسي...",        // string, optional
      "result": "النتائج المحققة...",       // string, optional
      "meta_title": "عنوان SEO",             // string, optional, max 255 chars
      "meta_description": "وصف SEO"          // string, optional, max 500 chars
    }
    ```
  - Response (`200 OK`): Saved translation object.
- **Delete Translation**: `DELETE /api/projects/:projectId/translations/:locale`
  - Access: Protected (Role: `admin`)

### 4.2 Project Images (`/api/projects/:projectId/images`)

- **List Images**: `GET /api/projects/:projectId/images`
  - Access: Public / Admin
- **Get Image by ID**: `GET /api/projects/:projectId/images/:id`
  - Access: Public / Admin
- **Upload Project Image**:
  - `POST /api/projects/:projectId/images`
  - Access: Protected (Role: `admin`)
  - **Content-Type**: `multipart/form-data`
  - **Form Fields**:
    - `image` or `file` (File, required): Max 5MB, image mimetype (`image/jpeg`, `image/png`, `image/webp`).
    - `alt` (string, optional): Image alt text, max 255 chars.
    - `sort_order` (integer, optional, default: 0).
    - `is_featured` (boolean / string `"true"`|`"false"`, optional, default: `false`). If `true`, resets existing featured images for this project.
  - Response (`201 Created`):
    ```json
    {
      "status": "success",
      "message": "Project image uploaded successfully",
      "results": {
        "id": "uuid-v4",
        "project_id": "uuid-v4",
        "image_url": "https://...supabase.co/.../image.webp",
        "alt": "Homepage screenshot",
        "sort_order": 0,
        "is_featured": true,
        "created_at": "..."
      }
    }
    ```
- **Update Image**: `PUT /api/projects/:projectId/images/:id`
  - Access: Protected (Role: `admin`)
  - Can accept `multipart/form-data` (replacing file) or JSON (updating `alt`, `sort_order`, `is_featured`).
- **Delete Image**: `DELETE /api/projects/:projectId/images/:id`
  - Access: Protected (Role: `admin`)

### 4.3 Project Technologies (`/api/projects/:projectId/technologies`)

- **List Project Technologies**: `GET /api/projects/:projectId/technologies`
  - Access: Public / Admin
  - Returns array of technology objects linked to this project.
- **Assign Technology to Project**:
  - `POST /api/projects/:projectId/technologies`
  - Access: Protected (Role: `admin`)
  - Request Body:
    ```json
    {
      "technology_id": "uuid-v4" // UUID, required (also accepts "technologyId")
    }
    ```
  - Response (`201 Created`): Linked record confirmation.
- **Remove Technology from Project**:
  - `DELETE /api/projects/:projectId/technologies/:technologyId`
  - Access: Protected (Role: `admin`)

### 4.4 Project Categories (`/api/projects/:projectId/categories`)

- **List Project Categories**: `GET /api/projects/:projectId/categories`
  - Access: Public / Admin
  - Returns array of category objects linked to this project.
- **Assign Category to Project**:
  - `POST /api/projects/:projectId/categories`
  - Access: Protected (Role: `admin`)
  - Request Body:
    ```json
    {
      "category_id": "uuid-v4" // UUID, required (also accepts "categoryId")
    }
    ```
  - Response (`201 Created`): Linked record confirmation.
- **Remove Category from Project**:
  - `DELETE /api/projects/:projectId/categories/:categoryId`
  - Access: Protected (Role: `admin`)

---

## 5. Categories (`/api/categories`)

### 5.1 Admin Dashboard: List Categories
- **Endpoint**: `GET /api/categories/dashboard`
- **Access**: Protected (Role: `admin`)
- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, default: 20)
  - `is_active` (string, optional): `"true"` or `"false"`
  - `search` (string, optional): Searches `name` or `slug`
- **Response** (`200 OK`): Paginated categories list.

### 5.2 Public: List Active Categories
- **Endpoint**: `GET /api/categories`
- **Access**: Public
- **Query Parameters**:
  - `page` (number, optional)
  - `limit` (number, optional)
- **Response** (`200 OK`): Active categories array (with optional pagination).

### 5.3 Get Category by ID or Slug
- **Endpoint**: `GET /api/categories/:id`
- **Access**: Public
- **Path Parameters**: `id` can be UUID or `slug` (e.g. `web-development`).
- **Response** (`200 OK`): Single category object.

### 5.4 Create Category
- **Endpoint**: `POST /api/categories`
- **Access**: Protected (Role: `admin`)
- **Request Body**:
  ```json
  {
    "name": "Web Development",       // string, required, 1-100 chars (English / default name)
    "name_ar": "تطوير الويب",         // string, optional, 1-100 chars (Arabic name)
    "slug": "web-development",       // string, required, lowercase alphanumeric + hyphens
    "sort_order": 0,                 // integer, optional (default: 0)
    "is_active": true                // boolean, optional (default: true)
  }
  ```
- **Response** (`201 Created`): New category object.

### 5.5 Update Category
- **Endpoint**: `PUT /api/categories/:id`
- **Access**: Protected (Role: `admin`)
- **Path Parameters**: `id` (UUID, required)
- **Request Body**: Same fields as Create Category (`name`, `name_ar`, `slug`, `sort_order`, `is_active`), all optional.
- **Response** (`200 OK`): Updated category object.

> [!TIP]
> **Localization Pattern**:
> When displaying category names based on the active locale, resolve the Arabic name with fallback to the default name:
> ```typescript
> const categoryName =
>   locale === "ar"
>     ? category.name_ar || category.name
>     : category.name;
> ```

### 5.6 Delete Category
- **Endpoint**: `DELETE /api/categories/:id`
- **Access**: Protected (Role: `admin`)
- **Path Parameters**: `id` (UUID, required)
- **Response** (`200 OK`): `{ "status": "success", "message": "Category deleted successfully" }`.

---

## 6. Technologies (`/api/technologies`)

### 6.1 Admin Dashboard: List Technologies
- **Endpoint**: `GET /api/technologies/dashboard`
- **Access**: Protected (Role: `admin`)
- **Query Parameters**:
  - `page`, `limit` (pagination)
  - `is_active` (`"true"` | `"false"`)
  - `search` (name or slug)
- **Response** (`200 OK`): Paginated technologies list.

### 6.2 Public: List Active Technologies
- **Endpoint**: `GET /api/technologies`
- **Access**: Public
- **Query Parameters**: Optional `page`, `limit`.
- **Response** (`200 OK`): Array of active technology objects.

### 6.3 Get Technology by ID or Slug
- **Endpoint**: `GET /api/technologies/:id`
- **Access**: Public
- **Path Parameters**: `id` can be UUID or `slug`.
- **Response** (`200 OK`): Technology object.

### 6.4 Create Technology
- **Endpoint**: `POST /api/technologies`
- **Access**: Protected (Role: `admin`)
- **Request Body**:
  ```json
  {
    "name": "React",            // string, required, 1-100 chars
    "slug": "react-js",         // string, required, lowercase alphanumeric + hyphens
    "icon": "react-icon.svg",   // string, optional URL or icon key
    "sort_order": 0,            // integer, optional (default: 0)
    "is_active": true           // boolean, optional (default: true)
  }
  ```
- **Response** (`201 Created`): New technology object.

### 6.5 Update Technology
- **Endpoint**: `PUT /api/technologies/:id`
- **Access**: Protected (Role: `admin`)
- **Path Parameters**: `id` (UUID, required)
- **Request Body**: Same fields as Create, all optional.
- **Response** (`200 OK`): Updated technology object.

### 6.6 Delete Technology
- **Endpoint**: `DELETE /api/technologies/:id`
- **Access**: Protected (Role: `admin`)
- **Path Parameters**: `id` (UUID, required)
- **Response** (`200 OK`): Success message.

---

## 7. Services & Service Translations (`/api/services`)

### 7.1 Admin Dashboard: List Services
- **Endpoint**: `GET /api/services/dashboard`
- **Access**: Protected (Role: `admin`)
- **Query Parameters**: `page`, `limit`, `is_active`, `search` (by slug).
- **Response** (`200 OK`): Paginated services list.

### 7.2 Public: List Active Services
- **Endpoint**: `GET /api/services`
- **Access**: Public
- **Query Parameters**: Optional `page`, `limit`.
- **Response** (`200 OK`): Active services list.

### 7.3 Get Service by ID or Slug
- **Endpoint**: `GET /api/services/:id`
- **Access**: Public
- **Path Parameters**: `id` can be UUID or `slug`.
- **Response** (`200 OK`): Service object.

### 7.4 Create Service
- **Endpoint**: `POST /api/services`
- **Access**: Protected (Role: `admin`)
- **Request Body**:
  ```json
  {
    "slug": "ui-ux-design",     // string, required, 1-150 chars, kebab-case
    "icon": "design-icon.svg",  // string, optional
    "sort_order": 0,            // integer, optional (default: 0)
    "is_active": true           // boolean, optional (default: true)
  }
  ```
- **Response** (`201 Created`): New service object.

### 7.5 Update Service
- **Endpoint**: `PUT /api/services/:id`
- **Access**: Protected (Role: `admin`)
- **Path Parameters**: `id` (UUID, required)
- **Response** (`200 OK`): Updated service object.

### 7.6 Delete Service
- **Endpoint**: `DELETE /api/services/:id`
- **Access**: Protected (Role: `admin`)
- **Path Parameters**: `id` (UUID, required)
- **Response** (`200 OK`): Success message.

### 7.7 Service Translations Sub-Resource (`/api/services/:serviceId/translations`)
- **List Translations**: `GET /api/services/:serviceId/translations` (Public / Admin)
- **Get Translation by Locale**: `GET /api/services/:serviceId/translations/:locale` (`locale`: `"ar"` | `"en"`)
- **Create Translation**:
  - `POST /api/services/:serviceId/translations` (Admin)
  - Body:
    ```json
    {
      "locale": "ar",                   // string, required: "ar" | "en"
      "title": "تصميم واجهات المستخدم",  // string, required, 1-200 chars
      "description": "تفاصيل الخدمة..." // string, optional
    }
    ```
- **Upsert Translation**:
  - `PUT /api/services/:serviceId/translations/:locale` (Admin)
  - Body: Same as Create (with `locale` optional or taken from path).
- **Delete Translation**: `DELETE /api/services/:serviceId/translations/:locale` (Admin)

---

## 8. Testimonials (`/api/testimonials`)

### 8.1 Admin Dashboard: List Testimonials
- **Endpoint**: `GET /api/testimonials/dashboard`
- **Access**: Protected (Role: `admin`)
- **Query Parameters**:
  - `page`, `limit` (pagination)
  - `is_published` (`"true"` | `"false"`)
  - `is_featured` (`"true"` | `"false"`)
  - `search` (searches `client_name` or `company`)
- **Response** (`200 OK`): Paginated testimonials list.

### 8.2 Public: List Published Testimonials
- **Endpoint**: `GET /api/testimonials`
- **Access**: Public
- **Query Parameters**: Optional `page`, `limit`.
- **Response** (`200 OK`): Published testimonials array.

### 8.3 Get Testimonial by ID
- **Endpoint**: `GET /api/testimonials/:id`
- **Access**: Public
- **Path Parameters**: `id` (UUID, required)
- **Response** (`200 OK`): Testimonial object.

### 8.4 Create Testimonial
- **Endpoint**: `POST /api/testimonials`
- **Access**: Protected (Role: `admin`)
- **Content-Type**: `multipart/form-data` or `application/json`
- **Fields**:
  - `client_image` or `image` or `file` (File, optional): Avatar image file (max 5MB, processed by Sharp into WebP).
  - `client_name` (string, required): 1-150 chars.
  - `client_role` (string, optional): e.g. "CEO", max 150 chars.
  - `company` (string, optional): e.g. "Acme Corp", max 150 chars.
  - `rating` (integer, optional): 1 to 5.
  - `testimonial` (string, required): Testimonial text.
  - `is_featured` (boolean / string `"true"`, optional, default: false).
  - `is_published` (boolean / string `"true"`, optional, default: false).
  - `sort_order` (integer, optional, default: 0).
- **Response** (`201 Created`): New testimonial object.

### 8.5 Update Testimonial
- **Endpoint**: `PUT /api/testimonials/:id`
- **Access**: Protected (Role: `admin`)
- **Path Parameters**: `id` (UUID, required)
- **Content-Type**: `multipart/form-data` or `application/json`
- **Response** (`200 OK`): Updated testimonial object.

### 8.6 Delete Testimonial
- **Endpoint**: `DELETE /api/testimonials/:id`
- **Access**: Protected (Role: `admin`)
- **Path Parameters**: `id` (UUID, required)
- **Response** (`200 OK`): Success message.

---

## 9. Contact Messages (`/api/messages`)

### 9.1 Submit Contact Message (Public Form)
- **Endpoint**: `POST /api/messages`
- **Access**: Public (Rate-limited: 5 submissions / 15 min)
- **Request Body** (`application/json`):
  ```json
  {
    "name": "Jane Doe",                   // string, required, 1-150 chars
    "email": "jane@example.com",          // string, required, valid email, max 255 chars
    "phone": "+1234567890",               // string, optional, max 50 chars
    "subject": "Project Inquiry",         // string, optional, max 255 chars
    "message": "I would like to discuss..." // string, required
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "status": "success",
    "message": "Message sent successfully",
    "results": {
      "id": "uuid-v4",
      "status": "new",
      "created_at": "..."
    }
  }
  ```

### 9.2 Admin Dashboard: List Messages
- **Endpoint**: `GET /api/messages/dashboard`
- **Access**: Protected (Role: `admin`)
- **Query Parameters**:
  - `page`, `limit` (pagination)
  - `status` (string, optional): `"new"`, `"read"`, `"replied"`, `"archived"`
  - `search` (string, optional): Searches `name`, `email`, or `subject`
- **Response** (`200 OK`): Paginated messages list.

### 9.3 Get Message by ID
- **Endpoint**: `GET /api/messages/:id`
- **Access**: Protected (Role: `admin`)
- **Path Parameters**: `id` (UUID, required)
- **Response** (`200 OK`): Complete message object.

### 9.4 Update Message Status
- **Endpoint**: `PATCH /api/messages/:id/status`
- **Access**: Protected (Role: `admin`)
- **Path Parameters**: `id` (UUID, required)
- **Request Body**:
  ```json
  {
    "status": "read" // string, required: "new" | "read" | "replied" | "archived"
  }
  ```
- **Response** (`200 OK`): Updated message object.

### 9.5 Delete Message
- **Endpoint**: `DELETE /api/messages/:id`
- **Access**: Protected (Role: `admin`)
- **Path Parameters**: `id` (UUID, required)
- **Response** (`200 OK`): Success message.

---

## 10. Visitor Analytics & Events (`/api/visitor-events`)

### 10.1 Track Visitor Event (Client Analytics Ping)
- **Endpoint**: `POST /api/visitor-events`
- **Access**: Public (Rate-limited: 60 requests / 1 min per IP)
- **Request Body** (`application/json`):
  ```json
  {
    "session_id": "c1f7b0f6-2e8c-4f76-bf10-388d0bebc8d3", // string, required, valid UUID v4
    "page_path": "/projects/ecommerce-platform",          // string, required, max 2000 chars
    "referrer": "https://google.com",                     // string, optional, max 2000 chars
    "device_type": "mobile",                              // string, optional, max 30 chars (e.g. mobile, desktop)
    "country": "Egypt"                                    // string, optional, max 100 chars
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "status": "success",
    "message": "Visitor event recorded successfully",
    "results": {
      "id": "uuid-v4",
      "created_at": "..."
    }
  }
  ```

### 10.2 Admin Analytics Dashboard Summary
- **Endpoint**: `GET /api/visitor-events/dashboard`
- **Access**: Protected (Role: `admin`)
- **Query Parameters**:
  - `days` (number, optional, default: `30`, min: 1, max: 365): Aggregation time window.
- **Response** (`200 OK`):
  ```json
  {
    "status": "success",
    "message": "Visitor analytics retrieved successfully",
    "results": {
      "timeframe": {
        "days": 30,
        "since": "2026-09-12T00:00:00.000Z"
      },
      "overview": {
        "total_views": 1250,
        "today_views": 45,
        "unique_visitors": 420,
        "avg_pages_per_session": 2.98
      },
      "top_pages": [
        { "item": "/projects", "count": 520 },
        { "item": "/", "count": 430 }
      ],
      "device_breakdown": [
        { "device": "desktop", "count": 750 },
        { "device": "mobile", "count": 500 }
      ],
      "top_referrers": [
        { "item": "https://google.com", "count": 310 }
      ],
      "top_countries": [
        { "item": "Egypt", "count": 800 }
      ],
      "daily_trends": [
        { "date": "2026-10-01", "count": 42 },
        { "date": "2026-10-02", "count": 56 }
      ]
    }
  }
  ```

### 10.3 Admin Raw Events Log
- **Endpoint**: `GET /api/visitor-events/dashboard/events`
- **Access**: Protected (Role: `admin`)
- **Query Parameters**:
  - `page`, `limit` (pagination)
  - `session_id` (UUID, optional)
  - `page_path` (string, optional, partial match)
  - `device_type` (string, optional)
  - `country` (string, optional)
  - `from_date` (ISO date string, optional)
  - `to_date` (ISO date string, optional)
- **Response** (`200 OK`): Paginated list of raw visitor events.

---

## 11. Implemented vs. Unverified Functionality

| Feature / Endpoint | Status | Notes |
| :--- | :--- | :--- |
| **All Auth Endpoints** (`login`, `register`, `otp`, `reset`, `me`) | Implemented | Verified in `auth.route.js` and controllers |
| **Projects & Sub-resources** (Images, Translations, Tech, Categories) | Implemented | Verified with dual-view and mergeParams |
| **Categories CRUD** | Implemented | Verified |
| **Technologies CRUD** | Implemented | Verified |
| **Services & Translations CRUD** | Implemented | Verified |
| **Testimonials CRUD + Image Upload** | Implemented | Verified |
| **Messages CRUD + Public Post** | Implemented | Verified |
| **Visitor Events & Analytics** | Implemented | Verified |
| `GET /api/health` | **Not Implemented** | Described in earlier design docs but omitted from `src/app.js` |
| Direct Password Update (without reset code) | **Not Implemented** | Only `forgot-password` / `reset-password` flow exists |
| Refresh Token Rotation | **Not Implemented** | Access relies on single 7-day JWT cookie |
