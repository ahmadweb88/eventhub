import Link from 'next/link'
import { Logo } from '@/components/brand/logo'
import { buttonVariants } from '@/components/ui/button'
import { UserMenu } from '@/components/user-menu'
import { siteConfig } from '@/config/site'
import { getUser } from '@/lib/auth'

export async function SiteHeader() {
  const user = await getUser()

  return (
    <header className="bg-background shadow-header sticky top-0 z-40">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-5 md:px-8 lg:px-12">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={buttonVariants({ variant: 'ghost' })}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <UserMenu
              email={user.email ?? ''}
              name={user.user_metadata.full_name}
            />
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: 'ghost',
                  className: 'hidden sm:inline-flex',
                })}
              >
                Log in
              </Link>
              <Link href="/signup" className={buttonVariants()}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
