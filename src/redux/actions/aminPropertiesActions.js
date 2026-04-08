import apiServices from "../../services/apiServices";


export const fetchAdminProperties = (page = 1, filters = {}) => async (dispatch) => {
    console.log("actions is calling correctly");
    dispatch({ type: "FETCH_ADMIN_PROPERTIES_REQUEST" });
    try {
        // pass page and filters as query params
        const params = { page, ...filters };
        console.log("console params data", params);
        const response = await apiServices('/api/properties/index', 'get', null, params);
        console.log("properties response console", response);
        dispatch({ type: "FETCH_ADMIN_PROPERTIES_SUCCESS", payload: response });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_ADMIN_PROPERTIES_FAILURE" });
        return error;
    }
}

export const searchProperties = (filters = {}) => async (dispatch) => {
    dispatch({ type: "SEARCH_PROPERTIES_REQUEST" });
    try {
        const params = { ...filters };
        const response = await apiServices('/api/properties/search', 'get', null, params);
        dispatch({ type: "SEARCH_PROPERTIES_SUCCESS", payload: response });
        return response;
    } catch (error) {
        dispatch({ type: "SEARCH_PROPERTIES_FAILURE", error });
        return error;
    }
}

export const fetchPropertyDetails = (id) => async (dispatch) => {
    dispatch({ type: "FETCH_PROPERTY_DETAILS_REQUEST" });
    try {
        const response = await apiServices(`/api/properties/details/${id}`, 'get');
        dispatch({ type: "FETCH_PROPERTY_DETAILS_SUCCESS", payload: response });
        return response;
    } catch (error) {
        dispatch({ type: "FETCH_PROPERTY_DETAILS_FAILURE", error });
        return error;
    }
}
export const fetchAdminPropertyById = (id) => async (dispatch) => {
    dispatch({ type: "FETCH_PROPERTY_DETAILS_REQUEST" });
    try {
        const response = await apiServices(`/api/properties/details/${id}`, 'get');
        dispatch({ type: "FETCH_PROPERTY_DETAILS_SUCCESS", payload: response });
        return response;
    } catch (error) {
        dispatch({ type: "FETCH_PROPERTY_DETAILS_FAILURE", error });
        return error;
    }
}
export const adminPropertyStore = (data) => async (dispatch) => {
    try {
        console.log("fomr data console", data);
        const response = await apiServices('/api/property/store', 'post', data);
        console.log("store response console", response);

        // If backend returned status: false, treat it as error
        if (response?.status === false) {
            dispatch({ type: "FETCH_ADMIN_PROPERTIES_FAILURE", error: response.error });
        } else {
            dispatch({ type: "STORE_ADMIN_PROPERTY_SUCCESS", payload: response?.data });
        }

        return response; // always return response to handleSubmit
    } catch (error) {
        console.error("Error storing category:", error);

        const err = error?.response?.data || error || { status: false, error: error?.message || "Something went wrong" };
        dispatch({ type: "FETCH_ADMIN_PROPERTIES_FAILURE", error: err.error });
        return err;
    }
};

export const adminPropertyUpdate = (id, data) => async (dispatch) => {
    try {
        const response = await apiServices(`/api/properties/update/${id}`, 'put', data);
        dispatch({ type: "UPDATE_ADMIN_PROPERTY_SUCCESS", payload: response?.data });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_ADMIN_PROPERTIES_UPDATE_FAILURE" });
    }
}
export const adminPropertyDelete = (id) => async (dispatch) => {
    try {
        const response = await apiServices(`/api/properties/destroy/${id}`, 'delete', null);
        // prefer id from response.data if present, otherwise fallback to response.id or the id we passed
        const deletedId = response?.data?.id ?? response?.id ?? id;
        dispatch({ type: "DELETE_ADMIN_PROPERTY_SUCCESS", payload: deletedId });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_ADMIN_PROPERTIES_DELETE_FAILURE" });
    }
}