import apiServices from "../../services/apiServices";


export const login = (credentials) => async (dispatch) => {
    console.log("actions is calling correctly");
    dispatch({ type: "LOGIN_START" });
    try {
        const response = await apiServices('/api/auth/login', 'post', credentials);
        console.log("login response view file:", response.message); // ✅ use response.message

        // Store token in localStorage
        if (response.token) {
            localStorage.setItem('token', response.token);
        }
        // Store user in localStorage (for displaying name/profile)
        if (response.user) {
            try {
                localStorage.setItem('user', JSON.stringify(response.user));
            } catch (e) {
                console.warn('Failed to save user to localStorage', e);
            }
        }

        dispatch({ type: "LOGIN_SUCCESS", payload: response });
        return response;

    } catch (error) {
        alert(error.message); // ✅ safer logging // ✅ corrected syntax
        dispatch({ type: "LOGIN_FAILURE" });
    }
}


export const register = (userInfo) => async (dispatch) => {
    dispatch({ type: "REGISTER_START" });
    try {
        console.log("actions is calling correctly DDDD", userInfo);
        const response = await apiServices('/api/auth/register', 'post', userInfo);
        dispatch({ type: "REGISTER_SUCCESS", payload: response });
        alert("Registration successful!");
        return response;

    } catch (error) {
        dispatch({ type: "REGISTER_FAILURE" });
    }
}
export const logout = () => async (dispatch) => {
    console.log("logout action is calling correctly");
    dispatch({ type: "LOGOUT_START" });
    try {
        // Remove token from localStorage
        localStorage.removeItem('token');

        await apiServices('/api/logout', 'post');
        dispatch({ type: "LOGOUT_SUCCESS" });
    } catch (error) {
        dispatch({ type: "LOGOUT_FAILURE" });
    }
}