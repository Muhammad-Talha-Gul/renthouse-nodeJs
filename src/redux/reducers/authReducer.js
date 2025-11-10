// src/reducers/exampleReducer.js
const initialState = {
    login: null,
    loading: false,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true };
        case 'LOGIN_SUCCESS':
            return { ...state, loading: false, login: action.payload };
        case 'LOGIN_FAILURE':
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default authReducer;
