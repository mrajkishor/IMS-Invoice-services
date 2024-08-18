export interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    user: any;
    token: string | null;
    refreshToken: string | null;
}

export interface User {
    userId: string;
    username: string;
    email: string;
    password: string;
}
