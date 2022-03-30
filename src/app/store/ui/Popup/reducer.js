import { types, updateAppStatus } from './types';

export const initialState = {
    showAddCollab: false,
    showCreateTrack: false,
    showCreateProject: false,
    createToDo: {
        show: false,
        track: false,
        todoId: null,
        x: 0,
        y: 0,
    },
    exportAudio: {
        show: false,
        track: undefined,
        region: undefined,
        progress: 0
    },
    confirm: {
        show: false,
        title: '',
        text: '',
        onConfirm: () => undefined,
        canDismiss: true
    },
    ack: {
        show: false,
        title: '',
        text: '',
        showSubscribeBtn:false,
        onAck: () => undefined,
        canDismiss: true
    },
    error: {
        show: false,
        title: '',
        text: '',
        onError: () => undefined,
        canDismiss: true
    },
    warning: {
        show: false,
        onWarning: () => undefined,
        canDismiss: true
    },
    infoHotkey: {
        show: false,
        canDismiss: true
    },
    faq: {
        show: false,
        canDismiss: true
    },
    gridMenu: {
        region: undefined,
        track: undefined,
        show: false,
        x: 0,
        y: 0
    },
    showDeleteProject: false,
    updateApp: {
        status: updateAppStatus.none
    },
    showFeedBack: false,
    editorAvatar: {
        show: false,
        file: undefined,
    }
};

export const UIPopupReducer = function (state = initialState, action) {
    switch (action.type) {
        case types.setShowAddCollab:
            return { ...state, showAddCollab: action.showAddCollab };
        case types.setShowCreateTrack:
            return { ...state, showCreateTrack: action.showCreateTrack };
        case types.setShowFeedBack:
            return { ...state, showFeedBack: action.showFeedBack };
        case types.setShowCreateProject:
            return { ...state, showCreateProject: action.showCreateProject };
        case types.setConfirmPopup:
            return { ...state, confirm: action.confirm };
        case types.setShowConfirmPopup:
            return {
                ...state, confirm: {
                    ...state.confirm,
                    show: action.show,
                }
            };
        case types.setAckPopup:
            return { ...state, ack: action.ack };
        case types.setShowAckPopup:
            return {
                ...state, ack: {
                    ...state.ack,
                    show: action.show,
                    showSubscribeBtn: !action.show? action.show:state.ack.showSubscribeBtn,
                }
            };
        case types.setShowEditorAvatar:
            return {
                ...state, editorAvatar: {
                    ...state.editorAvatar,
                    show: action.editorAvatar.show,
                    file: action.editorAvatar.file
                }
            };
        case types.setErrorPopup:
            return { ...state, error: action.error };
        case types.setShowErrorPopup:
            return {
                ...state, error: {
                    ...state.error,
                    show: action.show
                }
            };
        case types.setWarningPopup:
            return { ...state, warning: action.warning };
        case types.setShowWarningPopup:
            return {
                ...state, warning: {
                    ...state.warning,
                    show: action.show
                }
            };
        case types.setShowInfoHotkeyPopup:
            return {
                ...state,
                infoHotkey: {
                    ...state.infoHotkey,
                    show: action.show
                }
            };
        case types.setShowFaqPopup:
            return {
                ...state,
                faq: {
                    ...state.faq,
                    show: action.show
                }
            };
        case types.setExportAudioPopup:
            return {
                ...state,
                exportAudio: {
                    show: action.show,
                    track: action.track,
                    region: action.region,
                    progress: action.progress
                }
            };
        case types.setCreateToDoPopup:
            return {
                ...state,
                createToDo: {
                    show: action.show,
                    track: action.track,
                    todoId: action.todoId,
                    x: action.x,
                    y: action.y
                }
            };
        case types.setGridMenu:
            return {
                ...state,
                gridMenu: {
                    region: action.region,
                    track: action.track,
                    show: action.show,
                    x: action.x,
                    y: action.y
                }
            };
        case types.setShowDeleteProjectPopup:
            return {
                ...state,
                showDeleteProject: action.show
            };
        case types.closeAllPopups:
            return {
                ...state,
                showAddCollab: false,
                showCreateTrack: false,
                showCreateProject: false,
                createToDo: { ...state.createToDo, show: false },
                exportAudio: { ...state.exportAudio, show: false },
                confirm: { ...state.confirm, show: false },
                ack: { ...state.ack, show: false },
                error: { ...state.error, show: false },
                warning: { ...state.warning, show: false },
                infoHotkey: { ...state.infoHotkey, show: false },
                faq: { ...state.faq, show: false },
                gridMenu: { ...state.gridMenu, show: false },
                showDeleteProject: false
            };
        case types.updateApp:
            return {
                ...state,
                updateApp: {
                    status: action.status
                }
            };
        default:
            return state;
    }
}