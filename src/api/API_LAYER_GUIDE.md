## API Layer Architecture

This document describes the reusable API layer structure designed to keep your codebase clean, consistent, and maintainable.

---

## Overview

The API layer consists of three main components:

1. **apiClient.js** - Base HTTP client with interceptors
2. **errorHandler.js** - Centralized error handling
3. **apiservice.js** - API endpoints organized by service

---

## 1. API Client (`apiClient.js`)

### Purpose
Centralized HTTP request handler with automatic token management and error handling.

### Key Features
- **Base Configuration**: Configured with base URL and timeout
- **Request Interceptor**: Automatically adds Bearer token to headers (excludes auth routes)
- **Response Interceptor**: Handles token expiration (401 errors)
- **Generic Request Handler**: `makeRequest()` function supports all HTTP methods

### Usage

```javascript
import { makeRequest } from "../api/apiClient";

// GET request
const data = await makeRequest("get", "/endpoint");

// POST request
const data = await makeRequest("post", "/endpoint", { key: "value" });

// PUT request
const data = await makeRequest("put", "/endpoint/id", { key: "newValue" });

// DELETE request
await makeRequest("delete", "/endpoint/id");

// GET with query parameters
const data = await makeRequest("get", "/endpoint", null, { 
  params: { userId: 123, organizationId: 456 } 
});
```

---

## 2. Error Handler (`errorHandler.js`)

### Purpose
Standardized error handling and user-friendly error messages.

### Key Features
- **ApiError Class**: Custom error object with statusCode and original error
- **General Error Handler**: Maps HTTP status codes to messages
- **Domain-Specific Handlers**: `authErrorHandler()`, `validationErrorHandler()`, `serverErrorHandler()`

### Error Status Code Mapping

| Status | Default Message |
|--------|-----------------|
| 400 | Invalid request. Please check your input. |
| 401 | Invalid credentials or session expired. |
| 403 | You don't have permission to access this resource. |
| 404 | Resource not found. |
| 423 | Your account is locked. Please contact support. |
| 429 | Too many requests. Please try again later. |
| 500 | Server error. Please try again later. |
| 503 | Service unavailable. Please try again later. |

### Usage

```javascript
import { authErrorHandler, validationErrorHandler } from "../api/errorHandler";

// In component try-catch block
try {
  const res = await authApi.login(credentials);
} catch (err) {
  // Auth-specific error handling
  setError(authErrorHandler(err));
}

try {
  const res = await userApi.add(orgId, userData);
} catch (err) {
  // Validation error handling
  setError(validationErrorHandler(err));
}
```

---

## 3. API Services (`apiservice.js`)

### Purpose
Organized API endpoints grouped by service/resource.

### Available Services

#### **AUTH SERVICE**
```javascript
import { authApi } from "../api/apiservice";

authApi.healthCheck()              // Health check
authApi.admin(data)                // Create admin user
authApi.login(data)                // Login
authApi.refreshToken(data)         // Refresh token
authApi.validate()                 // Validate current session
authApi.checkRoleName(username)    // Check user role
```

#### **USER SERVICE**
```javascript
import { userApi } from "../api/apiservice";

userApi.add(orgId, data)           // Add user to organization
userApi.getAll()                   // Get all users
userApi.getById(userId, orgId)     // Get user by ID
userApi.getByIdOrganization(orgId) // Get users by organization
userApi.update(id, data)           // Update user
userApi.delete(id)                 // Delete user
userApi.generateOtp(data)          // Generate OTP for password reset
userApi.verifyOtp(data)            // Verify OTP
userApi.setPassword(data)          // Set new password
```

#### **ORGANIZATION SERVICE**
```javascript
import { organizationApi } from "../api/apiservice";

organizationApi.getAll()           // Get all organizations
organizationApi.add(data)          // Add organization
organizationApi.getById(id)        // Get by ID
organizationApi.update(id, data)   // Update
organizationApi.delete(id)         // Delete
```

#### **SITE SERVICE**
```javascript
import { siteApi } from "../api/apiservice";

siteApi.getAll()                   // Get all sites
siteApi.add(data)                  // Add site
siteApi.getById(id)                // Get by ID
siteApi.update(id, data)           // Update
siteApi.delete(id)                 // Delete
```

#### **MENU SERVICE**
```javascript
import { menuApi } from "../api/apiservice";

menuApi.getAll()                   // Get all menus
menuApi.add(data)                  // Add menu
menuApi.getById(menuId)            // Get by ID
menuApi.getBySiteId(siteId)        // Get menus for a site
menuApi.update(id, data)           // Update
menuApi.delete(id)                 // Delete
```

#### **MENU CATEGORIES SERVICE**
```javascript
import { menuCatApi } from "../api/apiservice";

menuCatApi.getAll()                // Get all categories
menuCatApi.add(data)               // Add category
menuCatApi.getById(id)             // Get by ID
menuCatApi.update(id, data)        // Update
menuCatApi.delete(id)              // Delete
```

#### **MENU ITEMS SERVICE**
```javascript
import { menuitemsApi } from "../api/apiservice";

menuitemsApi.getAll()              // Get all items
menuitemsApi.add(data)             // Add item
menuitemsApi.getById(id)           // Get by ID
menuitemsApi.update(id, data)      // Update
menuitemsApi.delete(id)            // Delete
```

