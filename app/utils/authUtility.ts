export const authUtility = {

    async getSession(token: string | null) {
        if (!token) return { user: null, isAuthenticated: false };

        try {
            const res = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/user/session`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            return data
        } catch {
            return { user: null, isAuthenticated: false };
        }
    },

    async handleLogin(email: string, password: string) {

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },

    async handleSignUp(name: string, email: string, password: string) {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP_ADDRESS || 'localhost:3000'}/api/user/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });
            if (!response.ok) {
                throw new Error('Sign-up failed');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error during sign-up:', error);
            throw error;
        }
    },

};