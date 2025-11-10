import apiServices from "../../services/apiServices";


export const login = (credentials) => async (dispatch) => {
    console.log("actions is calling correctly");
    dispatch({ type: "LOGIN_START" });
    try {
        const response = await apiServices('/api/auth/login', 'post', credentials);
        dispatch({ type: "LOGIN_SUCCESS", payload: response });
        return response;

    } catch (error) {
        dispatch({ type: "LOGIN_FAILURE" });
    }
}

export const register = (userInfo) => async (dispatch) => {
    console.log("actions is calling correctly");
    dispatch({ type: "REGISTER_START" });
    try {
        const response = await apiServices('/api/auth/register', 'post', userInfo);
        dispatch({ type: "REGISTER_SUCCESS", payload: response });
        return response;

    } catch (error) {
        dispatch({ type: "REGISTER_FAILURE" });
    }
}
export const logout = () => async (dispatch) => {
    console.log("logout action is calling correctly");
    dispatch({ type: "LOGOUT_START" });
    try {
        await apiServices('/api/logout', 'post');
        dispatch({ type: "LOGOUT_SUCCESS" });
    } catch (error) {
        dispatch({ type: "LOGOUT_FAILURE" });
    }
}