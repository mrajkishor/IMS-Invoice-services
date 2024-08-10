export const createUsernameFromEmail = (email: string): string => {
    const username = email.split('@')[0];
    return username;
};