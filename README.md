# 🏛️ Legal Assistance Platform

A comprehensive AI-powered legal assistance platform for Indian law with lawyer recommendations, built with Next.js and Google Gemini AI.

## ✨ Features

- 🤖 **AI Legal Advice** - Powered by Google Gemini AI
- 🧑‍⚖️ **60+ Qualified Lawyers** - Across 20+ specializations
- 🔍 **Smart Lawyer Matching** - Based on legal query analysis
- 📱 **Responsive Design** - Works on all devices
- 🔐 **Firebase Authentication** - Secure user management
- 📄 **Pagination** - Professional lawyer directory browsing
- 🌍 **Multi-location** - Lawyers across major Indian cities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Google Gemini API key
- Firebase project (optional)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd legal_assi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables
```bash
# Required
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Firebase (Optional - for authentication)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional
MONGODB_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## 🧑‍⚖️ Legal Specializations

Our platform covers 20+ legal specializations:
- Property & Rental Law
- Criminal Law
- Family Law
- Business & Corporate Law
- Labor & Employment Law
- Tax Law
- Immigration Law
- Intellectual Property Law
- Personal Injury Law
- Banking & Finance Law
- Environmental Law
- Human Rights Law
- Cyber Law & Data Protection
- Medical Negligence Law
- Women Rights & Domestic Violence
- And more...

## 🌍 Locations Covered

- Delhi NCR
- Mumbai
- Bangalore
- Chennai
- Hyderabad
- Pune
- Kolkata
- Ahmedabad
- Jaipur
- Kochi
- And expanding...

## 📱 Usage

1. **Chat Interface** (`/chat`)
   - Ask legal questions in natural language
   - Get AI-powered legal advice
   - Receive lawyer recommendations based on your query

2. **Find Lawyers** (`/lawyers`)
   - Browse 60+ qualified lawyers
   - Filter by specialization, location, rating
   - Professional pagination (12 lawyers per page)
   - View detailed lawyer profiles

3. **Authentication** (`/login`)
   - Optional Firebase-based authentication
   - Enhanced features for registered users

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **AI**: Google Gemini AI, LangChain
- **Authentication**: Firebase Auth
- **Database**: MongoDB (optional), Local JSON data
- **Payments**: Razorpay (optional)
- **Deployment**: Vercel, Netlify, Railway

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### Build for Production
```bash
npm run build
npm start
```

## 📊 Statistics

- **60+ Lawyers** across diverse specializations
- **20+ Legal Categories** covered
- **10+ Major Cities** represented
- **4.4-4.9 Star** rated lawyers
- **₹1,500-₹6,000** consultation fee range

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact:
- Email: support@legalplatform.com
- Create an issue on GitHub

---

**Disclaimer**: This platform provides legal information for educational purposes only and does not constitute legal advice. Please consult with qualified lawyers for advice specific to your situation.
