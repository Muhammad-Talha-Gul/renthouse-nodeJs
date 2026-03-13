// src/reducers/exampleReducer.js
const initialState = {
    properties: [],
    categories: [],
    pagination: [],
    loading: false,
    error: null,
};

const adminPropertiesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_ADMIN_PROPERTIES_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_ADMIN_PROPERTIES_SUCCESS':
            console.log("action payload console", action.payload);
            return { ...state, loading: false,
                properties: action.payload?.data || [],
                categories: action.payload?.categories || [],
                pagination: action.payload?.pagination || [],

             };
        case 'FETCH_ADMIN_PROPERTIES_FAILURE':
            console.log("Reducer Error fetching properties:", action.error);
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
