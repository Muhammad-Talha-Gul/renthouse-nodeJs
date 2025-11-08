import apiServices from "../../services/apiServices";


export const fetchIndexData = (page, filters = {}) => async (dispatch) => {
    console.log("actions is calling correctly");
    dispatch({ type: "FETCH_INDEX_DATA_START" });
    try {
        const response = await apiServices('/api/index', 'get', null);
        dispatch({ type: "FETCH_INDEX_DATA_SUCCESS", payload: response });
        return response;

    } catch (error) {
        dispatch({ type: "FETCH_INDEX_DATA_FAILURE" });
    }
}