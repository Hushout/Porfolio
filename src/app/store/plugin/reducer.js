import { types as pluginActionTypes } from './types';

export const initialState = {
  availablePlugins: []
};

export const pluginReducer = function (state = initialState, action) {
  switch (action.type) {
    case pluginActionTypes.setAvailablePlugins:
      return {
        ...state,
        availablePlugins: action.availablePlugins
      };
    default:
      return state;
  }
}