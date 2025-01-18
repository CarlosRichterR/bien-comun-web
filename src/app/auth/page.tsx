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

interface LoginPageProps {
    onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically handle the login logic
        console.log('Login attempted with:', email, password)
        onLogin()
    }

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden")
            return
        }
        console.log('Registro intentado con:', username, email, password)
        onLogin()
    }

    const handleGoogleLogin = () => {
        // Here you would typically handle Google login logic
        console.log('Google login attempted')
        onLogin()
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
                            <form onSubmit={handleLogin}>
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
                                <Button className="w-full mt-4" type="submit">
                                    Iniciar Sesión
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
                                <Button className="w-full mt-4" type="submit">
                                    Registrarse
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

