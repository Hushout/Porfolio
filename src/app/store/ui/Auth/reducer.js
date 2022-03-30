import { types } from './types';

export const initialState = {
    loginErrorMessage: undefined,
    registerErrorMessage: undefined,
};

export const UIAuthReducer = function (state = initialState, action) {
    switch (action.type) {
        case types.setLoginErrorMessage:
            return { ...state, loginErrorMessage: action.loginErrorMessage };
            case types.setRegisterErrorMessage:
            return { ...state, registerErrorMessage: action.registerErrorMessage };
        default:
            return state;
    }
}