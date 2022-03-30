import { types } from './types';
import { operations } from './operations';
import { getAppsyncClient } from '../../apiClient/APIClient';
import { AudioService } from '../../services';
import { cancelRecRegion } from '../track/actions';
import {setCurrentUserTotalAudioStorage} from '../user/types';

export const upsertProject = project => async dispatch => await dispatch({ type: types.upsertProject, project });

export const setProjectNameLocally = (project, name) => async dispatch => await dispatch({ type: types.setProjectName, project, name });


export const setProjectName = (project, name) => async dispatch => {
    const oldProjectName = project.name;
    await dispatch(setProjectNameLocally(project, name));
    try {
        await getAppsyncClient().mutate({
            mutation: operations.mutations.setProjectName,
            variables: {
                projectId: project.id,
                name
            }
        })
    } catch (err) {
        await dispatch(setProjectNameLocally(project, oldProjectName));
        console.log(err);
    }
}

export const upsertUserProjects = (userToUpsert) => async dispatch => await dispatch({ type: types.upsertUserProjects, userToUpsert });

export const removeProject = project => async (dispatch, getState) => {
    const { project: { currentProjectId } } = getState();
    if (project.id === currentProjectId && AudioService.isPlaying) {
        AudioService.stop();
    }
    await dispatch({ type: types.removeProject, project });
}
export const updateProjectInvitesLocally = (projectId, invites) => async dispatch => await dispatch({ type: types.updateProjectInvites, projectId, invites });

export const updateProjectKnownInvitesLocally = (projectId, knownInvites) => async dispatch => await dispatch({ type: types.updateProjectKnownInvites, projectId, knownInvites });
export const loadProjects = () => async (dispatch) => {
    try {
        await dispatch(setLoadingProjects(true));
        const { data: { projects } } = await getAppsyncClient().query({
            query: operations.queries.projectsQuery
        });
        await dispatch({ type: types.setProjects, projects });
        await dispatch(setLoadingProjects(false));
    }
    catch (err) {
        await dispatch(setLoadingProjects(false));
        await dispatch({ type: types.setProjects, projects: [] });
        console.log(err);
    }
}
export const setCurrentProject = (currentProject) => async dispatch => await dispatch({ type: types.setCurrentProject, currentProject });

export const addCollaboratorAsync = (user, project) => async dispatch => await dispatch({ type: types.addCollaborator, user, project });

export const addCollaboratorFromInvite = (user, project) => async dispatch => await dispatch({ type: types.addCollaboratorFromInvite, user, project });

export const addCollaboratorFromKnownInvite = (user, project) => async dispatch => await dispatch({ type: types.addCollaboratorFromKnownInvite, user, project });
export const addCollaborator = (user, project) => async dispatch => {
    try {
        await dispatch(addCollaboratorAsync(user, project));
        await getAppsyncClient().mutate({
            mutation: operations.mutations.addCollaboratorMutation,
            variables: { userId: user.id, projectId: project.id }
        });
    } catch (err) {
        await dispatch(removeCollaboratorAsync(user, project));
        console.log(err);
    }
}

export const removeCollaboratorAsync = (user, project) => async dispatch => await dispatch({ type: types.removeCollaborator, user, project });
export const removeCollaborator = (user, project) => async dispatch => {
    try {
        await dispatch(removeCollaboratorAsync(user, project));
        await getAppsyncClient().mutate({
            mutation: operations.mutations.removeCollaboratorMutation,
            variables: { userId: user.id, projectId: project.id }
        });
    } catch (err) {
        await dispatch(addCollaboratorAsync(user, project));
        console.log(err);
    }
}

const removeProjectInviteAsync = (email, project) => async dispatch => {
    await dispatch({ type: types.removeProjectInvite, email, project });
}
export const removeProjectInvite = (email, project) => async dispatch => {
    const previousInvites = project.invites;
    try {
        await dispatch(removeProjectInviteAsync(email, project));
        await getAppsyncClient().mutate({
            mutation: operations.mutations.removeProjectInviteMutation,
            variables: {
                projectId: project.id,
                email
            }
        });
    } catch (err) {
        console.log(err);
        await dispatch(upsertProject({ ...project, invites: previousInvites }));
    }
}

const removeProjectKnownInviteAsync = (user, project) => async dispatch => {
    await dispatch({ type: types.removeProjectKnownInvite, user, project });
}
export const removeProjectKnownInvite = (user, project) => async dispatch => {
    const previousKownInvites = project.knownInvites;
    try {
        await dispatch(removeProjectKnownInviteAsync(user, project));
        await getAppsyncClient().mutate({
            mutation: operations.mutations.removeProjectKnownInviteMutation,
            variables: {
                projectId: project.id,
                inviteId: user.id
            }
        });
    } catch (err) {
        console.log(err);
        await dispatch(upsertProject({ ...project, kownInvites: previousKownInvites }));
    }
}

