import { types, gridTools } from './types';

export const initialState = {
    mainGridTool: gridTools.selector,
};

export const toolsReducer = function (state = initialState, action) {
    switch (action.type) {
        case types.setMainGridTool:
            return { ...state, mainGridTool: action.mainGridTool };
        default:
            return state;
    }
}