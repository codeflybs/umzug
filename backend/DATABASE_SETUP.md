# Database & Filesystem Setup Summary

## 📋 `init_db.py` Script Summary

This script initializes the MongoDB database with essential default data required for the application to function.

### What it Creates:

#### 1. **Admin User** (`users` collection)
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@gelbe-umzuege.ch`
- **Role:** `admin`
- **Status:** Active
- **Note:** The server also creates a default admin on startup if none exists (fallback)

#### 2. **Company Settings** (`company_settings` collection)
- **Document ID:** `"company_settings"` (single document)
- **Fields:**
  - `companyName`: "Umzug UNIT GmbH"
  - `logo`: "/uploads/logo.png" (path reference)
  - `addresses`: Array of company addresses (hauptsitz + branch)
  - `theme`: Color scheme (primary, secondary, accent)
  - `defaultLanguage`: "de"
  - `supportedLanguages`: ["de", "en", "fr", "it"]
  - `tax`: Tax configuration (enabled, rate: 7.7%, label: "MwSt")
  - `email`: SMTP settings for email sending

#### 3. **Service Categories** (`service_categories` collection)
Three default categories:
- **Umzug** (Moving) - Custom pricing, hourly rate: 120 CHF
- **Möbeltransport** (Furniture Transport) - Hourly pricing, rate: 80 CHF
- **Reinigung** (Cleaning) - Fixed pricing, base: 900 CHF

#### 4. **Additional Services** (`additional_services` collection)
Three default services for "umzug" category:
- **Cleaning** - Fixed price: 900 CHF
- **Disposal** - Fixed price: 250 CHF
- **Packing Service** - Hourly rate: 50 CHF

---

## 💾 Database Information

### MongoDB Connection
- **Environment Variable:** `MONGO_URL`
- **Default (Docker):** `mongodb://mongo:27017`
- **Default (Local):** `mongodb://localhost:27017`
- **Database Name:** Set via `DB_NAME` env variable (default: `umzug`)

### Collections Created:
1. `users` - User accounts (admin, customers)
2. `company_settings` - Single document with all company configuration
3. `service_categories` - Service category definitions
4. `additional_services` - Additional services offered
5. `customers` - Customer records (created via API)
6. `offers` - Offer/quotation documents (created via API)
7. `invoices` - Invoice documents (created via API)

---

## 📁 Filesystem Information

### Upload Directory Structure

#### Docker Deployment:
```
Container Path: /app/backend/uploads
Host Path: ./backend/uploads (mounted volume)
```

#### Local Development:
```
Path: ./backend/uploads (relative to backend directory)
```

### Current Issues Identified:

1. **Path Mismatch in `settings.py`:**
   - Uses hardcoded `/app/backend/uploads` (Docker path)
   - This breaks in local development where paths differ
   - **Solution:** Use relative path based on `ROOT_DIR` like `server.py` does

2. **Upload Directory Not Created Automatically:**
   - `settings.py` creates directory with `os.makedirs()`, but path might be wrong
   - `server.py` creates it correctly with `Path.mkdir()`

3. **Static File Serving:**
   - Files saved to: `/app/backend/uploads/` (Docker) or `./backend/uploads/` (local)
   - Files served from: `/uploads/` URL path
   - Nginx proxies `/uploads/` → `http://backend:8000/uploads/`

---

## 🚨 Current Problems

### Problem 1: Cannot Login Without Running `init_db.py`
**Root Cause:** 
- Admin user creation has a fallback in `server.py` (`ensure_default_admin_user()`), BUT
- `company_settings` document doesn't exist, which might cause API errors
- Service categories and additional services are missing

**Solution:**
- Run `init_db.py` once after database setup
- OR: Make the API more resilient to missing company_settings

### Problem 2: Logo Upload Not Working
**Root Causes:**
1. **Path Mismatch:** `settings.py` uses `/app/backend/uploads` (Docker), but this might not match the actual filesystem
2. **Directory Permissions:** Upload directory might not have write permissions
3. **Volume Mount:** Docker volume mount might not be working correctly

**Solution:**
- Use consistent path resolution like `server.py` does
- Ensure directory is created with correct permissions
- Verify Docker volume mount is working

---

## 🔧 Recommended Fixes

### ✅ 1. **Standardize Upload Directory Path** - COMPLETED
- ✅ Uses `ROOT_DIR / "uploads"` consistently in `settings.py` (same as `server.py`)
- ✅ Works in both Docker and local development
- ✅ Path resolution is now relative and cross-platform compatible

### ✅ 2. **Auto-Initialize Database** - COMPLETED
- ✅ Added `ensure_company_settings()` function in `server.py`
- ✅ Server automatically creates minimal company settings on startup if missing
- ✅ Server automatically creates admin user on startup if missing (was already implemented)
- ✅ Application can now start without requiring manual `init_db.py` execution

### ✅ 3. **Path Validation** - COMPLETED
- ✅ Added `validate_upload_directory()` function that:
  - Checks if directory exists
  - Verifies it's actually a directory (not a file)
  - Tests write permissions by creating/deleting a test file
  - Provides detailed error messages
- ✅ Validation runs before every upload/delete operation
- ✅ Comprehensive logging added:
  - Upload directory path on module load
  - File details on upload (name, size, type)
  - Actual save path
  - Delete operations

---

## 📝 How to Run `init_db.py`

### Local Development:
```bash
cd backend
python init_db.py
```

### Docker:
```bash
docker-compose exec backend python backend/init_db.py
```

### Or manually in container:
```bash
docker-compose exec backend bash
cd /app/backend
python init_db.py
```

---

## ✅ Verification Steps

After running `init_db.py`, verify:

1. **Admin User:**
   ```bash
   # Test login via API
   curl -X POST http://localhost:8001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

2. **Company Settings:**
   ```bash
   curl http://localhost:8001/api/settings/company
   ```

3. **Upload Directory:**
   ```bash
   # In Docker
   docker-compose exec backend ls -la /app/backend/uploads
   
   # Local
   ls -la backend/uploads
   ```

4. **Logo Upload Test:**
   - Login to admin panel
   - Try uploading a logo
   - Check if file appears in uploads directory
   - Verify file is accessible via `/uploads/` URL

