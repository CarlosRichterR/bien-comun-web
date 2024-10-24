"use client";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <title>Bien Común</title>
        <meta name="description" content="Bien Común - Administra tus listas de regalos fácilmente." />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}