export const createProject = (projectName) => async dispatch => {
    try {
        const { data: { addProject } } = await getAppsyncClient().mutate({
            mutation: operations.mutations.addProjectMutation,
            variables: { name: projectName }
        });
        await dispatch(storeProject(addProject))
        return addProject;
    } catch (err) {
        console.log(err);
    }
}

const storeProject = project => async dispatch => await dispatch({ type: types.storeProject, project });

export const setTempo = tempo => async (dispatch, getState) => {
    const { project: { currentProjectId, projects } } = getState();
    const currentProject = projects.find(p => p.id === currentProjectId);
    if (!!currentProject) {
        const previousTempo = currentProject.tempo;
        await dispatch({ type: types.setTempo, tempo });
        AudioService.setBar(AudioService.getBar());
        try {
            await getAppsyncClient().mutate({
                mutation: operations.mutations.setTempoMutation,
                variables: { projectId: currentProjectId, tempo }
            })
        } catch (err) {
            console.log(err);
            await dispatch({ type: types.setTempo, tempo: previousTempo });
            AudioService.setBar(AudioService.getBar());
        }
    }
}

export const setLoadingProjects = loadingProjects => async dispatch => await dispatch({ type: types.setLoadingProjects, loadingProjects });

export const setDivision = division => async (dispatch, getState) => {
    const { project: { currentProjectId, projects } } = getState();
    const currentProject = projects.find(p => p.id === currentProjectId);
    if (!!currentProject) {
        const previousDivision = !!currentProject.division ? currentProject.division : { nbBeatsPerBar: 4, unity: 4 };
        await dispatch({ type: types.setDivision, division });
        try {
            await getAppsyncClient().mutate({
                mutation: operations.mutations.setDivisionMutation,
                variables: {
                    projectId: currentProjectId, division: {
                        nbBeatsPerBar: division.nbBeatsPerBar,
                        unity: division.unity
                    }
                }
            });
        } catch (err) {
            console.log(err);
            await dispatch({ type: types.setDivision, division: previousDivision });
        }
    }
}
export const updateUserPresenceLocally = ({ userId, projectId, online, isVisioChat, currentTime, isPlaying, loopBar }) => async dispatch => await dispatch({
    type: types.updateUserPresence, userId,
    projectId,
    online,
    isVisioChat,
    currentTime,
    isPlaying,
    loopBar
});

export const loadProject = projectId => async dispatch => {
    try {
        const { data: { project } } = await getAppsyncClient().query({
            query: operations.queries.projectQuery,
            variables: { projectId }
        });
        await dispatch({ type: types.loadProject, project });
    } catch (e) {
        console.log(e);
    }
}

export const deleteCurrentProject = () => async (dispatch, getState) => {
    const { project: { projects, currentProjectId } } = getState();
    const currentProject = projects.find(p => p.id === currentProjectId);

    if (!!currentProject) {
        try {
            await dispatch(cancelRecRegion());
            await getAppsyncClient().mutate({
                mutation: operations.mutations.deleteProjectMutation,
                variables: {
                    projectId: currentProjectId
                }
            });
            if (AudioService.isPlaying) {
                AudioService.stop();
            }
            await dispatch(removeProject(currentProject));

        } catch (err) {
            await dispatch(upsertProject(currentProject));
            console.log(err);
        }
    }
}

export const setAudioStorage = (projectId, audioStorage, totalAudioStorage) => async (dispatch,getState) => {
    await dispatch({ type: types.setAudioStorage, projectId, audioStorage, totalAudioStorage });
    const { project: { projects } , user: { currentUser } } = getState();
    const project = projects.find( p => p.id === projectId);
    if (!!project && !!currentUser && project.owner.id === currentUser.id) { 
        await dispatch({type: setCurrentUserTotalAudioStorage , totalAudioStorage});
    }
    
}

export const updateAudioFiles = (projectId, audioFiles) => async dispatch => await dispatch({ type: types.updateAudioFiles, projectId, audioFiles });

export const deleteFile = fileId => async (dispatch, getState) => {
    const { project: { projects, currentProjectId } } = getState();
    const currentProject = projects.find(p => p.id === currentProjectId);
    const previousAudioFiles = currentProject.audioFiles;

    try {
        await dispatch({ type: types.deleteFile, projectId: currentProjectId, fileId });
        const res = await getAppsyncClient().mutate({
            mutation: operations.mutations.deleteFileMutation,
            variables: {
                fileId,
                projectId: currentProjectId
            }
        });

    } catch (err) {
        await dispatch(updateAudioFiles(currentProjectId, previousAudioFiles));
        console.log(err);
    }
}