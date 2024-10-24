"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMessage("Please enter both username and password.");
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch(`${process.env.API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                router.push('/dashboard'); // Redirige a la página principal
            } else if (response.status === 401) {
                setErrorMessage("Invalid username or password.");
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%', padding: '2rem', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <h2 style={{
                    textAlign: 'center',
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: '1.5rem',
                    fontFamily: 'Helvetica Neue, Arial, sans-serif' // Fuente explícita
                }}>Login</h2>

                {errorMessage && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{errorMessage}</p>}

                <div style={{ marginBottom: '1.5rem' }}>
                    <label
                        htmlFor="username"
                        style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: '500',
                            fontFamily: 'Helvetica Neue, Arial, sans-serif' // Fuente explícita
                        }}
                    >
                        Username:
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '1rem',
                            border: '1px solid #b0c4de',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label
                        htmlFor="password"
                        style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: '500',
                            fontFamily: 'Helvetica Neue, Arial, sans-serif' // Fuente explícita
                        }}
                    >
                        Password:
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '1rem',
                            border: '1px solid #b0c4de',
                            borderRadius: '4px',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        fontFamily: 'Helvetica Neue, Arial, sans-serif', // Fuente explícita
                        cursor: 'pointer'
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
