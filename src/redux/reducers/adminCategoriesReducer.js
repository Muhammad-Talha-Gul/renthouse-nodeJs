// src/reducers/exampleReducer.js
const initialState = {
    categories: [],
    loading: false,
    error: null,
};

const adminCategoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_ADMIN_CATEGORIES_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_ADMIN_CATEGORIES_SUCCESS':
            return { ...state, loading: false, categories: action.payload };
        case 'FETCH_ADMIN_CATEGORIES_FAILURE':
            return { ...state, loading: false, error: action.error };


        // case 'FETCH_ADMIN_CATEGORIES_SUCCESS':
        //     return {
        //         ...state, loading: false, error: action.error,
        //         categories: categories.map(cat =>
        //             cat.id === action.payload.id ? action.payload : cat
        //         ),
        //     };
        default:
            return state;
    }
};

export default adminCategoriesReducer;
