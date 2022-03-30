import { combineReducers } from 'redux';
import {UIAuthReducer, initialState as UIAuthInitialState} from './Auth/reducer';

export const initialState = {
    auth: UIAuthInitialState,
}

export const UIReducer = combineReducers({
    auth: UIAuthReducer,
});