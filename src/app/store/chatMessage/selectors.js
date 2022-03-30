import { createSelector } from 'reselect';
import { projectsSelector, currentProjectSelector } from '../project/selectors';

export const chatMessagesSelector = state => state.chat.messages;

const sortedChatMessagesSelector = createSelector(
    chatMessagesSelector,
    chatMessages => chatMessages.sort((a, b) => a.date.getTime() - b.date.getTime())
);

export const groupeMessageSelector = createSelector(
    sortedChatMessagesSelector,
    datemess => {
        const res = [];
        if (datemess.length > 0) {
            datemess.forEach(mess => {
                const lastGroup = getLastItem(res);
                if (!!lastGroup) {
                    const lastElem = getLastItem(lastGroup);
                    if (lastElem.userId === mess.userId && mess.date.getTime() - lastElem.date.getTime() < 2 * 60 * 1000) {
                        lastGroup.push(mess);
                    } else {
                        res.push([mess]);
                    }
                } else {
                    res.push([mess]);
                }
    
            })
        }
        return res;
    }
);

const getLastItem = list => {
    if (list.length > 0) {
        return list[list.length - 1];
    }
    return;
}

export const selectedChatProjectIdSelector = state => state.chat.selectedChatProjectId;

export const selectedChatProjectSelector = createSelector(
    selectedChatProjectIdSelector,
    projectsSelector,
    currentProjectSelector,
    (selectedChatProjectId, projects, currentProject) => {
        if (!!currentProject && currentProject.id === selectedChatProjectId) {
            return currentProject;
        }
        if (!!projects) {
            return projects.find(p => p.id === selectedChatProjectId);
        }
    } 
);

export const writersSelector = state => state.chat.writers;