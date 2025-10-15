# Setup Instructions

## 🔥 Firebase Authentication Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "resumate-app")
4. Enable Google Analytics (optional)
5. Wait for project creation to complete

### 2. Enable Authentication

1. In your Firebase project dashboard, click "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"
5. Enable **Google**:
   - Click on "Google"
   - Toggle "Enable"
   - Enter your project support email
   - Click "Save"

### 3. Register Your Web App

1. In project overview, click the web icon (`</>`)
2. Enter app nickname: "resumate-web"
3. ✅ Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the configuration object

### 4. Get Your Configuration

In Firebase Console > Project Settings > General > Your apps:
Copy these values to your `.env.local` file:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

### 5. Configure Authorized Domains

1. In Firebase Console > Authentication > Settings
2. Scroll to "Authorized domains"
3. Add your domains:
   - `localhost` (for development)
   - `your-domain.com` (for production)

### 6. Test Authentication

1. Restart your development server: `npm run dev`
2. Try signing up with email/password
3. Try signing in with Google
4. Check Firebase Console > Authentication > Users to see registered users

## 🚀 Production Deployment

- Add your production domain to Firebase authorized domains
- Update environment variables in your hosting platform
- Ensure HTTPS is enabled (required for Firebase Auth)

## 🔧 Troubleshooting

- **"Firebase config not found"**: Check your `.env.local` file
- **"Popup blocked"**: Allow popups in browser settings
- **"Unauthorized domain"**: Add domain to Firebase authorized domains
- **Network errors**: Check internet connection and Firebase status

## 🤖 Google Gemini AI Setup

### 1. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API key"
4. Choose "Create API key in new project" or select existing project
5. Copy your API key

### 2. Add to Environment Variables

Add to your `.env.local` file:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Features Enabled by Gemini AI

- ✅ AI-powered CV content generation
- ✅ Smart skill suggestions
- ✅ Professional summary writing
- ✅ Job description optimization
- ✅ Achievement bullet point generation

### 4. Usage

Once configured, the AI features will automatically activate:

- Look for the green "Gemini AI Ready" status in the CV builder
- Use the "Generate with AI" buttons throughout the form
- AI suggestions will appear in text fields

### 5. API Usage & Costs

- Gemini 1.5 Flash: Free tier available with generous limits
- Check [Google AI pricing](https://ai.google.dev/pricing) for current rates
- The app uses efficient prompting to minimize token usage

## 📁 Files Created/Modified

- `src/config/firebase.ts` - Firebase configuration
- `src/services/authService.ts` - Firebase authentication
- `src/utils/geminiService.ts` - Google Gemini AI integration
- `src/components/GeminiStatusIndicator.tsx` - AI status component
- `.env.local` - Environment variables (add your config here)
- `FIREBASE_SETUP.md` - This setup guide
