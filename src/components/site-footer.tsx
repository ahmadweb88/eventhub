import { Logo } from '@/components/brand/logo'

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
        <Logo tone="dark" />
        <p className="text-sm text-white/75">
          Weather by OpenWeatherMap and Open-Meteo · Maps © OpenStreetMap
          contributors
        </p>
      </div>
    </footer>
  )
}
