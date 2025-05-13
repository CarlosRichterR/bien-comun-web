'use client';

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from 'react-icons/fc'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import Logo from '../../../public/assets/images/bc-2.jpg';
import { handleLogin } from "@/services/authService";
import { useRouter } from 'next/navigation';

interface LoginPageProps {
    onLogin: (user:string, pass:string) => void;
    errorMessage: string | null;
    onGoogleLogin: () => void;
}

export default function LoginPage({ onLogin, errorMessage, onGoogleLogin }: LoginPageProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const handleLogin2 = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await handleLogin(email, password);
        setIsLoading(false);
        if (result.success) {
            router.push('/dashboard');
        } else {
            alert(result.errorMessage);
        }
    }

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            setIsLoading(false);
            return;
        }
        // Simula espera de backend
        setTimeout(() => {
            setIsLoading(false);
            onLogin(email, password);
        }, 1000);
    }

    const handleGoogleLogin = () => {
        // Here you would typically handle Google login logic
        console.log('Google login attempted')
        onGoogleLogin()
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background w-full">
            <Card className="w-[350px]">
                <div className="flex justify-center mt-6 mb-4">
                    <Image
                        src={Logo}
                        alt="BC logo"
                        width={200}
                        height={200}
                    />
                </div>
                <CardHeader>
                    {/*<CardTitle className="text-2xl font-bold text-center">BC</CardTitle>*/}
                    <CardDescription>Inicia sesión o regístrate para continuar</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                            <TabsTrigger value="register">Registrarse</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <form onSubmit={handleLogin2}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                                <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            Procesando...
                                        </span>
                                    ) : (
                                        'Iniciar Sesión'
                                    )}
                                </Button>
                            </form>
                            <p className="text-sm text-center mt-4">
                                ¿No tienes una cuenta? <Button variant="link" className="p-0" onClick={() => setActiveTab("register")}>¡Crea una!</Button>
                            </p>
                        </TabsContent>
                        <TabsContent value="register">
                            <form onSubmit={handleRegister}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="username">Nombre de usuario</Label>
                                        <Input
                                            id="username"
                                            placeholder="Ingrese su nombre de usuario"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="email">Correo electrónico</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Ingrese su correo electrónico"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="password">Contraseña</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Ingrese su contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirme su contraseña"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            Procesando...
                                        </span>
                                    ) : (
                                        'Registrarse'
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                    >
                        <FcGoogle className="mr-2 h-4 w-4" />
                        Continuar con Google
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

