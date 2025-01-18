"use client"

import { useState } from "react"
import { LandingPage } from "./LandingPage"
import { LoginPage } from "./auth/LoginPage"
import Dashboard from "./Dashboard"
import { NavigationPanel } from "./layout/NavigationPanel"
import { LogoutModal } from "./auth/LogoutModal"
import { GiftListCreationProcess } from "./gift-list/GiftListCreationProcess"
import { MyLists } from "./lists/MyLists"
import { Inbox } from "./notifications/Inbox"
import { ProfilePage } from "./user/ProfilePage"
import { ProgressReport } from "./reports/ProgressReport"
import { PublishedListView } from "./gift-list/PublishedListView"

type AppState = "landing" | "login" | "dashboard" | "create-list" | "published-view" | "inbox" | "my-lists" | "profile" | "progress-report"

export default function GiftListApp() {
    const [appState, setAppState] = useState<AppState>("landing")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    const handleLogin = () => {
        setIsAuthenticated(true)
        setAppState("dashboard")
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        setAppState("landing")
        setIsLogoutModalOpen(false)
    }

    const handleCreateNewList = () => {
        setAppState("create-list")
    }

    const handleListCreationComplete = (listData: any) => {
        console.log("New list created:", listData)
        setAppState("dashboard")
    }

    const handleEditList = (listId: number) => {
        console.log("Editing list:", listId)
        // Implement edit list logic here
    }

    const handleViewList = (listId: number) => {
        console.log("Viewing list:", listId);
        setAppState("published-view");
    }

    const handleViewNotifications = () => {
        setAppState("inbox")
    }

    const handleViewProgressReport = (listId: number) => {
        console.log("Viewing progress report for list:", listId)
        setAppState("progress-report")
    }

    const mockPublishedListViewData = {
        listName: "Sample Published List",
        items: [
            { name: "Item 1", quantity: 1, price: 10 },
            { name: "Item 2", quantity: 2, price: 20 },
        ],
    };

    return (
        <div className="flex min-h-screen bg-background">
            {appState === "landing" && (
                <LandingPage
                    onGetStarted={() => setAppState("login")}
                    onLogin={() => setAppState("login")}
                />
            )}
            {appState === "login" && (
                <LoginPage onLogin={handleLogin} />
            )}
            {isAuthenticated && (
                <>
                    <NavigationPanel onNavigate={(path) => {
                        switch (path) {
                            case "/dashboard":
                                setAppState("dashboard");
                                break;
                            case "/lists":
                                setAppState("my-lists");
                                break;
                            case "/inbox":
                                setAppState("inbox");
                                break;
                            case "/profile":
                                setAppState("profile");
                                break;
                            case "/logout":
                                setIsLogoutModalOpen(true);
                                break;
                        }
                    }} />
                    <main className="flex-1 p-8">
                        {appState === "dashboard" && (
                            <Dashboard
                                onCreateNewList={handleCreateNewList}
                                onEditList={handleEditList}
                                onViewList={handleViewList}
                                onViewNotifications={handleViewNotifications}
                                onViewProgressReport={handleViewProgressReport}
                            />
                        )}
                        {appState === "create-list" && (
                            <GiftListCreationProcess
                                onComplete={handleListCreationComplete}
                                onExit={() => setAppState("dashboard")}
                                onBack={() => setAppState("dashboard")}
                            />
                        )}
                        {appState === "published-view" && (
                            <PublishedListView
                                {...mockPublishedListViewData}
                                onBack={() => setAppState("dashboard")}
                            />
                        )}
                        {appState === "my-lists" && (
                            <MyLists onEdit={handleEditList} onView={handleViewList} />
                        )}
                        {appState === "inbox" && (
                            <Inbox notifications={[]} />
                        )}
                        {appState === "profile" && (
                            <ProfilePage />
                        )}
                        {appState === "progress-report" && (
                            <ProgressReport
                                listName="Sample List"
                                totalAmount={1000}
                                contributedAmount={500}
                                contributors={[]}
                                giftItems={[]}
                            />
                        )}
                    </main>
                    <LogoutModal
                        isOpen={isLogoutModalOpen}
                        onClose={() => setIsLogoutModalOpen(false)}
                        onLogout={handleLogout}
                    />
                </>
            )}
        </div>
    )
}
