# Authentication Setup Guide

## Features Added

✅ Email/Password Sign Up
✅ Email/Password Sign In
✅ Google Sign In (Frontend ready)
✅ JWT Token Authentication
✅ User Session Management

## How to Use

### 1. Start the Backend Server
```bash
cd server
npm start
```

### 2. Start the Frontend
```bash
cd client
npm start
```

### 3. Sign Up / Sign In

Users can now:
- **Sign Up** with email and password at `/signup`
- **Sign In** with email and password at `/signin`
- View their profile in the navigation bar
- Sign out from the dropdown menu

## API Endpoints

### Sign Up
```
POST /api/auth/signup
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Sign In
```
POST /api/auth/signin
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```

### Google Sign In (Optional - Requires Setup)
```
POST /api/auth/google-signin
Body: {
  "email": "john@gmail.com",
  "name": "John Doe",
  "googleId": "google-user-id"
}
```

## Google OAuth Setup (Optional)

To enable Google Sign In, you need to:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000`
   - `http://localhost:5000/api/auth/google/callback`

6. Install Google OAuth package:
```bash
cd client
npm install @react-oauth/google
```

7. Add Google Client ID to your `.env` file:
```
GOOGLE_CLIENT_ID=your-google-client-id
```

## Security Notes

- Change `JWT_SECRET` in production (add to `.env` file)
- Passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- Store tokens securely in localStorage

## Testing

Try creating an account:
1. Go to http://localhost:3000/signup
2. Fill in your details
3. Click "Sign Up"
4. You'll be redirected to products page
5. Your name will appear in the navigation bar
