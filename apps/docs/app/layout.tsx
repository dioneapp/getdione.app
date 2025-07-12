import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dione Docs',
  description: 'Documentation for Dione',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}