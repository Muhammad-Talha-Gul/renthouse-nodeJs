// src/reducers/exampleReducer.js
const initialState = {
    categories: [],
    pagination: [],
    loading: false,
    error: null,
};

const adminCategoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_ADMIN_CATEGORIES_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_ADMIN_CATEGORIES_SUCCESS':
            console.log("action payload console", action.payload);
            return { ...state, loading: false,
                categories: action.payload?.data || [],
                pagination: action.payload?.pagination || [],

             };
        case 'FETCH_ADMIN_CATEGORIES_FAILURE':
            return { ...state, loading: false, error: action.error };


        case 'STORE_ADMIN_CATEGORY_SUCCESS':
            return {
                ...state,
                categories: [...state.categories, action.payload], // add new category
            };


        case 'UPDATE_ADMIN_CATEGORY_SUCCESS':
            console.log("Category updated:", action.payload);
            return {
                ...state,
                categories: state.categories.map(cat =>
                    cat.id === action.payload.id ? action.payload : cat
                ),
            };

        // ✅ DELETE CATEGORY
        case 'DELETE_ADMIN_CATEGORY_SUCCESS':
            const payloadId = Number(action.payload);
            return {
                ...state,
                categories: state.categories.filter(cat => Number(cat.id) !== payloadId),
            };

        default:
            return state;
    }
};

export default adminCategoriesReducer;
