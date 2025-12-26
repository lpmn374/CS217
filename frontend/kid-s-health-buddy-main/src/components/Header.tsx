import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, History, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md">
            <Stethoscope className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">
              HFMD Diagnostic
            </h1>
            <p className="text-xs text-muted-foreground">
              Hệ thống chẩn đoán Tay Chân Miệng
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <NavLink to="/" icon={Home} label="Chẩn đoán" active={location.pathname === '/'} />
          <NavLink to="/history" icon={History} label="Lịch sử" active={location.pathname === '/history'} />
        </nav>
      </div>
    </header>
  );
}

function NavLink({ 
  to, 
  icon: Icon, 
  label, 
  active 
}: { 
  to: string; 
  icon: React.ComponentType<{ className?: string }>; 
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        active 
          ? "bg-primary text-primary-foreground shadow-md" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
