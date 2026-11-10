import type { Metadata } from 'next'
import { Sora, Source_Sans_3 } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import { siteConfig } from '@/config/site'
import './globals.css'

const heading = Sora({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-heading-src',
})
const body = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body-src',
})

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${heading.variable} ${body.variable}`}
    >
      <body className="bg-background text-foreground min-h-dvh font-sans antialiased">
        <a
          href="#main"
          className="focus:bg-background sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
