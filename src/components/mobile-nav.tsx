'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { siteConfig } from '@/config/site'

const linkClass =
  'flex h-11 items-center rounded-md px-3 font-semibold hover:bg-muted'

export function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
          />
        }
      >
        <Menu className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClass}
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <Link href="/login" className={linkClass} onClick={close}>
              Log in
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
