# Multi-Service Offerte System - Technical Contracts

## 🎯 System Overview
Multi-purpose service quotation system supporting:
- Umzug (Moving)
- Möbeltransport (Furniture Transport)
- Handy Reparatur (Phone Repair)
- Reinigung (Cleaning)
- Entsorgung (Disposal)

## 📊 Database Schema (MongoDB)

### 1. Company Settings
```json
{
  "_id": "company_settings",
  "companyName": "Gelbe-Umzüge",
  "logo": "/uploads/logo.png",
  "addresses": [
    {
      "type": "hauptsitz",
      "street": "Sandstrasse 5",
      "city": "Schönbühl",
      "zipCode": "3322",
      "country": "CH",
      "phone": "031 557 24 31",
      "email": "info@gelbe-umzuege.ch",
      "website": "www.gelbe-umzuege.ch"
    }
  ],
  "theme": {
    "primaryColor": "#EAB308",
    "secondaryColor": "#000000",
    "accentColor": "#FFFFFF"
  },
  "defaultLanguage": "de",
  "supportedLanguages": ["de", "en", "fr", "it"],
  "tax": {
    "enabled": true,
    "rate": 7.7,
    "label": "MwSt"
  },
  "email": {
    "smtpHost": "smtp.gmail.com",
    "smtpPort": 587,
    "smtpUser": "admin@company.com",
    "smtpPassword": "encrypted",
    "fromEmail": "noreply@company.com",
    "fromName": "Gelbe-Umzüge"
  }
}
```

