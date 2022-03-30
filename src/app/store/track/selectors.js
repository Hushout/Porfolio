import { nullId } from "../../services";
import { createSelector } from 'reselect';
import { TimeService } from "../../services/audio/TimeService";

const getTracks = state => state.track.tracks;

export const currentTrackSelector = createSelector(
    getTracks,
    tracks => tracks.find(t => t.selected)
);

export const tracksSelector = createSelector(
    getTracks,
    tracks => tracks.filter(t => t.id !== nullId).sort((a,b) => a.index - b.index)
);

export const masterTrackSelector = createSelector(
    getTracks,
    tracks => tracks.find(t => t.id === nullId)
);

export const nbTracksSelector = createSelector(
    tracksSelector,
    tracks => tracks.length
);

export const globalSoloSelector = createSelector(
    getTracks,
    tracks => tracks.filter(t => t.solo).length > 0
);

export const todosSelector = createSelector(
    getTracks,
    tracks => tracks.filter(t => !!t.todos)
    .map(t => t.todos.map(t => ({
        ...t,
        dateCreation: new Date(t.dateCreation),
        lastUpdate: new Date(t.lastUpdate) 
    })))
    .flat()
    .sort((a, b) => a.dateCreation - b.dateCreation)
);

export const selectedTodoSelector = createSelector(
    todosSelector,
    todos => {
        const todo = todos.find(t => t.selected);
        if (!!todo) {
            todo.dateCreation = new Date(todo.dateCreation);
            todo.lastUpdate = new Date(todo.lastUpdate);
        }
        return todo;
    }
);


export const regionsSelector = createSelector(
    tracksSelector,
    tracks => tracks.map(t => !!t.regions ? t.regions : []).flat()
);

export const maxEndBarSelector = createSelector(
    regionsSelector,
    regions => {
        const defaultNbBar = 80;
        if (regions.length > 0) {
            const maxEndBar = Math.max(...regions.map(r => !!r.begin && !!r.duration ? r.begin + TimeService.secToBar(r.duration) : 0)) + 4;
            if (maxEndBar < defaultNbBar) {
                return defaultNbBar;
            }
            return maxEndBar;
        } else {
            return defaultNbBar;
        }
    }
);

export const isAnyTrackRecSelector = createSelector(
    tracksSelector,
    tracks => tracks.some(t => t.rec)
);

export const monitoringSelector = state => state.track.monitoring;