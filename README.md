# ResultEase - School Result Analysis Made Simple

[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.18-38B2AC)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/Jest-30.2.0-C21325)](https://jestjs.io/)

Transform your Excel result files into professional insights and visual reports instantly. Perfect for teachers, schools, and educational institutes.

## 🚀 Features

- **📊 Excel Upload & Processing**: Support for .xlsx, .xls, and .csv files
- **⚡ Instant Analysis**: Comprehensive insights in seconds
- **📈 Visual Reports**: Professional charts and graphs
- **🏆 Student Rankings**: Automatic ranking with tie-breaking
- **📋 Performance Insights**: Pass/fail rates, grade distributions
- **🔒 Privacy First**: All processing done client-side
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🎨 School-Friendly UI**: Clean, professional interface

## 🏗️ Architecture

This project follows **Clean Architecture** principles with strict separation of concerns:

```
├── app/                    # Next.js App Router pages
├── domain/                 # Business logic (entities, services, value objects)
├── application/            # Use cases and port interfaces
├── infrastructure/         # Mock implementations (easily replaceable with Firebase)
├── components/             # Reusable UI components
├── features/               # Feature-specific modules
├── lib/                    # Utilities and constants
└── tests/                  # Unit tests
```

### Domain Layer
- **Entities**: `Student`, `Subject`, `Result`
- **Value Objects**: `Marks`, `Percentage`
- **Services**: `ResultCalculator`, `RankingService`, `AnalyticsService`

### Application Layer
- **Use Cases**: `UploadResultUseCase`, `AnalyzeResultUseCase`, `GenerateReportUseCase`
- **Ports**: `AuthPort`, `StoragePort`, `ReportRepositoryPort`

### Infrastructure Layer
- **Mock Services**: Ready for Firebase integration
- **Excel Processing**: Client-side parsing with SheetJS

## 🛠️ Tech Stack

### Core
- **Next.js 16.1.0** (App Router)
- **TypeScript** (Strict mode)
- **Tailwind CSS** + **shadcn/ui**
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
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

## 📊 Sample Data

A sample CSV file is included at `/public/sample-results.csv` with the following structure:

| Student Name | Roll Number | Class | Section | Mathematics | Science | English | Social Studies | Hindi |
|--------------|-------------|-------|---------|-------------|---------|---------|----------------|-------|
| John Doe     | 001         | 10    | A       | 85          | 78      | 92      | 88             | 76    |

### Supported File Formats

- **Excel**: `.xlsx`, `.xls`
- **CSV**: `.csv`
- **Column Mapping**: Flexible column mapping for different formats

## 🎯 Usage Guide

### 1. Upload Results
1. Navigate to `/upload`
2. Select your Excel/CSV file
3. Preview the data
4. Map columns if needed
5. Process the file

### 2. View Analysis
- **Summary Cards**: Total students, class average, pass rate
- **Charts**: Subject averages, grade distribution, pass/fail rates
- **Rankings**: Student performance rankings
- **Insights**: Performance recommendations

### 3. Export Reports
- **PDF Export**: Professional report format
- **Excel Export**: Detailed analysis data
- **Share**: Generate shareable links

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
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=ResultEase
```

### Firebase Integration (Future)
The architecture is designed for easy Firebase integration:

1. Replace mock services in `/infrastructure/mocks/`
2. Implement Firebase Auth, Storage, and Firestore
3. No changes needed in domain or UI layers

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

### Client-Side Processing
- All Excel processing happens in the browser
- No data sent to servers
- Complete privacy protection

### Data Validation
- Input sanitization
- File type validation
- Size limits
- Error handling

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
The app is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Any Node.js hosting

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

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic Excel processing
- ✅ Result analysis
- ✅ Visual reports
- ✅ SEO optimization

### Phase 2 (Future)
- 🔄 Firebase integration
- 🔄 User authentication
- 🔄 Multi-exam comparison
- 🔄 Advanced analytics

### Phase 3 (Future)
- 🔄 Institute management
- 🔄 Payment integration
- 🔄 API access
- 🔄 Mobile app

---

**ResultEase** - Making school result analysis simple, fast, and professional.
