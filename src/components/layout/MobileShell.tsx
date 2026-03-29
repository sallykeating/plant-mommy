import { NavLink, Outlet } from 'react-router-dom';
import { Home, TreePalm, CalendarDays, Settings, type LucideIcon } from 'lucide-react';

const navItems: { to: string; icon: LucideIcon; label: string }[] = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/plants', icon: TreePalm, label: 'My Jungle' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

function NavItem({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) {
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

export function MobileShell() {
  return (
    <div className="min-h-dvh flex flex-col bg-sage">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 bg-white/90 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-2px_16px_-4px_rgb(60_64_47/0.12)]" style={{ borderRadius: '1.5rem 1.5rem 0 0' }}>
        <div className="mx-auto flex h-[3.75rem] max-w-lg items-center justify-between gap-1 px-3 sm:px-4">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>
    </div>
  );
}
