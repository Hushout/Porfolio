import { types as projectActionTypes } from './types';
import { AudioService } from '../../services/audio/AudioService';
import { nullId } from '../../services';
import { TimeService } from '../../services/audio/TimeService';

export const initialState = {
  loadingProjects: false,
  projects: [],
  currentProjectId: nullId
};

export const projectReducer = function (state = initialState, action) {
  switch (action.type) {
    case projectActionTypes.setProjectName:
      const NewProjects = state.projects.map(p => p.id === action.project.id ? { ...p, name: action.name } : ({ ...p }));
      return { ...state, projects: NewProjects }
    case projectActionTypes.setLoadingProjects:
      return { ...state, loadingProjects: action.loadingProjects };
    case projectActionTypes.setProjects:
      return { ...state, projects: !!action.projects ? action.projects : [] };
    case projectActionTypes.setCurrentProject:
      if (!!action.currentProject) {
        TimeService.tempo = action.currentProject.tempo;
        TimeService.division.nbBeatsPerBar = action.currentProject.division.nbBeatsPerBar;
        TimeService.division.unity = action.currentProject.division.unity;
        return { ...state, currentProjectId: action.currentProject.id };
      }
      return { ...state, currentProjectId: nullId };
    case projectActionTypes.upsertUserProjects:
      return {
        ...state,
        projects: state.projects.map(p => ({
          ...p,
          owner: p.owner.id === action.userToUpsert.id ? action.userToUpsert : p.owner,
          collaborators: p.collaborators.map(c => c.id === action.userToUpsert.id ? action.userToUpsert : c)
        }))
      };

    case projectActionTypes.upsertProject:
      const existingProject = state.projects.find(p => p.id === action.project.id);
      if (!!existingProject) {
        if (existingProject.tempo !== action.project.tempo) {
          TimeService.tempo = action.project.tempo;
        }
        if (existingProject.division.unity !== action.project.division.unity) {
          TimeService.division.unity = action.project.division.unity;
        }
        if (existingProject.division.nbBeatsPerBar !== action.project.division.nbBeatsPerBar) {
          TimeService.division.nbBeatsPerBar = action.project.division.nbBeatsPerBar;
        }
        const isCurrentProject = !!state.currentProjectId && state.currentProjectId === action.project.id;
        return {
          ...state,
          projects: state.projects.map(p => p.id === action.project.id ? action.project : p),
          currentProjectId: isCurrentProject ? action.project.id : state.currentProjectId
        };
      }
      return { ...state, projects: [...state.projects, action.project] };
    case projectActionTypes.addCollaborator:
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.project.id && !p.collaborators.find(c => c.id === action.user.id) ? {
          ...p,
          collaborators: [...p.collaborators, action.user]
        } : p)
      };
    case projectActionTypes.addCollaboratorFromInvite:
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.project.id && !p.collaborators.find(c => c.id === action.user.id) ? {
          ...p,
          collaborators: [...p.collaborators, action.user],
          invites: p.invites.filter(i => i !== action.user.email)
        } : p)
      };
    case projectActionTypes.addCollaboratorFromKnownInvite:
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.project.id && !p.collaborators.find(c => c.id === action.user.id) ? {
          ...p,
          collaborators: [...p.collaborators, action.user],
          knownInvites: p.knownInvites.filter(i => i.id !== action.user.id)
        } : p)
      };
    case projectActionTypes.removeCollaborator:
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.project.id ? { ...p, collaborators: [...p.collaborators.filter(c => c.id !== action.user.id)] } : p)
      };
    case projectActionTypes.removeProject:
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.project.id),
        currentProjectId: action.project.id === state.currentProjectId ? nullId : state.currentProjectId
      };
    case projectActionTypes.storeProject:
      return {
        ...state,
        projects: [...state.projects.filter(p => p.id !== action.project.id), action.project]
      };
    case projectActionTypes.setTempo:
      TimeService.tempo = action.tempo;
      return {
        ...state,
        projects: state.projects.map(p => p.id === state.currentProjectId ? ({
          ...p,
          tempo: action.tempo
        }) : p)
      };
    case projectActionTypes.setDivision:
      if (TimeService.division.nbBeatsPerBar !== action.division.nbBeatsPerBar) {
        TimeService.division.nbBeatsPerBar = action.division.nbBeatsPerBar;
      }
      if (TimeService.division.unity !== action.division.unity) {
        TimeService.division.unity = action.division.unity;
      }
      return {
        ...state,
        projects: state.projects.map(p => p.id === state.currentProjectId ? ({
          ...p,
          division: action.division
        }) : p)
      };
    case projectActionTypes.updateUserPresence:
      return {
        ...state,
        projects: state.projects.map(p => ({
          ...p,
          owner: {
            ...p.owner,
            online: p.owner.id === action.userId ? action.online : p.owner.online,
            isVisioChat: p.owner.id === action.userId ? action.isVisioChat : p.owner.isVisioChat,
            projectIdPresence: p.owner.id === action.userId ? action.projectId : p.owner.projectIdPresence,
            currentTime: p.owner.id === action.userId ? action.currentTime : p.owner.currentTime,
            isPlaying: p.owner.id === action.userId ? action.isPlaying : p.owner.isPlaying,
            playTime: p.owner.id === action.userId ? AudioService.context.currentTime : p.owner.playTime,
            loopBar: p.owner.id === action.userId ? action.loopBar : p.owner.loopBar
          },
          collaborators: p.collaborators.map(c => ({
            ...c,
            online: c.id === action.userId ? action.online : c.online,
            isVisioChat: c.id === action.userId ? action.isVisioChat : c.isVisioChat,
            projectIdPresence: c.id === action.userId ? action.projectId : c.projectIdPresence,
            currentTime: c.id === action.userId ? action.currentTime : c.currentTime,
            isPlaying: c.id === action.userId ? action.isPlaying : c.isPlaying,
            playTime: c.id === action.userId ? AudioService.context.currentTime : c.playTime,
            loopBar: c.id === action.userId ? action.loopBar : c.loopBar,
          }))
        }))
      };
    case projectActionTypes.loadProject:
      return {
        ...state,
        projects: [...state.projects.filter(p => p.id !== action.project.id), action.project]
      };
    case projectActionTypes.updateProjectInvites:
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.projectId ? ({
          ...p,
          invites: action.invites
        }) : p)
      };
    case projectActionTypes.updateProjectKnownInvites:
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.projectId ? ({
          ...p,
          knownInvites: action.knownInvites
        }) : p)
      };
    case projectActionTypes.setAudioStorage:
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.projectId ? ({
          ...p,
          owner: {...p.owner,totalAudioStorage : action.totalAudioStorage},
          audioStorage: action.audioStorage
        }) : p)
      };
    case projectActionTypes.updateAudioFiles:
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.projectId ? ({
          ...p,
          audioFiles: action.audioFiles
        }) : p)
      };
    case projectActionTypes.deleteFile:
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.projectId ? ({
          ...p,
          audioFiles: p.audioFiles.filter(f => f.id !== action.fileId)
        }) : p)
      };
    case projectActionTypes.removeProjectInvite:
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.project.id ? { ...p, invites: [...p.invites.filter(i => i !== action.email)] } : p)
      };
    case projectActionTypes.removeProjectKnownInvite:
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.project.id ? { ...p, knownInvites: [...p.knownInvites.filter(c => c.id !== action.user.id)] } : p)
      };
    default:
      return state;
  }
}