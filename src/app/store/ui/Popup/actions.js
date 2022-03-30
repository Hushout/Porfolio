import { getAppsyncClient } from "../../../apiClient/APIClient";
import { AudioService } from "../../../services";
import { operations } from "./operations";
import { types, updateAppStatus } from "./types";

export const setShowAddCollab = showAddCollab => async dispatch => await dispatch({ type: types.setShowAddCollab, showAddCollab });

export const setShowCreateTrack = showCreateTrack => async dispatch => await dispatch({ type: types.setShowCreateTrack, showCreateTrack });

export const setShowFeedBack = showFeedBack => async dispatch => await dispatch({ type: types.setShowFeedBack, showFeedBack });

export const setShowEditorAvatar = (show, file = undefined) => async dispatch => await dispatch({
    type: types.setShowEditorAvatar, 
    editorAvatar:{
        show,
        file
    },
});


export const setShowCreateProject = showCreateProject => async dispatch => await dispatch({ type: types.setShowCreateProject, showCreateProject });

export const setShowConfirmPopup = show => async dispatch => await dispatch({ type: types.setShowConfirmPopup, show });
export const setConfirmPopup = ({ show, title, text, onConfirm, canDismiss = true }) => async dispatch => await dispatch({
    type: types.setConfirmPopup,
    confirm: {
        show,
        title,
        text,
        onConfirm,
        canDismiss
    }
});


export const setShowAckPopup = show => async dispatch => await dispatch({ type: types.setShowAckPopup, show });
export const setAckPopup = ({ show, title, text, onAck = () => undefined,showSubscribeBtn,canDismiss = true }) => async dispatch => await dispatch({
    type: types.setAckPopup,
    ack: {
        show,
        title,
        text,
        onAck,
        showSubscribeBtn,
        canDismiss
    }
});

export const setShowErrorPopup = show => async dispatch => await dispatch({ type: types.setShowErrorPopup, show });
export const setErrorPopup = ({ show, title, text, onError, canDismiss = true }) => async dispatch => await dispatch({
    type: types.setErrorPopup,
    error: {
        show,
        title,
        text,
        onError,
        canDismiss
    }
});

export const setShowWarningPopup = show => async dispatch => await dispatch({ type: types.setShowWarningPopup, show });
export const setWarningPopup = ({ show, onWarning, canDismiss = true }) => async dispatch => await dispatch({
    type: types.setWarningPopup,
    warning: {
        show,
        onWarning,
        canDismiss
    }
});

export const setShowInfoHotkeyPopup = show => async dispatch => await dispatch({ type: types.setShowInfoHotkeyPopup, show });
export const setShowFaqPopup = show => async dispatch => await dispatch({ type: types.setShowFaqPopup, show });

export const setExportAudioPopup = (show, track, region, progress = 0) => async dispatch => await dispatch({ type: types.setExportAudioPopup, show, track, region, progress });

export const setCreateToDoPopup = (show, track = null, todoId = null, x = 0, y = 0) => async dispatch => await dispatch({ type: types.setCreateToDoPopup, show, track, todoId, x, y });

export const setGridMenu = (region = undefined, track = undefined, show = false, x = 0, y = 0) => async dispatch => await dispatch({ type: types.setGridMenu, region, track, show, x, y });

export const setShowDeleteProjectPopup = show => async dispatch => await dispatch({ type: types.setShowDeleteProjectPopup, show });

export const closeAllPopups = () => async dispatch => await dispatch({ type: types.closeAllPopups });

export const updateAppLocally = status => async dispatch => {
    console.log('status received', status)
    if (status !== updateAppStatus.none && AudioService.isPlaying) {
        AudioService.stop();
    }
    await dispatch({
        type: types.updateApp,
        status
    });
}

export const loadUpdateApp = () => async dispatch => {
    try {
        const { data: { updateApp } } = await getAppsyncClient().mutate({
            mutation: operations.queries.updateAppQuery
        });
        if (updateApp.status !== updateAppStatus.done) {
            await dispatch(updateAppLocally(updateApp.status));
        }
    } catch (err) {
        console.log(err);
    }
}