### 2. Service Categories
```json
{
  "_id": "ObjectId",
  "categoryId": "umzug",
  "name": {
    "de": "Umzug",
    "en": "Moving",
    "fr": "Déménagement",
    "it": "Trasloco"
  },
  "description": {
    "de": "Professioneller Umzugsservice",
    "en": "Professional moving service",
    "fr": "Service de déménagement professionnel",
    "it": "Servizio di trasloco professionale"
  },
  "icon": "package",
  "active": true,
  "pricingModel": "custom",
  "basePrice": 0,
  "hourlyRate": 120,
  "formFields": [
    "currentAddress",
    "newAddress",
    "floor",
    "elevator",
    "movingDate",
    "startTime",
    "object",
    "workers",
    "trucks"
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 3. Additional Services (Zusatzleistungen)
```json
{
  "_id": "ObjectId",
  "serviceId": "cleaning",
  "categoryId": "umzug",
  "name": {
    "de": "Reinigung",
    "en": "Cleaning",
    "fr": "Nettoyage",
    "it": "Pulizia"
  },
  "description": {
    "de": "Professionelle Endreinigung",
    "en": "Professional final cleaning",
    "fr": "Nettoyage final professionnel",
    "it": "Pulizia finale professionale"
  },
  "price": 900.00,
  "priceType": "fixed",
  "hourlyRate": 80,
  "active": true,
  "order": 1
}
```

### 4. Service Packages (Kombi-Pakete)
```json
{
  "_id": "ObjectId",
  "packageId": "umzug_cleaning_combo",
  "name": {
    "de": "Umzug + Reinigung Paket",
    "en": "Moving + Cleaning Package",
    "fr": "Forfait Déménagement + Nettoyage",
    "it": "Pacchetto Trasloco + Pulizia"
  },
  "services": ["umzug", "cleaning"],
  "discount": 10,
  "discountType": "percentage",
  "active": true
}
```

### 5. Offers (Offerten)
```json
{
  "_id": "ObjectId",
  "offerNumber": "10088",
  "customerId": "ObjectId (optional)",
  "status": "draft|sent|accepted|rejected",
  "category": "umzug",
  "language": "de",
  "customer": {
    "salutation": "Herr",
    "firstName": "Thomas",
    "lastName": "Mueller",
    "email": "thomas@email.ch",
    "phone": "078 123 45 67"
  },
  "currentLocation": {
    "street": "Hauptstrasse 42",
    "zipCode": "CH-4132",
    "city": "Muttenz",
    "floor": 2,
    "hasElevator": false,
    "distance": 0
  },
  "newLocation": {
    "street": "Mühackerstrasse 82",
    "zipCode": "CH-4132",
    "city": "Muttenz",
    "floor": 0,
    "hasElevator": false,
    "distance": 0
  },
  "serviceDetails": {
    "movingDate": "2025-01-25",
    "startTime": "08:00",
    "cleaningDate": null,
    "cleaningStartTime": null,
    "object": "2.5 Zimmer-Wohnung, 56m²",
    "workers": 4,
    "trucks": 1,
    "boxes": 20,
    "assembly": true
  },
  "additionalServices": [
    {
      "serviceId": "cleaning",
      "selected": true,
      "price": 900.00
    }
  ],
  "pricing": {
    "basePrice": 1500.00,
    "additionalServicesTotal": 900.00,
    "subtotal": 2400.00,
    "discount": 0,
    "discountType": "percentage",
    "taxRate": 7.7,
    "taxAmount": 184.80,
    "total": 2584.80,
    "currency": "CHF",
    "includeTax": false
  },
  "notes": "Kunde bevorzugt frühen Start",
  "pdfUrl": "/uploads/offers/offer_10088.pdf",
  "emailSent": true,
  "emailSentAt": "2024-01-15T10:30:00Z",
  "contactPerson": "Herr Minerva Marco",
  "createdBy": "admin_user_id",
  "createdAt": "2024-01-15T09:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### 6. Users (Admin/Staff)
```json
{
  "_id": "ObjectId",
  "username": "admin",
  "email": "admin@company.ch",
  "passwordHash": "bcrypt_hash",
  "name": "Administrator",
  "role": "admin|staff",
  "active": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "lastLogin": "2024-01-15T09:00:00Z"
}
```

### 7. Translations (i18n)
```json
{
  "_id": "ObjectId",
  "key": "offer.title",
  "translations": {
    "de": "Umzugs-Offerte",
    "en": "Moving Quote",
    "fr": "Devis de déménagement",
    "it": "Preventivo trasloco"
  }
}
```

## 🔌 Backend API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Company Settings
- `GET /api/settings/company` - Get company settings
- `PUT /api/settings/company` - Update company settings
- `POST /api/settings/logo` - Upload logo
- `PUT /api/settings/theme` - Update theme colors
- `PUT /api/settings/tax` - Update tax settings
- `PUT /api/settings/email` - Update email settings

### Service Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category details
- `POST /api/categories` - Create new category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Additional Services
- `GET /api/services` - List all additional services
- `GET /api/services/category/:categoryId` - Get services by category
- `POST /api/services` - Create additional service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Service Packages
- `GET /api/packages` - List all packages
- `POST /api/packages` - Create package (admin)
- `PUT /api/packages/:id` - Update package (admin)
- `DELETE /api/packages/:id` - Delete package (admin)

### Offers
- `GET /api/offers` - List offers (with filters)
- `GET /api/offers/:id` - Get offer details
- `POST /api/offers` - Create new offer
- `PUT /api/offers/:id` - Update offer
- `DELETE /api/offers/:id` - Delete offer
- `POST /api/offers/:id/calculate` - Calculate pricing
- `POST /api/offers/:id/generate-pdf` - Generate PDF
- `POST /api/offers/:id/send-email` - Send offer via email
- `GET /api/offers/next-number` - Get next offer number

### Translations
- `GET /api/translations` - Get all translations
- `GET /api/translations/:lang` - Get translations for language
- `PUT /api/translations/:key` - Update translation (admin)

### Statistics (Admin)
- `GET /api/statistics/dashboard` - Dashboard statistics
- `GET /api/statistics/revenue` - Revenue statistics
- `GET /api/statistics/categories` - Category-wise statistics

## 🎨 Frontend Components

### Public Pages
1. **Landing Page** - Service selection
2. **Offer Request Form** - Dynamic form based on category
3. **Offer Preview** - PDF preview before submission

### Admin Pages
1. **Dashboard** - Statistics and overview
2. **Company Settings** - Company info, logo, theme
3. **Service Categories** - Manage categories
4. **Additional Services** - Manage Zusatzleistungen
5. **Service Packages** - Manage combo packages
6. **Offers Management** - CRUD for offers
7. **Translations** - Multi-language management
8. **Settings** - Tax, email, general settings

## 🔄 Frontend-Backend Integration

### Current Mock Data (to be replaced)
- `/app/frontend/src/data/mock.js` → API calls

### New API Service Layer
- `/app/frontend/src/services/api.js` - Axios instance
- `/app/frontend/src/services/companyService.js`
- `/app/frontend/src/services/categoryService.js`
- `/app/frontend/src/services/offerService.js`
- `/app/frontend/src/services/serviceService.js`
- `/app/frontend/src/services/translationService.js`

### State Management
- React Context for global state
- Settings Context (company, theme)
- Language Context (i18n)
- Auth Context (existing)

## 📄 PDF Generation

### Technology: WeasyPrint (Python)
- HTML → PDF conversion
- Multi-language support
- Custom styling (company theme colors)

### PDF Template Structure
```html
<!-- Header with logo and company info -->
<!-- Customer and offer details -->
<!-- Service details table -->
<!-- Additional services -->
<!-- Pricing breakdown (with/without tax) -->
<!-- Terms and conditions (translated) -->
<!-- Footer with signature area -->
```

## 📧 Email System

### Email Templates (Multi-language)
- Offer created notification
- Offer sent to customer
- Offer accepted notification
- Offer rejected notification

### Email Service
- SMTP configuration from settings
- HTML email templates
- PDF attachment
- Queue system for bulk emails

## 🌍 Multi-language (i18n)

### Frontend
- `react-i18next` library
- Language switcher component
- Translation files: `/public/locales/{lang}/translation.json`
- Auto-detect browser language or manual selection

### Backend
- Translation keys in database
- API endpoint to fetch translations
- PDF generation uses translations

### Supported Languages
- 🇩🇪 Deutsch (de)
- 🇬🇧 English (en)
- 🇫🇷 Français (fr)
- 🇮🇹 Italiano (it)

## 🎨 Theme System

### Admin Configurable Colors
- Primary Color (default: #EAB308 - Yellow)
- Secondary Color (default: #000000 - Black)
- Accent Color (default: #FFFFFF - White)

### CSS Variables
```css
:root {
  --color-primary: var(--admin-primary);
  --color-secondary: var(--admin-secondary);
  --color-accent: var(--admin-accent);
}
```

## 🔐 Security

### Authentication
- JWT tokens
- Bcrypt password hashing
- Role-based access control (Admin, Staff)

### File Upload
- Whitelist file types
- Size limits
- Sanitize filenames
- Store in `/app/backend/uploads/`

### GDPR Compliance
- Data export functionality
- Data deletion
- Privacy policy acceptance
- Cookie consent

## 🚀 Implementation Phases

### Phase 1: Backend Foundation (Current)
✅ MongoDB setup
✅ Basic API structure
⏳ Company settings API
⏳ Service categories API
⏳ Offers CRUD API

### Phase 2: Admin Panel Enhancement
⏳ Company settings UI
⏳ Theme color picker
⏳ Service category management
⏳ Additional services management
⏳ Translation management

### Phase 3: Dynamic Frontend
⏳ Category-based form rendering
⏳ Multi-language support
⏳ Theme integration
⏳ Price calculator

### Phase 4: PDF & Email
⏳ WeasyPrint integration
⏳ PDF template system
⏳ Email configuration
⏳ SMTP integration

### Phase 5: Advanced Features
⏳ Package management
⏳ Discount system
⏳ Statistics dashboard
⏳ API documentation

## 📝 Notes

### Current System (to be migrated)
- LocalStorage → MongoDB
- Mock data → API calls
- Static colors → Dynamic theme
- Single language → Multi-language
- Basic PDF → Advanced PDF with translations

### File Structure
```
/app
├── backend/
│   ├── server.py (main FastAPI app)
│   ├── models/ (MongoDB models)
│   ├── routes/ (API endpoints)
│   ├── services/ (business logic)
│   ├── utils/ (helpers, PDF, email)
│   └── uploads/ (logos, PDFs)
├── frontend/
│   ├── src/
│   │   ├── components/ (UI components)
│   │   ├── pages/ (page components)
│   │   ├── services/ (API services)
│   │   ├── context/ (React contexts)
│   │   ├── hooks/ (custom hooks)
│   │   └── i18n/ (translations)
└── contracts.md (this file)
```
