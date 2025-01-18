import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProfilePage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [location, setLocation] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('usuario@ejemplo.com')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically handle the profile update logic
        console.log('Profile update attempted with:', { firstName, lastName, location, phone })
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Perfil de Usuario</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Nombre</Label>
                                <Input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Ingrese su nombre"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Apellido</Label>
                                <Input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Ingrese su apellido"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Lugar de ubicación para entrega de regalos</Label>
                            <Input
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Ingrese la dirección de entrega"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Número telefónico</Label>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Ingrese su número telefónico"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                value={email}
                                disabled
                                className="bg-gray-100"
                            />
                        </div>
                        <Button type="submit" className="w-full">Actualizar Perfil</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

