import { showErrorToast, showSuccessToast } from "../../services/alertService";
import apiServices from "../../services/apiServices";

export const fetchUsers = (page = 1, filters = {}) => async (dispatch) => {
    console.log("actions is calling correctly");
    dispatch({ type: "FETCH_USERS_REQUEST" });
    try {
        // pass page and filters as query params
        const params = { page, ...filters };
        console.log("console params data", params);
        const response = await apiServices('/api/users/index', 'get', null, params);
        dispatch({ type: "FETCH_USERS_SUCCESS", payload: response });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_USERS_FAILURE" });
    }
}
export const fetchModulesAndFields = () => async (dispatch) => {
    console.log("actions is calling correctly");
    dispatch({ type: "FETCH_MODULES_FIELDS_REQUEST" });
    try {
        const response = await apiServices('/api/users/modules_fields', 'get', null, null);
        dispatch({ type: "FETCH_MODULES_FIELDS_SUCCESS", payload: response.data });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_MODULES_FIELDS_FAILURE" });
    }
}

export const userStore = (data) => async (dispatch) => {
    try {
        const response = await apiServices('/api/user/store', 'post', data);
        dispatch({ type: "STORE_USER_SUCCESS", payload: response?.data });
        showSuccessToast(response?.message);
        return response;


    } catch (error) {
        const errorMessage =
            error?.error?.message ||
            error?.message ||
            "Something went wrong";
        showErrorToast(errorMessage);
        dispatch({ type: "FETCH_USER_FAILURE" });
    }
}
export const userUpdate = (id, data) => async (dispatch) => {
    try {
        const response = await apiServices(`/api/user/update/${id}`, 'put', data);
        dispatch({ type: "UPDATE_USER_SUCCESS", payload: response?.user });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_USER_UPDATE_FAILURE" });
    }
}
export const userFieldPermissions = (id, data) => async (dispatch) => {
    try {
        const response = await apiServices(`/api/user/fields_permissions/update/${id}`, 'put', data);
        dispatch({ type: "UPDATE_USER_SUCCESS", payload: response?.user });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_USER_UPDATE_FAILURE" });
    }
}
export const userModulesPermissions = (id, data) => async (dispatch) => {
    try {
        const response = await apiServices(`/api/user/modules_permissions/update/${id}`, 'put', data);
        dispatch({ type: "UPDATE_USER_SUCCESS", payload: response?.user });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_USER_UPDATE_FAILURE" });
    }
}
export const userDelete = (id) => async (dispatch) => {
    try {
        const response = await apiServices(`/api/categories/distroy/${id}`, 'delete', null);
        // prefer id from response.data if present, otherwise fallback to response.id or the id we passed
        const deletedId = response?.data?.id ?? response?.id ?? id;
        dispatch({ type: "DELETE_USER_SUCCESS", payload: deletedId });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_USER_DELETE_FAILURE" });
    }
}