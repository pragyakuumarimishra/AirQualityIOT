import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'AirQuality IoT - Monitoring & Forecasting',
  description: 'Hybrid AI-IoT Community-Driven Air Quality Monitoring and Forecasting System',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1e40af" />
      </head>
      <body className="font-sans bg-gray-50 min-h-screen">
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
        <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-2">AirQuality IoT</h3>
                <p className="text-sm">Hybrid AI-IoT Community-Driven Air Quality Monitoring and Forecasting System</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Features</h3>
                <ul className="text-sm space-y-1">
                  <li>Real-time AQI Dashboard</li>
                  <li>Interactive Heatmap</li>
                  <li>AI Forecasting</li>
                  <li>Health Alerts</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Community</h3>
                <ul className="text-sm space-y-1">
                  <li>Citizen Science</li>
                  <li>Data Contributions</li>
                  <li>Gamification</li>
                  <li>Policy Dashboard</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
              <p>&copy; 2024 AirQuality IoT. Empowering communities with clean air data.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
