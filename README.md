# ResultEase - School Result Analysis Made Simple

[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.18-38B2AC)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10.0-orange)](https://firebase.google.com/)
[![Jest](https://img.shields.io/badge/Jest-30.2.0-C21325)](https://jestjs.io/)

Transform your Excel result files into professional insights and visual reports instantly. Perfect for teachers, schools, and educational institutes.

## 🚀 Features

### Core Features
- **📊 Excel Upload & Processing**: Support for .xlsx, .xls, and .csv files with intelligent column detection
- **⚡ Instant Analysis**: Comprehensive insights in seconds with dense ranking algorithm
- **📈 Visual Reports**: Professional charts and graphs (Bar, Line, Pie charts)
- **🏆 Student Rankings**: Automatic dense ranking with intelligent tie-breaking
- **📋 Performance Insights**: Pass/fail rates, grade distributions, subject-wise analysis
- **💾 Report Saving**: Save reports to Firestore for future access
- **📄 PDF Export**: Export professional PDF reports
- **🔍 Search & Filter**: Search reports by title, students, or filename

### Authentication & User Management
- **🔐 Google Sign-In**: Secure authentication with Firebase Auth
- **👤 User Profiles**: Complete user profiles with organization details
- **👥 Member Management**: Owners can add and manage team members
- **🔑 Role-Based Access**: Owner and Member roles with appropriate permissions
- **📝 Onboarding Flow**: Smooth onboarding for Independent Creators and Institutes

### Organization Features
- **🏢 Organization Reports**: View all reports from organization members
- **👨‍💼 Multi-User Support**: Collaborate with team members
- **🔒 Secure Access**: View-only access for organization reports, full control for own reports

### Pricing & Plans
- **💰 Flexible Pricing**: Free, Go, and Premium tiers
- **📊 Dynamic Pricing**: Prices fetched from Firestore (secure and updatable)
- **🎯 Account Types**: Separate pricing for Independent Creators and Institutes
- **💳 Billing Options**: Monthly and Annual billing with savings

### Pages & Content
- **🏠 Home**: Beautiful landing page with features showcase
- **📊 Dashboard**: Personalized dashboard with stats and recent activity
- **💰 Pricing**: Transparent pricing with plan comparison
- **🎬 Demo**: Product demo with video showcase
- **📚 Documentation**: Complete setup and usage guides
- **❓ FAQ**: Comprehensive frequently asked questions
- **📞 Contact**: Contact form and support information
- **ℹ️ About**: Company information and mission
- **🔒 Privacy**: Detailed privacy policy
- **📜 Terms**: Terms of service
- **🍪 Cookies**: Cookie policy

### Technical Features
- **🔒 Privacy First**: Secure data handling with Firebase
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **🎨 Modern UI**: Clean, professional interface with Tailwind CSS
- **⚡ Performance**: Optimized for speed and efficiency
- **🔍 SEO Optimized**: Complete SEO implementation with structured data

## 🏗️ Architecture

This project follows **Clean Architecture** principles with strict separation of concerns:

```
├── app/                    # Next.js App Router pages
│   ├── (home)/            # Public pages (home, features, pricing, etc.)
│   ├── dashboard/          # User dashboard
│   ├── login/              # Authentication page
│   ├── onboarding/         # User onboarding flow
│   ├── upload/             # File upload and analysis
│   ├── reports/            # Reports listing and detail pages
│   ├── members/            # Member management (owners only)
│   └── profile/            # Profile editing
├── domain/                 # Business logic (entities, services, value objects)
├── application/            # Use cases and port interfaces
├── infrastructure/         # Firebase implementations
│   └── firebase/          # Firebase services and repositories
├── components/             # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── charts/            # Data visualization components
│   ├── layout/            # Header, Footer
│   ├── tables/            # Data tables
│   └── ui/                # shadcn/ui components
├── features/               # Feature-specific modules
│   ├── excel/             # Excel parsing and validation
│   └── export/            # PDF export functionality
├── lib/                    # Utilities and constants
│   ├── hooks/             # Custom React hooks
│   └── services/          # Business services (PricingService)
└── tests/                  # Unit tests
```

### Domain Layer
- **Entities**: `Student`, `Subject`, `Result`
- **Value Objects**: `Marks`, `Percentage`
- **Services**: `ResultCalculator`, `RankingService`, `AnalyticsService`

### Application Layer
- **Use Cases**: 
  - `UploadResultUseCase` - Handle file upload and parsing
  - `AnalyzeResultUseCase` - Perform result analysis
  - `GenerateReportUseCase` - Generate analysis reports
  - `GetPricingUseCase` - Fetch pricing data
- **Ports**: 
  - `AuthPort` - Authentication interface
  - `StoragePort` - File storage interface
  - `ReportRepositoryPort` - Report persistence interface
  - `PricingRepositoryPort` - Pricing data interface

### Infrastructure Layer
- **Firebase Services**: 
  - `FirebaseAuthService` - Google Sign-In authentication
  - `FirebaseUserRepository` - User profile management
  - `FirebaseReportRepository` - Report saving and retrieval
  - `FirebasePricingRepository` - Dynamic pricing management
- **Excel Processing**: Client-side parsing with SheetJS

## 🛠️ Tech Stack

### Core
- **Next.js 16.1.0** (App Router)
- **TypeScript** (Strict mode)
- **Tailwind CSS** + **shadcn/ui**
- **Firebase 11.10.0** (Auth, Firestore, Storage)
- **Recharts** (Data visualization)
- **SheetJS** (Excel processing)

### Testing
- **Jest** (Unit testing)
- **Testing Library** (Component testing)
- **>90% Coverage** target for domain logic

### SEO & Performance
- **Structured Data** (JSON-LD)
- **OpenGraph** tags
- **Sitemap** generation
- **Robots.txt**
- **PWA** ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd result-ease-mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

```bash
# Development
npm run dev          # Start development server (Turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

### Project Structure Highlights
- **Clean Architecture**: Strict separation of concerns
- **SOLID Principles**: Single Responsibility, Dependency Inversion
- **Type Safety**: Full TypeScript with strict mode
- **Error Handling**: Comprehensive error handling throughout
- **Security**: Firestore security rules, route protection
- **Performance**: Code splitting, caching, optimized queries

## 📊 File Format & Sample Data

### Supported File Formats
- **Excel**: `.xlsx`, `.xls`
- **CSV**: `.csv`
- **Column Mapping**: Intelligent auto-detection with manual override option

### File Structure Requirements
- **Required Columns**: Student Name, Roll Number, Subject columns with marks
- **First Row**: Should contain column headers
- **Data Format**: Marks should be numeric values
- **File Size**: Recommended up to 10MB for optimal performance

### Sample File Structure
A sample CSV file is included at `/public/sample-results.csv`:

| Student Name | Roll Number | Mathematics | Science | English | Social Studies | Hindi |
|--------------|-------------|-------------|---------|---------|----------------|-------|
| John Doe     | 001         | 85          | 78      | 92      | 88             | 76    |

The system automatically detects columns and allows manual mapping if needed.

## 🎯 Usage Guide

### 1. Getting Started
1. **Sign Up**: Click "Get Started Free" and sign in with Google
2. **Complete Onboarding**: Fill in your organization details
   - Choose account type: Independent Creator or Institute
   - Enter organization information
   - Select student range
3. **Access Dashboard**: View your personalized dashboard

### 2. Upload & Analyze Results
1. Navigate to `/upload` (or click "Upload New Results" in dashboard)
2. Select your Excel/CSV file (.xlsx, .xls, or .csv)
3. Preview the data and verify column mapping
4. Click "Start Analysis" (requires login for full analysis)
5. View comprehensive analysis results

### 3. View & Manage Reports
- **Dashboard**: View recent saved reports
- **Reports Page**: Browse all reports (own + organization)
- **Report Details**: View full analysis with charts and insights
- **Save Reports**: Save reports to Firestore for future access
- **Delete Reports**: Remove your own reports (organization reports are view-only)

### 4. Organization Collaboration
- **Add Members**: Owners can add team members by email
- **View Organization Reports**: See all reports from organization members
- **Role Management**: Owners have full control, members have view access

### 5. Export & Share
- **PDF Export**: Export professional PDF reports
- **Report Saving**: Save reports for future reference
- **Organization Sharing**: Share reports with team members

## 🧪 Testing

The project includes comprehensive unit tests for domain logic:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- ResultCalculator.test.ts
```

### Test Coverage
- **Domain Services**: >95% coverage
- **Value Objects**: 100% coverage
- **Use Cases**: >90% coverage

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# App Configuration
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=ResultEase
```

### Firebase Setup
1. **Create Firebase Project**: Go to [Firebase Console](https://console.firebase.google.com/)
2. **Enable Authentication**: Enable Google Sign-In provider
3. **Create Firestore Database**: Set up Firestore with the provided security rules
4. **Add Collections**:
   - `users` - User profiles (document ID: user email)
   - `plans` - Pricing plans (documents: `go-independent`, `go-institute`, `premium-independent`, `premium-institute`)
5. **Deploy Security Rules**: Copy `firestore.rules` to Firebase Console
6. **Add Environment Variables**: Add all `NEXT_PUBLIC_FIREBASE_*` variables to `.env.local`

## 🎨 Design System

### Colors
- **Primary**: School Blue (#2563eb)
- **Success**: Green (#16a34a)
- **Warning**: Orange (#ea580c)
- **Error**: Red (#dc2626)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Semibold weights
- **Body**: Regular weight

### Components
All components follow the **shadcn/ui** design system with custom school-friendly variants.

## 📈 SEO Features

### Meta Tags
- Title, description, keywords
- OpenGraph tags for social sharing
- Twitter Card support
- Canonical URLs

### Structured Data
- Organization schema
- SoftwareApplication schema
- FAQ schema
- Breadcrumb navigation

### Performance
- Image optimization
- Font optimization
- Code splitting
- Static generation where possible

## 🔒 Security & Privacy

### Authentication & Authorization
- **Firebase Authentication**: Secure Google Sign-In
- **Role-Based Access Control**: Owner and Member roles
- **Firestore Security Rules**: Enforced at database level
- **Route Protection**: Protected routes require authentication

### Data Security
- **Secure Storage**: User data stored in Firestore with encryption
- **Access Control**: Users can only access their own data and organization data
- **Report Privacy**: Reports are private to user/organization
- **Email-Based IDs**: User documents use email as ID for better tracking

### Data Validation
- **Input Sanitization**: All inputs are validated and sanitized
- **File Type Validation**: Only .xlsx, .xls, and .csv files accepted
- **Size Limits**: File size validation
- **Error Handling**: Comprehensive error handling throughout

### Privacy Features
- **Freemium Model**: Guests can preview files without login
- **Data Ownership**: Users own their data and reports
- **GDPR Compliant**: Privacy policy and data protection measures

## 🚀 Deployment

### Prerequisites
1. Firebase project configured
2. Firestore database created
3. Security rules deployed
4. Environment variables set

### Vercel Deployment (Recommended)
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Add Environment Variables**: Add all `NEXT_PUBLIC_FIREBASE_*` variables in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy
4. **Configure Firebase**: Add Vercel domain to Firebase Authorized Domains

### Firebase Setup Checklist
- [ ] Create Firebase project
- [ ] Enable Google Authentication
- [ ] Create Firestore database
- [ ] Deploy security rules (`firestore.rules`)
- [ ] Create `plans` collection with pricing documents
- [ ] Add environment variables to hosting platform
- [ ] Add domain to Firebase Authorized Domains

### Other Platforms
The app is a standard Next.js application and can be deployed to:
- **Netlify**: Add environment variables in Netlify dashboard
- **AWS Amplify**: Configure environment variables in Amplify console
- **Railway**: Add environment variables in Railway dashboard
- **Any Node.js hosting**: Standard Next.js deployment process

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes following the architecture
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Standard configuration
- **Prettier**: Code formatting
- **Clean Architecture**: Maintain layer separation

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/)

### Issues
Report issues on the GitHub repository with:
- Environment details
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 📱 Pages & Routes

### Public Pages
- `/` - Home/Landing page
- `/login` - Google Sign-In page
- `/features` - Features showcase
- `/pricing` - Pricing plans
- `/demo` - Product demo
- `/docs` - Documentation
- `/faq` - Frequently asked questions
- `/contact` - Contact form
- `/about` - About us
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/cookies` - Cookie policy

### Protected Pages (Require Authentication)
- `/dashboard` - User dashboard
- `/upload` - File upload (guests can preview, login required for analysis)
- `/reports` - All reports listing
- `/reports/[id]` - Report detail page
- `/members` - Member management (owners only)
- `/profile/edit` - Edit profile (owners only)

### Onboarding
- `/onboarding` - User onboarding flow (skipped for members)

## 🔐 Authentication Flow

1. **Sign In**: User clicks "Get Started Free" → Redirects to `/login`
2. **Google Auth**: User signs in with Google account
3. **Onboarding**: New users complete onboarding form
4. **Member Check**: System checks if user is a member → Skips onboarding if member
5. **Dashboard**: User redirected to dashboard

## 💾 Data Structure

### Firestore Collections

#### `users` Collection
- **Document ID**: User email (sanitized)
- **Fields**: 
  - Profile information (name, email, organization details)
  - Role (owner/member)
  - Members array (for owners)
  - Subscription tier
  - Onboarding status

#### `users/{email}/reports` Subcollection
- **Document ID**: Auto-generated report ID
- **Fields**:
  - Report metadata (title, createdAt, createdBy)
  - Complete report data (summary, charts, rankings, etc.)

#### `plans` Collection
- **Documents**: `go-independent`, `go-institute`, `premium-independent`, `premium-institute`
- **Fields**: `monthly` (number), `annual` (number)

## 🎨 UI Components

### Custom Components
- `GoogleAuthButton` - Google Sign-In button
- `UserAvatar` - User profile avatar with dropdown
- `Header` - Navigation header with auth state
- `Footer` - Site footer with links
- Charts: `BarChart`, `LineChart`, `PieChart`, `AnalyticsDashboard`
- `DataTable` - Student rankings table
- `PdfExporter` - PDF export functionality

### Design System
- **Colors**: School blue theme (#2563eb)
- **Components**: Based on shadcn/ui
- **Responsive**: Mobile-first design
- **Accessibility**: ARIA labels and keyboard navigation

## 🧪 Testing

### Test Coverage
- Domain services: ResultCalculator, RankingService, AnalyticsService
- Value objects: Marks, Percentage
- Clean architecture maintained in tests

### Running Tests
```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm test -- --coverage   # With coverage report
```

## 📚 Documentation

- **ARCHITECTURE.md**: Detailed architecture documentation
- **DEPLOYMENT.md**: Deployment guide and checklist
- **Code Comments**: Comprehensive inline documentation
- **TypeScript Types**: Self-documenting type definitions

## 🤝 Contributing

### Development Guidelines
1. Follow Clean Architecture principles
2. Maintain SOLID principles
3. Write tests for new features
4. Use TypeScript strict mode
5. Follow existing code patterns
6. Update documentation

### Code Style
- **TypeScript**: Strict mode, no `any` types
- **React**: Functional components with hooks
- **Naming**: Descriptive, camelCase for variables, PascalCase for components
- **Comments**: JSDoc comments for functions and classes

---

**ResultEase** - Making school result analysis simple, fast, and professional. 🚀
