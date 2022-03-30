import { types } from './types';
import { getAppsyncClient } from '../../apiClient/APIClient';
import { operations } from './operations';
import { AudioService, GridService, nullId } from '../../services';
import { debounce } from 'throttle-debounce';
import { maxEndBarSelector } from '../track/selectors';

const setAutoMuteLocal = value => async dispatch => await dispatch({ type: types.setAutoMute, autoMute: value });
export const setAutoMute = value => async (dispatch, getState) => {
    const { project: { currentProjectId: projectId } } = getState();
    if (!!projectId) {
        try {
            await dispatch(setAutoMuteLocal(value));
            await getAppsyncClient().mutate({
                mutation: operations.mutations.setAutoMuteMutation,
                variables: { projectId, autoMute: value }
            });

        } catch (err) {
            await dispatch(setAutoMuteLocal(!value));
            console.log(err);
        }
    }
}

export const loadPreferences = () => async (dispatch, getState) => {
    const { project: { currentProjectId, projects } } = getState();
    const currentProject = projects.find(p => p.id === currentProjectId);
    try {
        await dispatch(setPreferences(currentProject.preferences));
        AudioService.loopBar = currentProject.preferences.loopBar;
    } catch (err) {
        console.log(err);
    }
}

const setPreferences = preferences => async dispatch => await dispatch({ type: types.loadPreferences, preferences });

export const setLoopBar = loopBar => async (dispatch, getState) => {
    const { project: { currentProjectId }, preferences: { loopBar: previousLoopBar } } = getState();
    if (!!currentProjectId && currentProjectId !== nullId) {
        await dispatch({ type: types.setLoopBar, loopBar: loopBar });
        try {
            await getAppsyncClient().mutate({
                mutation: operations.mutations.setLoopBarMutation,
                variables: {
                    projectId: currentProjectId,
                    loopBar: {
                        begin: loopBar.begin,
                        end: loopBar.end,
                        active: loopBar.active
                    }
                }
            });
        } catch (err) {
            await dispatch({ type: types.setLoopBar, loopBar: previousLoopBar });
            console.log(err);
        }
    }
}

export const setShowEditor = showEditor => async (dispatch, getState) => {
    const { project: { currentProjectId } } = getState();
    if (!!currentProjectId && currentProjectId !== nullId) {
        await dispatch({ type: types.setShowEditor, showEditor });
        try {
            await getAppsyncClient().mutate({
                mutation: operations.mutations.setShowEditorMutation,
                variables: {
                    projectId: currentProjectId,
                    showEditor
                }
            });
        } catch (err) {
            await dispatch({ type: types.setShowEditor, showEditor: !showEditor });
            console.log(err);
        }
    }
}

export const setIsMetronome = isMetronome => async (dispatch, getState) => {
    const { project: { currentProjectId } } = getState();
    if (!!currentProjectId && currentProjectId !== nullId) {
        await dispatch({ type: types.setIsMetronome, isMetronome });
        try {
            await getAppsyncClient().mutate({
                mutation: operations.mutations.setIsMetronomeMutation,
                variables: {
                    projectId: currentProjectId,
                    isMetronome
                }
            });
        } catch (err) {
            await dispatch({ type: types.setIsMetronome, isMetronome: !isMetronome });
            console.log(err);
        }
    }
}

export const setLatencyRecLocal = latencyRec => async dispatch => await dispatch({ type: types.setLatencyRec, latencyRec });

const dbSetLatencyRec = debounce(1000, false, async (projectId, previousLatencyRec, latencyRec) => {
    try {
        await getAppsyncClient().mutate({
            mutation: operations.mutations.setLatencyRecMutation,
            variables: {
                projectId,
                latencyRec
            }
        });
    } catch (err) {
        await dispatch(setLatencyRecLocal(previousLatencyRec));
        console.log(err);
    }
});

export const setLatencyRec = latencyRec => async (dispatch, getState) => {
    const state = getState();
    const { project: { currentProjectId }, preferences: { latencyRec: previousLatencyRec } } = state;
    if (!!currentProjectId && currentProjectId !== nullId) {
        if (previousLatencyRec !== latencyRec) {
            await dispatch(setLatencyRecLocal(latencyRec));
            await dbSetLatencyRec(currentProjectId, previousLatencyRec, latencyRec);
        }
    }
}

export const setZoomGridLocal = zoomGrid => async dispatch => await dispatch({ type: types.setZoomGrid, zoomGrid });

const dbSetZoomGrid = debounce(1000, false, async (projectId, previousZoomGrid, zoomGrid) => {
    try {
        await getAppsyncClient().mutate({
            mutation: operations.mutations.setZoomGridMutation,
            variables: {
                projectId,
                zoomGrid
            }
        });
    } catch (err) {
        await dispatch(setZoomGridLocal(previousZoomGrid));
        console.log(err);
    }
});

export const incrementStepZoom = () => async (dispatch, getState) => {
    const state = getState();
    const { project: { currentProjectId }, preferences: { zoomGrid: previousZoomGrid } } = state;
    if (!!currentProjectId && currentProjectId !== nullId) {
        let newZoomGrid = previousZoomGrid * 1.1;
        await dispatch(setZoomGrid(newZoomGrid));
    }
}

export const decrementStepZoom = () => async (dispatch, getState) => {
    const state = getState();
    const { project: { currentProjectId }, preferences: { zoomGrid: previousZoomGrid } } = state;
    if (!!currentProjectId && currentProjectId !== nullId) {
        let newZoomGrid = previousZoomGrid / 1.1;
        await dispatch(setZoomGrid(newZoomGrid))
    }
}

export const setZoomGrid = zoomGrid => async (dispatch, getState) => {
    const state = getState();
    const maxEndBar = maxEndBarSelector(state);
    const { project: { currentProjectId }, preferences: { zoomGrid: previousZoomGrid } } = state;
    if (!!currentProjectId && currentProjectId !== nullId) {
        if (100 * maxEndBar * zoomGrid > 32000) {
            zoomGrid = 32000 / (100 * maxEndBar);
        } else if (100 * maxEndBar * zoomGrid < 400) {
            zoomGrid = 400 / (100 * maxEndBar);
        }
        if (previousZoomGrid !== zoomGrid) {
            GridService.zoom = zoomGrid;
            await dispatch(setZoomGridLocal(zoomGrid));
            await dbSetZoomGrid(currentProjectId, previousZoomGrid, zoomGrid);
        }
    }
}

