import apiServices from "../../services/apiServices";


export const fetchAdminCategories = (page, filters = {}) => async (dispatch) => {
    console.log("actions is calling correctly");
    dispatch({ type: "FETCH_ADMIN_CATEGORIES_REQUEST" });
    try {
        const response = await apiServices('/api/categories/index', 'get', null);
        dispatch({ type: "FETCH_ADMIN_CATEGORIES_SUCCESS", payload: response.results });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_ADMIN_CATEGORIES_FAILURE" });
    }
}
export const adminCategoryStore = (data) => async (dispatch) => {
    try {
        const response = await apiServices('/api/categories/store', 'post', data);
        dispatch({ type: "FETCH_ADMIN_STORE_SUCCESS", payload: response?.data });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_ADMIN_CATEGORIES_FAILURE" });
    }
}