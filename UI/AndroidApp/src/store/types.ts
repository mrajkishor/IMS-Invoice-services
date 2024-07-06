export interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    user: any;
    token: string | null;
    refreshToken: string | null;
}

