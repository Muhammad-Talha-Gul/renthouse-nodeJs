// src/reducers/exampleReducer.js
const initialState = {
    data: null,
    loading: false,
    error: null,
};

const SearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_SEARCH_DATA_START':
            return { ...state, loading: true };
        case 'FETCH_SEARCH_DATA_SUCCESS':
            return { ...state, loading: false, data: action.payload };
        case 'FETCH_SEARCH_DATA_FAILURE':
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default SearchReducer;
