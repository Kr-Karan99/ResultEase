import { MetadataRoute } from 'next'
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: 'ResultEase',
    description: APP_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/result_ease_logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/result_ease_logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
