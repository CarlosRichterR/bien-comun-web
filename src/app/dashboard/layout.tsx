'use client';

import { NavigationPanel } from '../../components/layout/NavigationPanel';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-background">
            <NavigationPanel onNavigate={(path) => {
                switch (path) {
                    case "/dashboard":
                        // setAppState("dashboard");
                        break;
                    case "/lists":
                        // setAppState("my-lists");
                        break;
                    case "/inbox":
                        break;
                    case "/profile":
                        // setAppState("profile");
                        break;
                    case "/logout":
                        // setIsLogoutModalOpen(true);
                        break;
                }
            }} />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}