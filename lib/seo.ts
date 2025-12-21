import type { Metadata } from 'next'
import { APP_NAME, APP_DESCRIPTION, APP_URL } from './constants'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  noIndex?: boolean
  canonical?: string
  path?: string
}

export function generateMetadata({
  title,
  description = APP_DESCRIPTION,
  keywords = [],
  image = '/og-image.png',
  noIndex = false,
  canonical,
  path = '/'
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} - ${APP_DESCRIPTION}`
  const canonicalUrl = canonical || `${APP_URL}${path}`
  
  const defaultKeywords = [
    'school results',
    'result analysis',
    'educational software',
    'teacher tools',
    'student performance',
    'excel analysis',
    'academic reports',
    'grade calculator',
    'student assessment',
    'report card generator',
    'class performance',
    'academic analytics'
  ]

  const allKeywords = [...defaultKeywords, ...keywords]

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    authors: [{ name: 'ResultEase Team' }],
    creator: 'ResultEase',
    publisher: 'ResultEase',
    metadataBase: new URL(APP_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      siteName: APP_NAME,
      title: fullTitle,
      description,
      url: canonicalUrl,
      locale: 'en_US',
      images: [
        {
          url: `${APP_URL}${image}`,
          width: 1200,
          height: 630,
          alt: title || APP_NAME,
          type: 'image/png'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@resultease',
      creator: '@resultease',
      title: fullTitle,
      description,
      images: [`${APP_URL}${image}`]
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
      other: {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    },
    manifest: '/site.webmanifest',
    verification: {
      google: 'google-site-verification-code',
    },
  }
}

/**
 * Generate structured data (JSON-LD) for SEO
 */
export function generateStructuredData(type: 'Organization' | 'SoftwareApplication' | 'Article' | 'BreadcrumbList' | 'FAQPage', data?: any) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type
  }

  switch (type) {
    case 'Organization':
      return {
        ...baseData,
        name: APP_NAME,
        alternateName: 'Result Ease',
        url: APP_URL,
        logo: `${APP_URL}/logo.svg`,
        description: APP_DESCRIPTION,
        foundingDate: '2024',
        contactPoint: [{
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'support@resultease.app',
          availableLanguage: 'English'
        }],
        sameAs: [
          'https://twitter.com/resultease',
          'https://linkedin.com/company/resultease'
        ],
        ...data
      }

    case 'SoftwareApplication':
      return {
        ...baseData,
        name: APP_NAME,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web Browser',
        description: APP_DESCRIPTION,
        url: APP_URL,
        screenshot: `${APP_URL}/screenshot.jpg`,
        author: {
          '@type': 'Organization',
          name: APP_NAME
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '150',
          bestRating: '5',
          worstRating: '1'
        },
        featureList: [
          'Excel file upload and processing',
          'Automated result analysis',
          'Visual charts and reports',
          'Student ranking and statistics',
          'Pass/fail analysis',
          'Performance insights'
        ],
        ...data
      }

    case 'Article':
      return {
        ...baseData,
        headline: data?.title || APP_NAME,
        description: data?.description || APP_DESCRIPTION,
        image: data?.image || `${APP_URL}/og-image.png`,
        author: {
          '@type': 'Organization',
          name: APP_NAME
        },
        publisher: {
          '@type': 'Organization',
          name: APP_NAME,
          logo: {
            '@type': 'ImageObject',
            url: `${APP_URL}/logo.svg`
          }
        },
        datePublished: data?.datePublished || new Date().toISOString(),
        dateModified: data?.dateModified || new Date().toISOString(),
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data?.url || APP_URL
        },
        ...data
      }

    case 'BreadcrumbList':
      return {
        ...baseData,
        itemListElement: data?.items?.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        })) || []
      }

    case 'FAQPage':
      return {
        ...baseData,
        mainEntity: data?.questions?.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        })) || []
      }

    default:
      return baseData
  }
}

/**
 * Common SEO keywords for different page types
 */
export const SEO_KEYWORDS = {
  home: [
    'school result analysis',
    'excel result processor',
    'student grade calculator',
    'academic performance tracker',
    'result management system',
    'teacher tools online',
    'education analytics',
    'grade analysis software',
    'student assessment tool',
    'report card generator'
  ],
  upload: [
    'upload excel results',
    'process student marks',
    'excel to report converter',
    'grade file upload',
    'result file processor',
    'csv result analysis'
  ],
  reports: [
    'student performance report',
    'academic analysis dashboard',
    'grade distribution chart',
    'class performance summary',
    'result insights',
    'educational statistics'
  ],
  dashboard: [
    'result dashboard',
    'academic overview',
    'performance metrics',
    'education analytics dashboard',
    'student data visualization'
  ]
}

/**
 * Generate FAQ structured data for common questions
 */
export function getDefaultFAQs() {
  return {
    questions: [
      {
        question: "What file formats does ResultEase support?",
        answer: "ResultEase supports Excel files (.xlsx, .xls) and CSV files. You can upload result files containing student names, roll numbers, and subject marks for comprehensive analysis."
      },
      {
        question: "Is ResultEase free to use?",
        answer: "Yes, ResultEase is completely free to use. You can upload files, analyze results, generate reports, and export data without any cost or subscription."
      },
      {
        question: "How secure is my data on ResultEase?",
        answer: "All file processing is done client-side in your browser. Your data never leaves your device, ensuring complete privacy and security of student information."
      },
      {
        question: "Can I export the generated reports?",
        answer: "Yes, you can export your analysis reports as PDF or Excel files for easy sharing with school administration, parents, or other stakeholders."
      },
      {
        question: "What kind of analysis does ResultEase provide?",
        answer: "ResultEase provides comprehensive analysis including student rankings, subject-wise averages, pass/fail rates, grade distributions, performance insights, and visual charts."
      },
      {
        question: "Do I need to install any software to use ResultEase?",
        answer: "No installation required. ResultEase is a web-based application that works directly in your browser on any device - desktop, tablet, or mobile."
      }
    ]
  }
}
