# ResultEase Architecture Documentation

## Overview

ResultEase follows **Clean Architecture** principles with strict separation of concerns, ensuring maintainability, testability, and future extensibility. The architecture is designed to be Firebase-ready while currently using mock implementations.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer (Next.js)                   │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐  │
│  │     Pages       │ │   Components    │ │   Layouts    │  │
│  │  - Marketing    │ │  - UI Library   │ │  - Header    │  │
│  │  - Upload       │ │  - Charts       │ │  - Footer    │  │
│  │  - Dashboard    │ │  - Tables       │ │              │  │
│  │  - Reports      │ │                 │ │              │  │
│  └─────────────────┘ └─────────────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐  │
│  │   Use Cases     │ │     Ports       │ │   Features   │  │
│  │ - Upload        │ │ - Auth          │ │ - Excel      │  │
│  │ - Analyze       │ │ - Storage       │ │ - Reports    │  │
│  │ - Generate      │ │ - Repository    │ │ - Analytics  │  │
│  └─────────────────┘ └─────────────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                            │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐  │
│  │    Entities     │ │ Value Objects   │ │   Services   │  │
│  │ - Student       │ │ - Marks         │ │ - Calculator │  │
│  │ - Subject       │ │ - Percentage    │ │ - Ranking    │  │
│  │ - Result        │ │                 │ │ - Analytics  │  │
│  └─────────────────┘ └─────────────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐  │
│  │ Mock Services   │ │ External APIs   │ │   Utilities  │  │
│  │ - Auth          │ │ - (Future)      │ │ - SEO        │  │
│  │ - Storage       │ │ - Firebase      │ │ - Constants  │  │
│  │ - Repository    │ │ - Payment       │ │ - Utils      │  │
│  └─────────────────┘ └─────────────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Domain Layer

### Entities

#### Student
```typescript
class Student {
  constructor(
    private name: string,
    private rollNumber: string,
    private className?: string,
    private section?: string
  )
}
```

**Responsibilities:**
- Represent a student with validation
- Provide display formatting
- Handle comparison operations

#### Subject
```typescript
class Subject {
  constructor(
    private name: string,
    private maxMarks: number = 100
  )
}
```

**Responsibilities:**
- Represent a subject with maximum marks
- Validate subject data
- Normalize subject names

#### Result
```typescript
class Result {
  constructor(
    id: string,
    title: string,
    subjects: Subject[],
    studentResults: StudentResult[] = []
  )
}
```

**Responsibilities:**
- Aggregate root for result data
- Manage student results collection
- Calculate rankings and statistics
- Export functionality

### Value Objects

#### Marks
```typescript
class Marks {
  constructor(marks: number, isTotal: boolean = false)
}
```

**Responsibilities:**
- Represent marks with validation (0-100 for individual, unlimited for totals)
- Provide grade calculation
- Handle mark arithmetic
- Immutable operations

#### Percentage
```typescript
class Percentage {
  constructor(percentage: number)
}
```

**Responsibilities:**
- Represent percentage with validation (0-100)
- Format display
- Performance categorization
- Grade calculation

### Domain Services

#### ResultCalculator
Pure functions for mathematical calculations:

```typescript
export class ResultCalculator {
  static calculateSubjectAverage(result: Result, subjectName: string): number
  static calculateClassAveragePercentage(result: Result): number
  static calculateSubjectStatistics(result: Result, subjectName: string): SubjectStats
  static calculateGradeDistribution(result: Result): GradeDistribution
}
```

#### RankingService
Pure functions for ranking and comparison:

```typescript
export class RankingService {
  static rankByPercentage(studentResults: StudentResult[]): RankedStudent[]
  static rankBySubject(studentResults: StudentResult[], subjectName: string): RankedStudent[]
  static calculatePercentile(studentResult: StudentResult, allResults: StudentResult[]): number
}
```

#### AnalyticsService
Pure functions for insights and analytics:

