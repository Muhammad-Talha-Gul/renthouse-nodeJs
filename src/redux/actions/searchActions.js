import apiServices from "../../services/apiServices";


export const fetchSearchData = (page, filters = {}) => async (dispatch) => {
    console.log("actions is calling correctly");
    dispatch({ type: "FETCH_SEARCH_DATA_START" });

    try {
        // Build query params
        const queryParams = new URLSearchParams({ page, ...filters }).toString();
        const url = `/api/index?${queryParams}`;

        // Call API
        const response = await apiServices(url, 'get', null);

        dispatch({ type: "FETCH_SEARCH_DATA_SUCCESS", payload: response });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_SEARCH_DATA_FAILURE", payload: error });
    }
}