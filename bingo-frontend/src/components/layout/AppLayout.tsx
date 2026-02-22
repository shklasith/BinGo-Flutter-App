import { Outlet, NavLink } from 'react-router-dom';
import { Home, MapPin, Camera, Trophy, User, type LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const NavItem = ({ to, icon: Icon, label }: { to: string, icon: LucideIcon, label: string }) => {
    return (
        <NavLink
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
                cn(
                    "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors duration-200",
                    isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
                )
            }
        >
            <Icon className="w-6 h-6 mb-1" />
            <span>{label}</span>
        </NavLink>
    );
};

export default function AppLayout() {
    return (
        <div className="flex flex-col h-[100dvh] w-full bg-white relative overflow-hidden">
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-20">
                <Outlet />
            </main>

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex justify-around items-center px-2 z-50 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] safe-area-bottom">
                <NavItem to="/" icon={Home} label="Home" />
                <NavItem to="/map" icon={MapPin} label="Map" />

                {/* Center Scan Button Area */}
                <div className="relative -top-6">
                    <NavLink
                        to="/scan"
                        className={({ isActive }) =>
                            cn(
                                "flex items-center justify-center w-14 h-14 rounded-full shadow-lg text-white transition-transform active:scale-95",
                                isActive ? "bg-primary-hover shadow-primary/40" : "bg-primary shadow-primary/30",
                            )
                        }
                    >
                        <Camera className="w-6 h-6" />
                    </NavLink>
                </div>

                <NavItem to="/leaderboard" icon={Trophy} label="Leader" />
                <NavItem to="/profile" icon={User} label="Profile" />
            </nav>
        </div>
    );
}
