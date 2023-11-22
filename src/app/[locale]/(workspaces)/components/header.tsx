import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/images/logo.svg';
import { ThemeSwitcher } from '@/components/features/theme-switcher';
import { LocaleSwitcher } from '@/components/features/locale-switcher';
import { User } from './user';
import { HeaderSearch } from './header-search';
import { PanelLayout } from '@/components/layouts';

export function Header() {
  return (
    <header className="mb-4">
      <PanelLayout className="flex flex-wrap items-center justify-between gap-3 rounded-none sm:flex-nowrap">
        <Link
          href="/"
          className="order-1 flex shrink-0 items-end gap-2 text-[--surface-800] no-underline"
        >
          <Image
            className="hidden sm:block"
            src={logo}
            width={30}
            height={33}
            alt=""
          />
          <span className="relative top-[3px] font-coiny text-3xl">
            TeamTrail
          </span>
        </Link>
        <div className="order-4 flex w-full min-w-0 grow justify-end sm:order-2">
          <HeaderSearch />
        </div>
        <div className="order-3 flex shrink-0 items-center gap-3">
          <ThemeSwitcher rounded raised text />
          <LocaleSwitcher rounded raised text />
          <User />
        </div>
      </PanelLayout>
    </header>
  );
}
