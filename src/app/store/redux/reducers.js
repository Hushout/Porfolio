import { combineReducers } from 'redux';
// import { userReducer, initialState as userInitialState } from '../user/reducer';
// import { projectReducer, initialState as projectInitialState } from '../project/reducer';
// import { pluginReducer, initialState as pluginInitialState } from '../plugin/reducer';
// import { preferencesReducer, initialState as preferencesInitialState } from '../preferences/reducer';
// import { trackReducer, initialState as trackInitialState } from '../track/reducer';
import { logout } from '../user/types';
// import { UIReducer, initialState as UIInitialState } from '../ui/reducer';
// import { chatReducer, initialState as chatInitialState } from '../chatMessage/reducer';
// import { audioReducer, initialState as audioInitialState } from '../audio/reducer';



export const initialState = {
    // user: userInitialState,
    // project: projectInitialState,
    // plugin: pluginInitialState,
    // preferences: preferencesInitialState,
    // track: trackInitialState,
    // UI: UIInitialState,
    // chat: chatInitialState,
    // audio: audioInitialState,
};

const appReducer = combineReducers({
    // user: userReducer,
    // project: projectReducer,
    // plugin: pluginReducer,
    // preferences: preferencesReducer,
    // track: trackReducer,
    // UI: UIReducer,
    // chat: chatReducer,
    // audio: audioReducer,
});

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case logout:
            return initialState;
        default:
            return appReducer(state, action);
    }
}