#### **ORDER SERVICE**
```javascript
import { orderApi } from "../api/apiservice";

orderApi.getAll()                  // Get all orders
orderApi.add(data)                 // Add order
orderApi.getById(id)               // Get by ID
orderApi.update(id, data)          // Update
orderApi.delete(id)                // Delete
```

#### **SCHEDULE SERVICE**
```javascript
import { scheduleApi } from "../api/apiservice";

scheduleApi.getAll()               // Get all schedules
scheduleApi.add(data)              // Add schedule
scheduleApi.getById(id)            // Get by ID
scheduleApi.update(id, data)       // Update
scheduleApi.delete(id)             // Delete
```

---

## Component Integration Example

### Before (Old Pattern)
```javascript
import axios from "axios";

const handleLogin = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:8088/api/auth/login", {
      identifier: email,
      password,
    });
    localStorage.setItem("token", res.data.accessToken);
    navigate("/dashboard");
  } catch (err) {
    if (!err.response) {
      setError("Network error");
    } else {
      switch (err.response.status) {
        case 401:
          setError("Invalid email or password");
          break;
        case 429:
          setError("Too many attempts");
          break;
        default:
          setError("Login failed");
      }
    }
  }
};
```

### After (New Pattern)
```javascript
import { authApi } from "../api/apiservice";
import { authErrorHandler } from "../api/errorHandler";

const handleLogin = async () => {
  try {
    const res = await authApi.login({
      identifier: email,
      password,
    });
    localStorage.setItem("token", res.accessToken);
    navigate("/dashboard");
  } catch (err) {
    setError(authErrorHandler(err));
  }
};
```

---

## Benefits

✅ **DRY (Don't Repeat Yourself)**
- Eliminates duplicate error handling code
- Single source of truth for API endpoints
- Consistent error message handling

✅ **Maintainability**
- Easy to update API base URL or interceptors
- Centralized token management
- Consistent error responses across the app

✅ **Scalability**
- Easy to add new services
- New developers can quickly understand the pattern
- Can easily add request/response logging, caching, etc.

✅ **Type Safety** (if using TypeScript)
- Services can be typed for better IDE support
- Catch errors at development time

---

## Token Management

Tokens are automatically managed by the API client:

1. **On Login**: Store token in localStorage
   ```javascript
   localStorage.setItem("token", res.accessToken);
   ```

2. **On Request**: Automatically added to headers (except auth routes)
   ```javascript
   Authorization: Bearer <token>
   ```

3. **On Expiration**: User is redirected to login
   ```javascript
   // Handled in apiClient.js response interceptor
   if (error.response?.status === 401) {
     localStorage.removeItem("token");
     window.location.href = "/";
   }
   ```

---

## Adding New Services

To add a new API service:

1. Create service object in `apiservice.js`:
```javascript
export const newFeatureApi = {
  getAll: () => makeRequest("get", "/new-feature"),
  add: (data) => makeRequest("post", "/new-feature", data),
  getById: (id) => makeRequest("get", `/new-feature/${id}`),
  update: (id, data) => makeRequest("put", `/new-feature/${id}`, data),
  delete: (id) => makeRequest("delete", `/new-feature/${id}`),
};
```

2. Use in component:
```javascript
import { newFeatureApi } from "../api/apiservice";
import { authErrorHandler } from "../api/errorHandler";

try {
  const data = await newFeatureApi.getAll();
} catch (err) {
  setError(authErrorHandler(err));
}
```

---

## Common Patterns

### Fetch and Display Data
```javascript
const [data, setData] = useState([]);
const [error, setError] = useState("");

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await userApi.getAll();
      setData(result);
    } catch (err) {
      setError(authErrorHandler(err));
    }
  };
  fetchData();
}, []);
```

### Form Submission with Loading
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleSubmit = async (formData) => {
  setLoading(true);
  setError("");
  
  try {
    await userApi.add(orgId, formData);
    // Success handling
  } catch (err) {
    setError(authErrorHandler(err));
  } finally {
    setLoading(false);
  }
};
```

---

## File Structure

```
src/
├── api/
│   ├── apiClient.js          # HTTP client & interceptors
│   ├── errorHandler.js       # Error handling & messages
│   └── apiservice.js         # API service definitions
├── components/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── ForgotPassword.jsx
│   ├── VerifyOtp.jsx
│   ├── Resetpass.jsx
│   └── dashboard/
│       ├── Dashboard.jsx
│       ├── Cart.jsx
│       └── ...
└── ...
```

---

## Updated Components

The following components have been updated to use the new API layer:

- ✅ Login.jsx
- ✅ Signup.jsx
- ✅ ForgotPassword.jsx
- ✅ VerifyOtp.jsx
- ✅ Resetpass.jsx

All other components can be gradually updated following the same pattern.

---

## Troubleshooting

### Token not persisting?
- Ensure token key is consistent: `"token"` (not `"Token"`)
- Check that localStorage is enabled

### 401 errors after token refresh?
- The apiClient automatically redirects to login on 401
- Clear browser storage and login again

### CORS errors?
- Verify backend is running on `http://127.0.0.1:8088`
- Check CORS headers on backend

---

## Next Steps

1. **Test the updated components** - Ensure all auth flows work
2. **Update remaining components** - Gradually refactor dashboard and other pages
3. **Add request/response logging** - Consider adding logging middleware
4. **Consider TypeScript** - Type the API services for better development experience
5. **Add retry logic** - Implement automatic retry for failed requests

