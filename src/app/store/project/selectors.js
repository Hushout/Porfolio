import { createSelector } from 'reselect';
import { subscriptionTypes } from '../payment/types';
import { tracksSelector } from '../track/selectors';

const currentUserSelector = state => !!state.user.currentUser ? state.user.currentUser : null;

export const currentProjectIdSelector = state => state.project.currentProjectId;

export const projectsSelector = state => !!state && !!state.project ? state.project.projects : [];

export const sortedProjectsSelector = createSelector(
    projectsSelector,
    currentUserSelector,
    (projects, currentUser) => projects !== [] && !!currentUser ? [
        ...projects.filter(p => p.owner.id !== currentUser.id).sort((a, b) => a.name.localeCompare(b.name)),
        ...projects.filter(p => p.owner.id === currentUser.id && p.collaborators.length === 0).sort((a, b) => a.name.localeCompare(b.name)),
        ...projects.filter(p => p.owner.id === currentUser.id && p.collaborators.length > 0).sort((a, b) => a.name.localeCompare(b.name))] : []
)

export const nbProjectsSelector = state => !!state.project.projects ? state.project.projects.length : 0;

export const isLoadingProjectSelector = state => state.project.loadingProjects;

export const currentProjectSelector = createSelector(
    currentProjectIdSelector,
    projectsSelector,
    (currentProjectId, projects) => !!projects ? projects.find(p => p.id === currentProjectId) : undefined
);

export const tempoSelector = createSelector(
    currentProjectIdSelector,
    projectsSelector,
    (currentProjectId, projects) => !!currentProjectId && !!projects ? projects.find(p => p.id === currentProjectId).tempo : 120
)

export const divisionSelector = createSelector(
    currentProjectIdSelector,
    projectsSelector,
    (currentProjectId, projects) => !!currentProjectId && !!projects ? projects.find(p => p.id === currentProjectId).division : { nbBeatsPerBar: 4, unity: 4 }
)

export const isOwnerSelector = createSelector(
    currentProjectIdSelector,
    projectsSelector,
    currentUserSelector,
    (currentProjectId, projects, currentUser) => !!currentProjectId && !!projects && !!currentUser && !!projects.find(p => p.id === currentProjectId)? projects.find(p => p.id === currentProjectId).owner.id === currentUser.id : false
);

export const currentProjectOwnerSelector = createSelector(
    currentProjectIdSelector,
    projectsSelector,
    currentUserSelector,
    (currentProjectId, projects, currentUser) => !!currentProjectId && !!projects && !!currentUser && !!projects.find(p => p.id === currentProjectId)? projects.find(p => p.id === currentProjectId).owner: null
);

export const currentProjectOwnerLimitOfCloudSelector = createSelector(
    currentProjectOwnerSelector,
    (currentProjectOwner) => !!currentProjectOwner? currentProjectOwner.subscriptionType === subscriptionTypes.free ? 1*10e7 : currentProjectOwner.subscriptionType === subscriptionTypes.premium? 2*10e8 : 2*10e9 : 0
);

export const projectUsersSelector = createSelector(
    currentProjectSelector,
    currentUserSelector,
    (currentProject, currentUser) => {
        if (!!currentProject && !!currentUser) {
            const collabs = [];
            if (currentProject.owner.id !== currentUser.id) {
                collabs.push(currentProject.owner);
            }
            currentProject.collaborators.forEach(c => {
                if (c.id !== currentUser.id) {
                    collabs.push(c);
                }
            });
            return collabs;
        }
        return [];
    }
);

export const nbProjectCreatedSelector = createSelector(
    currentUserSelector,
    projectsSelector,
    (currentUser, projects) => projects.filter(p => p.owner.id === currentUser.id).length
);

export const knownCollaboratorsSelector = createSelector(
    currentProjectSelector,
    currentProject => !!currentProject ? [currentProject.owner, ...currentProject.collaborators] : []
);


export const mytotalAudioStorageSelector = createSelector(
    projectsSelector,
    currentUserSelector,
    (projects, currentUser) => {
        if (!!currentUser) {
            const myProjects = projects.filter(p => p.owner.id === currentUser.id);
            let totalAudioStorage = 0;
            if (myProjects.length > 0) {
                totalAudioStorage += myProjects.map(p => p.audioStorage).reduce((a, b) => a + b);
            }
            return totalAudioStorage;
        }
        return 0;
    }
)

export const filesSelector = createSelector(
    currentProjectSelector,
    tracksSelector,
    (currentProject, tracks) => {
        const projectFiles = !!currentProject.audioFiles ? currentProject.audioFiles.map(f => ({
            ...f,
            creationDate: new Date(f.creationDate)
        })) : [];
        const allRegions = tracks.map(t => !!t.regions ? t.regions.map(r => ({
            ...r,
            trackIndex: t.index
        })) : []).flat();
        projectFiles.forEach(f => {
            f.regions = allRegions.filter(r => !!r.audioData && r.audioData.fileId === f.id)
        });
        return projectFiles.sort((f1, f2) => f1.creationDate - f2.creationDate);
    }
)