```typescript
export class AnalyticsService {
  static calculatePassFailRates(result: Result, passingMarks?: number): PassFailRates
  static identifyStrugglingStudents(result: Result): StrugglingStudent[]
  static generatePerformanceInsights(result: Result): PerformanceInsight[]
}
```

## Application Layer

### Use Cases

#### UploadResultUseCase
```typescript
class UploadResultUseCase {
  async execute(request: UploadRequest): Promise<UploadResponse> {
    // 1. Validate user and file
    // 2. Upload to storage
    // 3. Parse Excel data
    // 4. Return preview
  }
}
```

#### AnalyzeResultUseCase
```typescript
class AnalyzeResultUseCase {
  async execute(request: AnalyzeRequest): Promise<AnalysisResponse> {
    // 1. Create Result entity
    // 2. Apply calculations
    // 3. Generate rankings
    // 4. Prepare analysis data
  }
}
```

#### GenerateReportUseCase
```typescript
class GenerateReportUseCase {
  async execute(request: ReportRequest): Promise<ReportResponse> {
    // 1. Generate report data
    // 2. Save to repository
    // 3. Return report summary
  }
}
```

### Ports (Interfaces)

#### AuthPort
```typescript
interface AuthPort {
  signIn(email: string, password: string): Promise<User>
  signUp(userData: SignUpData): Promise<User>
  getCurrentUser(): Promise<User | null>
  signOut(): Promise<void>
}
```

#### StoragePort
```typescript
interface StoragePort {
  uploadFile(file: File, path: string): Promise<string>
  downloadFile(path: string): Promise<ArrayBuffer>
  deleteFile(path: string): Promise<void>
  getFileUrl(path: string): Promise<string>
}
```

#### ReportRepositoryPort
```typescript
interface ReportRepositoryPort {
  saveReport(report: ReportData): Promise<string>
  getReport(id: string): Promise<ReportData | null>
  listReports(userId: string): Promise<ReportSummary[]>
  deleteReport(id: string): Promise<void>
}
```

## Infrastructure Layer

### Mock Services

All infrastructure services are currently mocked for development and testing:

#### MockAuthService
```typescript
class MockAuthService implements AuthPort {
  private users = new Map<string, MockUser>()
  private sessions = new Map<string, string>()

  // Implements all AuthPort methods with in-memory storage
}
```

#### MockStorageService
```typescript
class MockStorageService implements StoragePort {
  private files = new Map<string, MockFileData>()

  // Implements all StoragePort methods with in-memory storage
}
```

#### MockReportRepository
```typescript
class MockReportRepository implements ReportRepositoryPort {
  private reports = new Map<string, MockReportData>()

  // Implements all ReportRepositoryPort methods with in-memory storage
}
```

### Features

#### Excel Processing
```typescript
// Client-side Excel parsing
class ExcelParser {
  static parseFile(file: File): Promise<ParsedData>
  static previewFile(file: File): Promise<PreviewData>
}

// Dynamic column mapping
class ColumnMapper {
  static autoMapColumns(headers: string[]): ColumnMapping
  static validateMappings(mappings: ColumnMapping): ValidationResult
}

// Data validation
class ValidationService {
  static validateData(data: RawData[]): ValidationResult
  static analyzeDataQuality(data: RawData[]): QualityReport
}
```

## UI Layer

### Pages (Next.js App Router)

```
app/
├── (marketing)/
│   └── page.tsx           # Landing page
├── dashboard/
│   └── page.tsx           # Dashboard
├── upload/
│   └── page.tsx           # File upload
├── reports/
│   └── [id]/page.tsx      # Report viewer
├── layout.tsx             # Root layout
├── globals.css            # Global styles
├── sitemap.ts             # SEO sitemap
└── robots.ts              # SEO robots.txt
```

### Components

