import { createSelector } from 'reselect';
import { updateAppStatus } from './types';

export const UIPopupShowCreateTrackSelector = state => state.UI.popup.showCreateTrack;

export const UIPopupShowFeedBackSelector = state => state.UI.popup.showFeedBack;

export const UIPopupShowCreateProjectSelector = state => state.UI.popup.showCreateProject;

export const UIPopupConfirmSelector = state => state.UI.popup.confirm;

export const UIPopupAckSelector = state => state.UI.popup.ack;

export const UIPopupErrorSelector = state => state.UI.popup.error;

export const UIPopupWarningRecSelector = state => state.UI.popup.warning;

export const UIPopupInfoHotkeySelector = state => state.UI.popup.infoHotkey;

export const UIPopupFaqSelector = state => state.UI.popup.faq;

export const UIPopupExportAudioSelector = state => state.UI.popup.exportAudio;

export const UIPopupCreateToDoSelector = state => state.UI.popup.createToDo;

export const UIPopupShowDeleteProjectSelector = state => state.UI.popup.showDeleteProject;

export const updateAppStatusSelector = state => state.UI.popup.updateApp.status;

export const UIPopupShowUpdateAppSelector = state => state.UI.popup.updateApp.status !== updateAppStatus.none && state.UI.popup.updateApp.status !== updateAppStatus.unknown;

export const UIPopupShowAddCollabSelector = state => state.UI.popup.showAddCollab;

export const UIPopupEditorAvatarSelector = state => state.UI.popup.editorAvatar;

export const isPopupSelector = createSelector(
    UIPopupShowCreateTrackSelector,
    UIPopupShowCreateProjectSelector,
    UIPopupConfirmSelector,
    UIPopupAckSelector,
    UIPopupErrorSelector,
    UIPopupWarningRecSelector,
    UIPopupInfoHotkeySelector,
    UIPopupFaqSelector,
    UIPopupExportAudioSelector,
    UIPopupShowDeleteProjectSelector,
    UIPopupShowUpdateAppSelector,
    UIPopupShowFeedBackSelector,
    UIPopupShowAddCollabSelector,
    UIPopupEditorAvatarSelector,
    (showCreateTrack, showCreateProject, confirm, ack, error, warningRec, info, faq, exportAudio, deleteProject, showUpdateApp, showFeedBack, showAddCollab,editorAvatar) => showCreateTrack || showCreateProject || confirm.show || ack.show || error.show || warningRec.show || info.show || faq.show ||exportAudio.show || deleteProject || showUpdateApp || showFeedBack || showAddCollab || editorAvatar.show
);

export const gridMenuSelector = state => state.UI.popup.gridMenu;