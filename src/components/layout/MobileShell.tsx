import { NavLink, Outlet } from 'react-router-dom';
import { Home, TreePalm, CalendarDays, Settings, Leaf, type LucideIcon } from 'lucide-react';

const navItems: { to: string; icon: LucideIcon; label: string }[] = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/plants', icon: TreePalm, label: 'My Jungle' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

function MobileNavItem({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) {
  return (
    <NavLink to={to} className="flex min-w-0 flex-1 justify-center outline-none focus-visible:ring-2 focus-visible:ring-forest/30 rounded-2xl">
      {({ isActive }) => (
        <span
          className={`flex min-w-[3.5rem] flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-1.5 transition-all duration-200 ease-out ${
            isActive
              ? 'bg-forest text-cream'
              : 'text-forest/50 hover:text-forest/80 active:scale-[0.97]'
          }`}
        >
          <Icon size={20} strokeWidth={isActive ? 2.25 : 1.65} className="shrink-0" />
          <span
            className={`max-w-full truncate text-[10px] tracking-wide ${isActive ? 'font-semibold' : 'font-medium'}`}
          >
            {label}
          </span>
        </span>
      )}
    </NavLink>
  );
}

function SidebarNavItem({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) {
  return (
    <NavLink
      to={to}
      className="group flex items-center outline-none focus-visible:ring-2 focus-visible:ring-forest/30 rounded-2xl"
    >
      {({ isActive }) => (
        <span
          className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ease-out ${
            isActive
              ? 'bg-forest text-cream'
              : 'text-forest/60 hover:bg-forest/8 hover:text-forest'
          }`}
        >
          <Icon size={20} strokeWidth={isActive ? 2.25 : 1.65} className="shrink-0" />
          <span className={`text-sm tracking-wide ${isActive ? 'font-semibold' : 'font-medium'}`}>
            {label}
          </span>
        </span>
      )}
    </NavLink>
  );
}

export function MobileShell() {
  return (
    <div className="min-h-dvh flex bg-sage">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:border-r lg:border-forest/10 lg:bg-white/80 lg:backdrop-blur-xl">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-cream">
            <Leaf size={18} strokeWidth={2} />
          </div>
          <span className="font-display text-lg font-bold text-forest">Plant Mommy</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-4 pt-2">
          {navItems.map((item) => (
            <SidebarNavItem key={item.to} {...item} />
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 bg-white/90 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-2px_16px_-4px_rgb(60_64_47/0.12)] lg:hidden" style={{ borderRadius: '1.5rem 1.5rem 0 0' }}>
          <div className="mx-auto flex h-[3.75rem] max-w-lg items-center justify-between gap-1 px-3 sm:px-4">
            {navItems.map((item) => (
              <MobileNavItem key={item.to} {...item} />
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
