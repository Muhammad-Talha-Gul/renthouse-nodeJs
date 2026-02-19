import apiServices from "../../services/apiServices";


export const fetchAdminCategories = (page = 1, filters = {}) => async (dispatch) => {
    console.log("actions is calling correctly");
    dispatch({ type: "FETCH_ADMIN_CATEGORIES_REQUEST" });
    try {
        // pass page and filters as query params
        const params = { page, ...filters };
        console.log("console params data", params);
        const response = await apiServices('/api/categories/index', 'get', null, params);
        dispatch({ type: "FETCH_ADMIN_CATEGORIES_SUCCESS", payload: response });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_ADMIN_CATEGORIES_FAILURE" });
        return error;
    }
}
export const adminCategoryStore = (data) => async (dispatch) => {
  try {
    const response = await apiServices('/api/categories/store', 'post', data);
    console.log("store response console", response);

    // If backend returned status: false, treat it as error
    if (response?.status === false) {
      dispatch({ type: "FETCH_ADMIN_CATEGORIES_FAILURE", error: response.error });
    } else {
      dispatch({ type: "STORE_ADMIN_CATEGORY_SUCCESS", payload: response?.data });
    }

    return response; // always return response to handleSubmit
  } catch (error) {
    console.error("Error storing category:", error);

    const err = error?.response?.data || error || { status: false, error: error?.message || "Something went wrong" };
    dispatch({ type: "FETCH_ADMIN_CATEGORIES_FAILURE", error: err.error });
    return err;
  }
};

export const adminCategoryUpdate = (id, data) => async (dispatch) => {
    try {
        const response = await apiServices(`/api/categories/update/${id}`, 'put', data);
        dispatch({ type: "UPDATE_ADMIN_CATEGORY_SUCCESS", payload: response?.data });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_ADMIN_CATEGORIES_UPDATE_FAILURE" });
    }
}
export const adminCategoryDelete = (id) => async (dispatch) => {
    try {
        const response = await apiServices(`/api/categories/distroy/${id}`, 'delete', null);
        // prefer id from response.data if present, otherwise fallback to response.id or the id we passed
        const deletedId = response?.data?.id ?? response?.id ?? id;
        dispatch({ type: "DELETE_ADMIN_CATEGORY_SUCCESS", payload: deletedId });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_ADMIN_CATEGORIES_DELETE_FAILURE" });
    }
}