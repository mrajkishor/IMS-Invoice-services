export interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    user: any; // Adjust based on your user type
}
