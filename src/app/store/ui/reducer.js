import { combineReducers } from 'redux';
import {UIAuthReducer, initialState as UIAuthInitialState} from './Auth/reducer';
import {UIPopupReducer, initialState as UIPopupInitialState} from './Popup/reducer';
import {UILayoutReducer, initialState as UILayoutInitialState} from './layout/reducer';
import {toolsReducer, initialState as toolsInitialState} from './tools/reducer';

export const initialState = {
    auth: UIAuthInitialState,
    popup: UIPopupInitialState,
    layout: UILayoutInitialState,
    tools: toolsInitialState
}

export const UIReducer = combineReducers({
    auth: UIAuthReducer,
    popup: UIPopupReducer,
    layout: UILayoutReducer,
    tools: toolsReducer
});