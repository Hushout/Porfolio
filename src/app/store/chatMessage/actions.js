import { types } from './types';
import { getAppsyncClient } from '../../apiClient/APIClient';
import { operations } from './operations';
import throttle from 'lodash.throttle';
import { loadProject } from '../project/actions';
import { setNbUnreadMessages } from '../ui/layout/actions';

export const addChatMessage = message => async dispatch => await dispatch({ type: types.addChatMessage, message });


export const replaceChatMessage = message => async dispatch => {
    await dispatch(setNbUnreadMessages());
    await dispatch({ type: types.replaceChatMessage, message });
}
export const insertChatMessage = (message) => async (dispatch, getState) => {
    const { chat: { selectedChatProjectId }, user: { currentUser } } = getState();

    const date = new Date();
    const localMessage = {
        message,
        userId: currentUser.id,
        projectId: selectedChatProjectId,
        date,
        id: `${selectedChatProjectId}-${currentUser.id}`
    };
    await dispatch(addChatMessage(localMessage));

    try {
        await getAppsyncClient().mutate({
            mutation: operations.mutations.addChatMessageMutation,
            variables: { projectId: selectedChatProjectId, message }
        });
    } catch (err) {
        await dispatch({ type: types.removeChatMessage, message: localMessage })
        console.log(err);
    }
}

export const loadChatMessages = callback => async (dispatch, getState) => {
    const { chat: { selectedChatProjectId: projectId } } = getState();
    if (!!projectId) {
        try {
            const { data: { chatMessages } } = await getAppsyncClient().query({
                query: operations.queries.chatMessagesQuery,
                variables: { projectId }
            })
            await dispatch({ type: types.setChatMessages, messages: chatMessages });
            if (!!callback) {
                callback();
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        if (!!callback) {
            callback();
        }
    }
}

export const setSelectedChatProject = (project) => async (dispatch) => {
    await dispatch({
        type: types.setSelectedChatProject,
        selectedChatProject: project
    });
    if (!!project) {
        await dispatch(loadProject(project.id));
    }
    await dispatch(loadChatMessages());
}

const addWriter = userId => async dispatch => await dispatch({ type: types.addWriter, userId });
const removeWriterDebounced = userId => async dispatch => await dispatch({
    type: types.removeWriter, userId, meta: {
        debounce: { time: 3000 }
    }
});

export const receiveIsWriting = message => async (dispatch, getState) => {
    const { user: { currentUser } } = getState();
    if (message.userId !== currentUser.id) {
        await dispatch(addWriter(message.userId));
        await dispatch(removeWriterDebounced(message.userId));
    }
}

const sendThrottleIsWriting = throttle(async projectId => {
    try {
        await getAppsyncClient().mutate({
            mutation: operations.mutations.isWritingMutation,
            variables: {
                projectId
            }
        })
    } catch (err) {
        console.log(err);
    }
}, 3000, {
    leading: true,
    trailing: false
});

export const sendIsWriting = () => async (_, getState) => {
    const { chat: { selectedChatProjectId: projectId } } = getState();
    if (!!projectId) {
        await sendThrottleIsWriting(projectId);
    }
}