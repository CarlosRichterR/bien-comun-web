import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Heart, Users, CreditCard } from 'lucide-react'
import Image from 'next/image'
import { FaTiktok, FaInstagram, FaFacebook } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Logo from '../../public/assets/images/bc-2.jpg';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
interface LandingPageProps {
    onGetStarted: () => void;
    onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    }

    const handleLoginClick = () => {
        onLogin();
        if (isClient) {
            router.push('/auth');
        }
    };


    return (
        <div className="min-h-screen bg-background flex flex-col w-full">
            <motion.header
                className="px-4 lg:px-6 h-14 flex items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Button variant="ghost" onClick={handleLoginClick}>Iniciar Sesión</Button>
                    <Button onClick={onGetStarted}>Comenzar</Button>
                </nav>
            </motion.header>
            <main className="flex-1 flex flex-col justify-center">
                <motion.section
                    className="w-full py-12 md:py-24 lg:py-32 xl:py-48"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="container px-4 md:px-6 mx-auto max-w-6xl">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <motion.div variants={itemVariants}>
                                <Image
                                    src={Logo}
                                    alt="BC logo"
                                    width={200}
                                    height={200}
                                    className="mb-8"
                                />
                            </motion.div>
                            <motion.div className="space-y-2" variants={itemVariants}>
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    Simplifica tu Lista de Regalos con BC
                                </h1>
                                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                    BC te ayuda a crear y gestionar listas de regalos para cualquier ocasión.
                                    Comparte fácilmente con amigos y familiares, y haz que la experiencia de dar regalos sea más significativa.
                                </p>
                            </motion.div>
                            <motion.div className="space-x-4" variants={itemVariants}>
                                <Button onClick={onGetStarted} size="lg">Comenzar Ahora</Button>
                                <Button variant="outline" size="lg" onClick={onLogin}>Iniciar Sesión</Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>
                <motion.section
                    className="w-full py-12 md:py-24 lg:py-32 bg-muted"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="container px-4 md:px-6">
                        <motion.h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8" variants={itemVariants}>
                            Beneficios Clave
                        </motion.h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { icon: Gift, title: "Gestión Fácil", content: "Crea y administra múltiples listas de regalos para diferentes ocasiones con facilidad." },
                                { icon: Users, title: "Colaboración", content: "Comparte tus listas con amigos y familiares, permitiéndoles contribuir fácilmente." },
                                { icon: Heart, title: "Personalización", content: "Adapta tus listas a tus preferencias y necesidades específicas." },
                                { icon: CreditCard, title: "Contribuciones Seguras", content: "Proceso de contribución seguro y transparente para tus invitados." },
                            ].map((benefit, index) => (
                                <motion.div key={index} variants={itemVariants}>
                                    <Card>
                                        <CardHeader>
                                            <benefit.icon className="h-10 w-10 text-primary mb-2" />
                                            <CardTitle>{benefit.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {benefit.content}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>
                <motion.section
                    className="w-full py-12 md:py-24 lg:py-32"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <motion.div className="space-y-2" variants={itemVariants}>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    ¿Listo para Comenzar?
                                </h2>
                                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                                    Crea tu primera lista de regalos hoy y descubre lo fácil que puede ser organizar tus deseos y celebraciones.
                                </p>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Button onClick={onGetStarted} size="lg">Crear Mi Primera Lista</Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>
            </main>
            <motion.footer
                className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                <p className="text-xs text-muted-foreground">© 2024 BC. Todos los derechos reservados.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <a className="text-xs hover:underline underline-offset-4" href="#">
                        Términos de Servicio
                    </a>
                    <a className="text-xs hover:underline underline-offset-4" href="#">
                        Privacidad
                    </a>
                </nav>
                <div className="flex gap-4 ml-auto">
                    <a href="#" aria-label="TikTok">
                        <FaTiktok className="h-5 w-5" />
                    </a>
                    <a href="#" aria-label="Instagram">
                        <FaInstagram className="h-5 w-5" />
                    </a>
                    <a href="#" aria-label="Facebook">
                        <FaFacebook className="h-5 w-5" />
                    </a>
                </div>
            </motion.footer>
        </div>
    )
}

