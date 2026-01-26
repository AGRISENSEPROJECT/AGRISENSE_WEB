const API_BASE_URL = 'https://agrisense-backend-pkdg.onrender.com';

interface LoginResponse {
    token: string;
    user?: any;
}

export const auth = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Login failed' }));
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    },

    verifyOtp: async (email: string, otp: string) => {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'OTP verification failed' }));
            throw new Error(error.message || 'OTP verification failed');
        }

        return response.json();
    },

    resendOtp: async (email: string) => {
        const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to resend OTP' }));
            throw new Error(error.message || 'Failed to resend OTP');
        }

        return response.json();
    },
};
