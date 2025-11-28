// src/reducers/exampleReducer.js
const initialState = {
    users: [],
    modulesAndFields: [],
    pagination: [],
    loading: false,
    error: null,
};

const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_USERS_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_USERS_SUCCESS':
            return {
                ...state, loading: false,
                users: action.payload?.data || [],
                pagination: action.payload?.pagination || [],

            };
        case 'FETCH_USERS_FAILURE':
            return { ...state, loading: false, error: action.error };

        case 'FETCH_MODULES_FIELDS_SUCCESS':
            return {
                ...state,
                modulesAndFields: action.payload
            };

        case 'FETCH_MODULES_FIELDS_FAILURE':
            return { ...state, error: action.payload };


        case 'STORE_USER_SUCCESS':
            return {
                ...state,
                users: [...state.users, action.payload], // add new category
            };


        case 'UPDATE_USER_SUCCESS':
            console.log("Category updated:", action.payload);
            return {
                ...state,
                users: state.users.map(cat =>
                    cat.id === action.payload.id ? action.payload : cat
                ),
            };

        // ✅ DELETE CATEGORY
        case 'DELETE_USER_SUCCESS':
            const payloadId = Number(action.payload);
            return {
                ...state,
                users: state.users.filter(cat => Number(cat.id) !== payloadId),
            };

        default:
            return state;
    }
};

export default usersReducer;
