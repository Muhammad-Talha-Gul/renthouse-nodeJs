// src/reducers/exampleReducer.js
const initialState = {
    properties: [],
    categories: [],
    amunities: [],
    features: [],
    pagination: [],
    searchResults: [],
    searchPagination: {},
    propertyDetails: null,
    loading: false,
    error: null,
};

const adminPropertiesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_ADMIN_PROPERTIES_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_ADMIN_PROPERTIES_SUCCESS':
            console.log("action payload console", action.payload);
            return {
                ...state, loading: false,
                properties: action.payload?.data || [],
                categories: action.payload?.categories || [],
                amunities: action.payload?.amunities || [],
                features: action.payload?.features || [],
                pagination: action.payload?.pagination || [],

            };
        case 'FETCH_ADMIN_PROPERTIES_FAILURE':
            console.log("Reducer Error fetching properties:", action.error);
            return { ...state, loading: false, error: action.error };

        case 'SEARCH_PROPERTIES_REQUEST':
            return { ...state, loading: true };
        case 'SEARCH_PROPERTIES_SUCCESS':
            return {
                ...state, loading: false,
                searchResults: action.payload?.properties || [],
                searchPagination: action.payload?.pagination || {},
                error: null
            };
        case 'SEARCH_PROPERTIES_FAILURE':
            return { ...state, loading: false, error: action.error };

        case 'FETCH_PROPERTY_DETAILS_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_PROPERTY_DETAILS_SUCCESS':
            return {
                ...state, loading: false,
                propertyDetails: action.payload,
                error: null
            };
        case 'FETCH_PROPERTY_DETAILS_FAILURE':
            return { ...state, loading: false, error: action.error };


        case 'STORE_ADMIN_PROPERTY_SUCCESS':
            return {
                ...state,
                properties: [...state.properties, action.payload], // add new category
            };


        case 'UPDATE_ADMIN_CATEGORY_SUCCESS':
            console.log("Category updated:", action.payload);
            return {
                ...state,
                properties: state.properties.map(cat =>
                    cat.id === action.payload.id ? action.payload : cat
                ),
            };

        // ✅ DELETE CATEGORY
        case 'DELETE_ADMIN_CATEGORY_SUCCESS':
            const payloadId = Number(action.payload);
            return {
                ...state,
                properties: state.properties.filter(cat => Number(cat.id) !== payloadId),
            };

        default:
            return state;
    }
};

export default adminPropertiesReducer;
