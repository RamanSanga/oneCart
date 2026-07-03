# OneCart — Premium Luxury Fashion E-commerce Suite

A handcrafted, premium minimal fashion e-commerce application designed with a quiet luxury Scandinavian aesthetic. This repository contains the complete full-stack codebase (Frontend, Backend, and Admin panels) optimized for production handoff.

## 🧑‍💻 Technology Stack

- **Frontend**: Vite + React, Vanilla CSS variables, Tailwind utility tokens, Framer Motion (subtle, high-end transitions).
- **Backend**: Node.js + Express, MongoDB (Mongoose), ChromaDB Vector Database, local Xenova ONNX transformers (mean pooling embeddings), Gemini-2.5-flash LLM (RAG Shopping Assistant).
- **Services**: Cloudinary (Image management), Firebase (Auth & Google Sign-In), Razorpay (Payment gateway).

---

## 🛠️ Production Deployment & Client Handover Guide

### 1. Firebase "auth/unauthorized-domain" Resolution
When deploying the frontend to **Vercel** (e.g. `onecart.vercel.app`) or **Render**, Firebase will block Google Authentication pop-ups with an `auth/unauthorized-domain` error unless whitelisted.

**To resolve this:**
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project -> **Authentication** -> **Settings** -> **Authorized Domains**.
3. Click **Add Domain** and input your production URLs (e.g., `onecart-frontend-beige.vercel.app`, `onecart.vercel.app` or custom domains).

---

### 2. Vercel SPA Routing Resolution
Single Page Applications (SPAs) require client-side routing rewrites. To prevent `404 Not Found` errors when directly hitting subroutes (e.g., visiting `/collection` directly in the URL bar), we have included a custom rewrite rule in the Frontend:
- Located at [Frontend/vercel.json](file:///Users/raman/oneCart/Frontend/vercel.json)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
This forces Vercel to proxy all subroute hits back to `index.html`, allowing React Router to manage path changes.

---

### 3. Local Installation & Configuration

#### Prerequisites
- Node.js (v22.22.0 or higher recommended)
- MongoDB Database (URI)
- ChromaDB Instance running on port 8001
- Google Gemini API Key

#### Backend Environment Settings (`Backend/.env`)
Create a `.env` file in the `Backend` directory:
```env
PORT=4000
MONGO_URI="your_mongodb_connection_uri"
JWT_SECRET="your_secure_jwt_token"
GOOGLE_API_KEY="your_google_gemini_api_key"
CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_key"
CLOUDINARY_API_SECRET="your_cloudinary_secret"
RAZORPAY_KEY_ID="your_razorpay_key"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
```

#### Frontend Environment Settings (`Frontend/.env`)
Create a `.env` file in the `Frontend` directory:
```env
VITE_BACKEND_URL="http://localhost:4000"
VITE_FIREBASE_API_KEY="your_firebase_web_api_key"
```

---

### 4. Running the Complete Stack

1. **Start ChromaDB Server**:
   ```bash
   chroma run --host localhost --port 8001 --path ./chroma_data
   ```
2. **Start Backend Server**:
   ```bash
   cd Backend
   npm run dev
   ```
3. **Start Frontend Client**:
   ```bash
   cd Frontend
   npm run dev
   ```

---

## 🎨 Visual Brand Identity Guidelines
- **Color Palette**: Cream (`#F8F6F2`), White (`#FFFFFF`), Ink/Charcoal (`#0A0A0A`), Sand/Beige accents.
- **Typography**: Playfair Display (Serif header wordmarks) + Inter (Clean sans-serif body weights).
- **Transitions**: Keep Framer Motion durations low (0.2s - 0.4s) for snappy, lightweight feel.
- **Images**: Maintain high-end Scandinavian lookbook photography. Never repeat identical visual assets across multiple sections.

---

## 🏁 Handover Audit Checklist
- [x] Unreferenced backgrounds and placeholder video files purged (saved 180MB+ repo size).
- [x] Vite build passes with 0 warnings/errors.
- [x] Dynamic Lookbook Banners integrated into page catalog routes.
- [x] Dynamic campaign lifestyles added to product gallery thumbnail lists.
- [x] .npmrc configurations deployed to resolve Render/NPM peer dependency issues.
- [x] Mobile UI touch targets, image payloads, and fixed header scroll gaps resolved.
