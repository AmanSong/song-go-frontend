export const loginUtility = {

    async handleLogin(email: string, password: string) {
        try {
            const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS || 'localhost:3000'}/api/user/login`, {
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
            console.log('Login successful:', data);
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },

    async handleSignUp(name: string, email: string, password: string) {
        try {
            const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS || 'localhost:3000'}/api/user/signup`, {
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
            console.log('Sign-up successful:', data);
            return data;
        } catch (error) {
            console.error('Error during sign-up:', error);
            throw error;
        }
    },

};