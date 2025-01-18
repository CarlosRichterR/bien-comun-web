"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Gift, LogOut, Menu, X, Inbox } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image';
import Logo from '../../../public/assets/images/bc-2.jpg';
type AppState = "dashboard" | "my-lists" | "inbox" | "profile";

interface NavigationPanelProps {
    onNavigate: (path: string) => void;
}

export function NavigationPanel({ onNavigate }: NavigationPanelProps) {
    const [isPanelVisible, setIsPanelVisible] = useState(true)
    const [unreadNotifications, setUnreadNotifications] = useState(2)
    const [activeSection, setActiveSection] = useState<AppState | null>(null) // Track active section
    const router = useRouter()

    const togglePanel = () => setIsPanelVisible(!isPanelVisible)

    const handleNavigate = (path: string, section: AppState) => {
        setActiveSection(section) // Set active section
        onNavigate(path)
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden fixed top-4 left-4 z-50"
                onClick={togglePanel}
            >
                {isPanelVisible ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <nav className={cn(
                "flex flex-col space-y-2 p-4 bg-card border-r border-border h-full transition-all duration-300 ease-in-out w-64",
                isPanelVisible ? "translate-x-0" : "-translate-x-full",
                "fixed md:static top-0 left-0 h-full z-40"
            )}>
                <div className="flex flex-col space-y-2 mb-6">
                    <div className="flex items-center justify-center">
                        <Image
                            src={Logo}
                            alt="BC logo"
                            width={190}
                            height={160}
                            className="h-40 w-50 transition-all duration-300"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 italic text-center">Contribuir nunca fue tan fácil</p>
                </div>
                <Button
                    variant="ghost"
                    className={cn(
                        "flex items-center space-x-4 mb-6 p-2 rounded-lg w-full",
                        activeSection === "profile" ? "bg-primary/10" : ""
                    )}
                    onClick={() => handleNavigate("/profile", "profile")}
                >
                    <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar del usuario" />
                        <AvatarFallback>JP</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                        <p className="font-medium text-sm">Juan Pérez</p>
                        <p className="text-xs text-muted-foreground">juan@ejemplo.com</p>
                    </div>
                </Button>
                <Button
                    variant="ghost"
                    className={cn("w-full justify-start", activeSection === "dashboard" ? "bg-primary/10" : "")}
                    onClick={() => handleNavigate("/dashboard", "dashboard")}
                >
                    <Home className="mr-2 h-4 w-4" />
                    <span>Inicio</span>
                </Button>
                <Button
                    variant="ghost"
                    className={cn("w-full justify-start", activeSection === "my-lists" ? "bg-primary/10" : "")}
                    onClick={() => handleNavigate("/lists", "my-lists")}
                >
                    <Gift className="mr-2 h-4 w-4" />
                    <span>Mis Listas</span>
                </Button>
                <Button
                    variant="ghost"
                    className={cn("w-full justify-start relative", activeSection === "inbox" ? "bg-primary/10" : "")}
                    onClick={() => handleNavigate("/inbox", "inbox")}
                >
                    <Inbox className="mr-2 h-4 w-4" />
                    <span>Notificaciones</span>
                    {unreadNotifications > 0 && (
                        <Badge
                            variant="secondary"
                            className="absolute right-2"
                        >
                            {unreadNotifications}
                        </Badge>
                    )}
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigate("/logout", null)}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                </Button>
            </nav>
        </>
    )
}

