const TOKEN_KEY = "token";
const USER_KEY = "userDetails";
    
export const authSession = {
    setSession: (token, user) => {
        try {
            localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        } catch (e) {
            console.warn("Failed to save session", e);
        }
    },

    getToken: () => {
        try {
            return JSON.parse(localStorage.getItem(TOKEN_KEY));
        } catch {
            return null;
        }
    },

    getUser: () => {
        try {
            return JSON.parse(localStorage.getItem(USER_KEY));
        } catch {
            return null;
        }
    },

    clearSession: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    isAuthenticated: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        return !!token;
    }
};