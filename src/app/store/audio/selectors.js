import { createSelector } from 'reselect';

export const isPlayingSelector = state => state.audio.isPlaying;
export const isPausedSelector = state => state.audio.isPaused;

export const isStopSelector = createSelector(
    isPlayingSelector,
    isPausedSelector,
    (isPlaying, isPaused) => !isPaused && !isPlaying
);

export const cursorTimeSelector = state => state.audio.cursorTime;
export const isRecSelector = state => state.audio.isRec;