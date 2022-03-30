import { types } from './types';
import { AudioService } from '../../services/audio/AudioService';

export const initialState = {
  context: undefined,
  isPlaying: false,
  isPaused: false,
  isRec: false,
  cursorTime: 0
};

export const audioReducer = function (state = initialState, action) {
  switch (action.type) {
    case types.play:
      return {
        ...state,
        isPlaying: true,
        isPaused: false,
        isRec: !!action.isRec,
        cursorTime: AudioService.cursorTime
      };
    case types.pause:
      return {
        ...state,
        isPlaying: false,
        isPaused: true,
        isRec: false,
        cursorTime: AudioService.cursorTime
      };
    case types.stop:
      return {
        ...state,
        isPlaying: false,
        isPaused: false,
        isRec: false,
        cursorTime: AudioService.cursorTime
      };
    case types.setCursorTime:
      return {
        ...state,
        cursorTime: AudioService.cursorTime
      };
    default:
      return state;
  }
}