#### UI Components (shadcn/ui based)
```
components/ui/
├── button.tsx
├── card.tsx
├── input.tsx
├── badge.tsx
├── progress.tsx
└── alert.tsx
```

#### Layout Components
```
components/layout/
├── Header.tsx             # Navigation header
└── Footer.tsx             # Site footer
```

#### Chart Components
```
components/charts/
├── BarChart.tsx           # Subject averages
├── PieChart.tsx           # Pass/fail distribution
├── LineChart.tsx          # Performance trends
└── AnalyticsDashboard.tsx # Complete dashboard
```

#### Table Components
```
components/tables/
└── DataTable.tsx          # Student rankings table
```

## Data Flow

### 1. File Upload Flow
```
User selects file → ExcelParser → ValidationService → Preview → ColumnMapper → ProcessedData
```

### 2. Analysis Flow
```
ProcessedData → Result Entity → Domain Services → Analysis Results → UI Components
```

### 3. Report Generation Flow
```
Analysis Results → ReportUseCase → ReportRepository → Report ID → Report Viewer
```

## Dependency Inversion

The architecture strictly follows dependency inversion:

1. **Domain Layer**: No dependencies on outer layers
2. **Application Layer**: Depends only on Domain, uses Ports for infrastructure
3. **Infrastructure Layer**: Implements Ports, depends on Application and Domain
4. **UI Layer**: Depends on Application layer through Use Cases

## Testing Strategy

### Unit Tests
- **Domain Services**: Pure functions, easy to test
- **Value Objects**: Validation and behavior testing
- **Use Cases**: Mock all ports/dependencies

### Integration Tests
- **Excel Processing**: File parsing and validation
- **UI Components**: User interaction flows

### Test Structure
```
tests/
├── domain/
│   ├── entities/
│   ├── services/
│   └── value-objects/
├── application/
│   └── use-cases/
└── features/
    └── excel/
```

## Future Firebase Integration

The architecture is designed for seamless Firebase integration:

### 1. Replace Mock Services
```typescript
// Replace MockAuthService
class FirebaseAuthService implements AuthPort {
  // Use Firebase Auth SDK
}

// Replace MockStorageService  
class FirebaseStorageService implements StoragePort {
  // Use Firebase Storage SDK
}

// Replace MockReportRepository
class FirestoreReportRepository implements ReportRepositoryPort {
  // Use Firestore SDK
}
```

### 2. No Changes Required
- Domain layer remains unchanged
- Application layer remains unchanged  
- UI components remain unchanged
- Only infrastructure implementations change

### 3. Configuration Update
```typescript
// Update dependency injection
const authService = new FirebaseAuthService()
const storageService = new FirebaseStorageService()
const reportRepository = new FirestoreReportRepository()
```

## Performance Considerations

### Client-Side Processing
- All Excel parsing happens in browser
- No server-side dependencies for core functionality
- Privacy-first approach

### Code Splitting
- Dynamic imports for heavy features
- Route-based splitting with Next.js
- Component-level splitting for charts

### Caching Strategy
- Static generation for marketing pages
- Client-side caching for processed data
- Browser storage for user preferences

## Security Considerations

### Data Privacy
- No data sent to servers during processing
- Local storage for temporary data only
- Clear data on session end

### Input Validation
- File type and size validation
- Data sanitization in Excel parser
- XSS prevention in UI components

### Error Handling
- Graceful degradation for unsupported files
- User-friendly error messages
- Comprehensive logging for debugging

## Scalability

### Horizontal Scaling
- Stateless architecture
- Client-side processing reduces server load
- CDN-friendly static assets

### Vertical Scaling
- Efficient algorithms in domain services
- Lazy loading for large datasets
- Pagination for result lists

### Future Enhancements
- Web Workers for heavy calculations
- IndexedDB for large file caching
- Service Worker for offline functionality

---

This architecture ensures **maintainability**, **testability**, and **extensibility** while following **SOLID principles** and **Clean Architecture** patterns.