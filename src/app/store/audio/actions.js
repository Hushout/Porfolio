import { types } from './types';

export const pause = () => async dispatch => await dispatch({ type: types.pause });

export const stop = () => async dispatch => await dispatch({ type: types.stop});

export const play = isRec => async dispatch => await dispatch({ type: types.play, isRec });

export const setCursorTime = time => async dispatch => await dispatch({ type: types.setCursorTime, time });
