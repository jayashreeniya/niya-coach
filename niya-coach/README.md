# NIYA Coach Application

## Prerequisites

- Node.js v20.11.1 or later
- npm (comes with Node.js)
- Firebase CLI
- A Firebase project (configured in Firebase Console)

## Initial Setup

1. **Install Node.js**
   ```powershell
   # Download and install Node.js v20.11.1 from:
   https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi
   ```

2. **Install Firebase Tools**
   ```powershell
   npm install -g firebase-tools
   ```

3. **Clone and Setup Project**
   ```powershell
   cd C:\Users\Hp\niya-coach\niya-coach
   npm install
   ```

4. **Firebase Login**
   ```powershell
   firebase login
   ```
   Use your credentials: jayashree.niyalife@gmail.com

5. **Environment Setup**
   Create a `.env` file in the project root with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

## Running the Application

1. **Start Local Development**
   ```powershell
   npm start
   ```
   This will run the app in development mode at [http://localhost:3000](http://localhost:3000)

2. **Start Firebase Emulators**
   ```powershell
   firebase emulators:start
   ```
   - Firebase Emulator UI: [http://localhost:4000](http://localhost:4000)
   - Authentication Emulator: [http://localhost:9099](http://localhost:9099)
   - Functions Emulator: [http://localhost:5001](http://localhost:5001)
   - Firestore Emulator: [http://localhost:8080](http://localhost:8080)
   - Hosting Emulator: [http://localhost:5000](http://localhost:5000)

## Testing

1. **User Authentication Testing**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Test user registration with email and password
   - Test user login with registered credentials
   - Test password reset functionality

2. **Chat Functionality Testing**
   - Start a new conversation
   - Send and receive messages
   - Test real-time updates
   - Verify message timestamps
   - Test file attachments (if implemented)

3. **Profile Management Testing**
   - Update user profile information
   - Change profile picture
   - Update notification settings

4. **Firebase Functions Testing**
   - Test message cleanup function
   - Verify logging of new messages
   - Check scheduled tasks execution

## Deployment

1. **Build the Application**
   ```powershell
   npm run build
   ```

2. **Deploy to Firebase**
   ```powershell
   firebase deploy
   ```

## Troubleshooting

1. **Node.js Version Issues**
   If you see version compatibility errors:
   ```powershell
   # Check Node.js version
   node --version
   
   # Should show v20.11.1 or later
   ```

2. **Firebase Login Issues**
   ```powershell
   # Force logout and login again
   firebase logout
   firebase login
   ```

3. **Build Errors**
   ```powershell
   # Clear npm cache and reinstall dependencies
   npm cache clean --force
   npm install
   ```

## Support

For any issues or questions, please contact:
- Email: jayashree.niyalife@gmail.com

## Security Notes

- Never commit the `.env` file to version control
- Keep Firebase Admin SDK private keys secure
- Regularly update dependencies for security patches 