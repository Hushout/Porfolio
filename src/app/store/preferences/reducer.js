import { types } from './types';
import { AudioService } from '../../services';
import { GridWorkerService } from '../../services/workers/GridWorkerService';

export const initialState = {
  autoMute: false,
  loopBar: {
    begin: 0,
    end: 1,
    active: false
  },
  showEditor: true,
  isMetronome: false,
  zoomGrid: 1,
  latencyRec: 0,
  pauseOnChangingTab: true
};

export const preferencesReducer = function (state = initialState, action) {
  switch (action.type) {
    case types.setAutoMute:
      return { ...state, autoMute: action.autoMute };
    case types.loadPreferences:
      if (action.preferences) {
        return { ...state, ...action.preferences };
      }
      return state;
    case types.setLoopBar:
      AudioService.loopBar = action.loopBar;
      return { ...state, loopBar: action.loopBar };
    case types.setShowEditor:
      return { ...state, showEditor: action.showEditor };
    case types.setIsMetronome:
      return { ...state, isMetronome: action.isMetronome };
    case types.setZoomGrid:
      if (state.zoomGrid === action.zoomGrid) {
        return state;
      }
      GridWorkerService.updateZoom(action.zoomGrid);
      return { ...state, zoomGrid: action.zoomGrid };
    case types.setLatencyRec:
      if (state.latencyRec === action.latencyRec) {
        return state;
      }
      return { ...state, latencyRec: action.latencyRec };
    default:
      return state;
  }
}