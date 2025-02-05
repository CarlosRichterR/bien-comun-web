export const handleLogin = async (username: string, password: string) => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      return { success: true, errorMessage: null };
    } else {
      return {
        success: false,
        errorMessage: "Credenciales inválidas. Por favor, inténtelo de nuevo.",
      };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return {
      success: false,
      errorMessage: "Ocurrió un error. Por favor, inténtelo de nuevo.",
    };
  }
};
