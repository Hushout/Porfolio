import { combineReducers } from 'redux';
import { UIReducer, initialState as UIInitialState } from '../ui/reducer';



export const initialState = {
    UI: UIInitialState,
};

const appReducer = combineReducers({
    UI: UIReducer,
});

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return appReducer(state, action);
    }
}