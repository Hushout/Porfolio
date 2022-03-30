import { types } from './types';
import { nullId } from '../../services';
import { AudioGraphService, SchedulerService, AudioService } from '../../services/audio/AudioService';
import { GridWorkerService } from '../../services/workers/GridWorkerService';

const masterTrack = {
    id: nullId,
    name: 'Master',
    volume: 0.8,
    pan: 0,
    lock: false,
    type: 'audio',
    solo: false,
    mute: false,
    rec: false,
    selected: false,
    alreadyInUse: false,
    createdByMe: true
}

export const initialState = {
    monitoring: false,
    tracks: [masterTrack],
    cancelUploads: []
};

let masterNode;

export const trackReducer = function (state = initialState, action) {
    switch (action.type) {
        case types.setTracks:
            GridWorkerService.updateTracks(action);
            SchedulerService.clear();
            AudioGraphService.clear();

            state.tracks.forEach(t => AudioGraphService.cleanTrack(t.id));
            masterNode = AudioGraphService.createTrack(masterTrack);
            action.tracks.forEach(t => {
                AudioGraphService.createTrack(t, masterNode);
                t.regions.forEach(r => SchedulerService.addAudioRegion(r));
            });
            var soloTracks = action.tracks.filter(t => t.solo);
            var notSoloTracks = action.tracks.filter(t => !t.solo);
            soloTracks.forEach(t => {
                AudioGraphService.manageSolo(notSoloTracks, soloTracks, t, t.solo);
            });
            return {
                ...state,
                tracks: [
                    ...action.tracks.map(t => ({
                        ...t,
                        inputGain: 1
                    })),
                    masterTrack
                ]
            };
        case types.selectTrack:
            GridWorkerService.updateTracks(action);
            return { ...state, tracks: state.tracks.map(t => ({ ...t, selected: action.trackId === t.id })) };
        case types.updateTrackReleased:
        case types.updateTrackSelected:
            GridWorkerService.updateTracks(action);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id === action.track.id ? {
                    ...t,
                    alreadyInUse: action.track.alreadyInUse,
                    selected: action.track.selected,
                    selectedUserId: action.track.selectedUserId
                } : t)
            };
        case types.setTrackVolume:
            GridWorkerService.updateTracks(action);
            return { ...state, tracks: state.tracks.map(t => t.id === action.track.id ? { ...t, volume: action.volume } : t) };
        case types.deleteTrack:
            var existingTrack = state.tracks.find(t => t.id === action.track.id);
            if (!!existingTrack) {
                GridWorkerService.updateTracks(action);

                AudioGraphService.cleanTrack(action.track.id);
                if (action.track.type === 'audio' && existingTrack.regions) {
                    existingTrack.regions.forEach(r => SchedulerService.removeAudioRegion(r, r.trackId));
                }
            }

            return {
                ...state,
                tracks: state.tracks.filter(t => t.id !== action.track.id).map(t => ({
                    ...t,
                    index: t.index > action.track.index ? t.index - 1 : t.index,
                    todos: !!t.todos ? t.todos.map(td => ({
                        ...td,
                        trackIndex: t.index > action.track.index ? t.index - 1 : t.index
                    })) : []
                }))
            };
        case types.addTrack:
            GridWorkerService.updateTracks(action);
            masterNode = AudioGraphService.getTrackNode(nullId);
            AudioGraphService.createTrack(action.track, masterNode);
            if (action.track.type === 'audio' && !!action.track.regions) {
                action.track.regions.forEach(r => SchedulerService.updateAudioRegion(r));
            }
            return {
                ...state,
                tracks: [
                    ...state.tracks,
                    {
                        ...action.track,
                        inputGain: 1
                    }
                ]
            };
        case types.upsertTrack:
            GridWorkerService.updateTracks(action);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id === action.track.id ? ({ ...t, ...action.track }) : t)
            };
        case types.setRecTrack:
            GridWorkerService.updateTracks(action);
            state.tracks.filter(t => t.id !== nullId).forEach(t => {
                if (t.type === 'audio') {
                    var trackNode = AudioGraphService.getTrackNode(t.id);
                    if (!!trackNode && action.rec && t.id === action.track.id) {
                        trackNode.createInputMedia(t.inputGain).then(() => {
                            if (state.monitoring) {
                                trackNode.activeMonitoringInputMedia();
                            }
                        });
                    } else {
                        trackNode.cleanInputMedia();
                    }
                }
            })
            const newTracks = state.tracks.map(t => t.id === action.track.id ? {
                ...t,
                rec: action.rec
            } : ({
                ...t,
                rec: false
            }));
            return { ...state, tracks: newTracks };
        case types.setMonitoring:
            state.tracks
                .filter(t => t.id !== nullId && t.type === 'audio' && t.rec)
                .forEach(t => {
                    var trackNode = AudioGraphService.getTrackNode(t.id);
                    if (!!trackNode) {
                        if (action.monitoring) {
                            trackNode.activeMonitoringInputMedia();
                        } else {
                            trackNode.desactiveMonitoringInputMedia();
                        }
                    }
                });
            return {
                ...state,
                monitoring: action.monitoring
            };
        case types.setInputGain:
            return {
                ...state,
                tracks: state.tracks.map(t => t.id === action.track.id ? {
                    ...t,
                    inputGain: action.inputGain
                } : t)
            };
        case types.setSoloTrack:
            GridWorkerService.updateTracks(action);
            var tracks = state.tracks.filter(t => t.id !== nullId).map(t => t.id === action.track.id ? { ...t, solo: action.solo } : t);
            var soloTracks = tracks.filter(t => t.solo);
            var notSoloTracks = tracks.filter(t => !t.solo);
            AudioGraphService.manageSolo(notSoloTracks, soloTracks, action.track, action.solo);
            return { ...state, tracks: [masterTrack, ...tracks] };
        case types.setMuteTrack:
            GridWorkerService.updateTracks(action);
            action.mute ? AudioGraphService.mute(action.track.id) : AudioGraphService.unmute(action.track);
            return { ...state, tracks: state.tracks.map(t => t.id === action.track.id ? { ...t, mute: action.mute } : t) };
        case types.setPanTrack:
            GridWorkerService.updateTracks(action);
            AudioGraphService.setPan(action.track.id, action.pan);
            return { ...state, tracks: state.tracks.map(t => t.id === action.track.id ? { ...t, pan: action.pan } : t) };
        case types.toggleLockTrack:
            GridWorkerService.updateTracks(action);
            return { ...state, tracks: state.tracks.map(t => t.id === action.track.id ? { ...t, lock: !t.lock } : t) };
        case types.releaseSelectedTrack:
            GridWorkerService.updateTracks(action);
            return { ...state, tracks: state.tracks.map(t => ({ ...t, selected: false })) };
        case types.setTrackName:
            GridWorkerService.updateTracks(action);
            const NewTracks = state.tracks.map(t => t.id === action.track.id ? { ...t, name: action.name } : ({ ...t }));
            return { ...state, tracks: NewTracks }
        case types.createLocalRegion:
            GridWorkerService.updateTracks(action);
            var localRegion = {
                localId: action.localId,
                trackId: action.trackId,
                name: !!action.name ? action.name : '...',
                begin: action.begin,
                beginCrop: action.beginCrop,
                isRec: action.isRec,
                duration: action.duration,
                endCrop: action.duration
            };
            var tracks = state.tracks.map(t => t.id === action.trackId ?
                ({
                    ...t,
                    regions: [...t.regions, localRegion]
                }) : t);
            return { ...state, tracks };
        case types.addRegion:
            GridWorkerService.updateTracks(action);
            SchedulerService.addAudioRegion(action.region);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id === action.region.trackId ?
                    ({
                        ...t,
                        regions: [...t.regions, action.region]
                    }) : t)
            };
        case types.endLocalRegion:
            GridWorkerService.updateTracks(action);
            const trackEndLocalRegion = state.tracks.find(t => t.id === action.trackId);
            const regionToEnd = trackEndLocalRegion.regions.find(r => r.localId === action.localId);
            SchedulerService.addAudioRegion({
                ...regionToEnd,
                isRec: false,
                duration: action.duration,
                endCrop: action.duration
            });
            return {
                ...state,
                tracks: state.tracks.map(t => t.id === action.trackId ?
                    ({
                        ...t,
                        regions: t.regions.map(r => r.localId === action.localId ?
                            ({
                                ...r,
                                isRec: false,
                                duration: action.duration,
                                endCrop: action.duration
                            }) : r)
                    }) : t)
            };
        case types.deleteRegion:
            GridWorkerService.updateTracks(action);
            SchedulerService.removeAudioRegion(action.region, action.region.trackId);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id === action.region.trackId ?
                    ({
                        ...t,
                        regions: !action.region.id
                            ? t.regions.filter(r => r.localId !== action.region.localId)
                            : t.regions.filter(r => r.id !== action.region.id)
                    }) : t)
            };
        case types.insertAudioRegion:
            const currentTime = AudioService.context.currentTime;
            GridWorkerService.updateTracks({ ...action, currentTime });
            SchedulerService.addAudioRegion(action.region);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id === action.region.trackId ?
                    ({
                        ...t,
                        regions: [...t.regions, {
                            ...action.region,
                            recBeginTime: currentTime
                        }]
                    }) : t
                )
            };
        case types.upsertRegion:
            GridWorkerService.updateTracks(action);
            const track = state.tracks.find(t => t.id === action.region.trackId);
            if (!!track) {
                const existingRegion = track.regions.find(r => r.id === action.region.id);
                !!existingRegion ? SchedulerService.updateAudioRegion(action.region) : SchedulerService.addAudioRegion(action.region);
                return {
                    ...state,
                    tracks: state.tracks.map(t => t.id === action.region.trackId ?
                        ({
                            ...t,
                            regions: !!existingRegion
                                ? t.regions.map(r => r.id === existingRegion.id ? action.region : r)
                                : [...t.regions, action.region]
                        }) : t)
                };
            }
            return state;
        case types.deactivateGlobalSolo:
            GridWorkerService.updateTracks(action);
            var notSoloTracks = state.tracks.filter(t => t.id !== nullId && !t.solo);
            AudioGraphService.deactivateGlobalSolo(notSoloTracks);
            return { ...state, tracks: state.tracks.map(t => ({ ...t, solo: false })) };
        case types.audioRegionCached:
            GridWorkerService.updateTracks(action);

            const regionsToUpdate = state.tracks
                .map(t => !!t.regions ? t.regions : [])
                .flat()
                .filter(r => !!r.audioData && r.audioData.fileId === action.fileId);

            regionsToUpdate.forEach(r => SchedulerService.updateAudioRegion(r));

            return {
                ...state,
                tracks: state.tracks.map(t => ({
                    ...t,
                    regions: !t.regions ? [] : t.regions.map(r => !!r.audioData && r.audioData.fileId === action.fileId ? ({
                        ...r,
                        cached: true,
                        progress: undefined
                    }) : r)
                }))
            };
        case types.selectRegion:
            GridWorkerService.updateTracks(action);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id !== action.trackId ? t : ({
                    ...t,
                    regions: t.regions.length > 1 ? [...t.regions.filter(r => r.id !== action.regionId), t.regions.find(r => r.id === action.regionId)] : t.regions
                }))
            };
        case types.audioRegionProgress:
            GridWorkerService.updateTracks(action);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id !== action.trackId ? t : ({
                    ...t,
                    regions: t.regions.map(r => r.id !== action.regionId ? r : {
                        ...r,
                        progress: action.progress
                    })
                }))
            };
        case types.moveAudioRegion:
            GridWorkerService.updateTracks(action);
            SchedulerService.updateAudioRegion({ ...action.region, begin: action.begin })
            return {
                ...state,
                tracks: state.tracks.map(t => t.id !== action.region.trackId ? t : {
                    ...t,
                    regions: t.regions.map(r => r.id !== action.region.id ? r : {
                        ...r,
                        begin: action.begin
                    })
                })
            };
        case types.moveAudioRegionToTrack:
            GridWorkerService.updateTracks(action);
            const newRegion = { ...action.region, trackId: action.trackIdDest, begin: action.begin };
            SchedulerService.removeAudioRegion(action.region, action.trackIdFrom);
            SchedulerService.addAudioRegion(newRegion);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id === action.trackIdFrom ? {
                    ...t,
                    regions: t.regions.filter(r => r.id !== action.region.id)
                } : t.id === action.trackIdDest ? {
                    ...t,
                    regions: [...t.regions, newRegion]
                } : t)
            };
        case types.cropRightAudioRegion:
            GridWorkerService.updateTracks(action);
            SchedulerService.updateAudioRegion({ ...action.region, endCrop: action.endCrop });
            return {
                ...state,
                tracks: state.tracks.map(t => t.id !== action.region.trackId ? t : {
                    ...t,
                    regions: t.regions.map(r => r.id !== action.region.id ? r : {
                        ...r,
                        endCrop: action.endCrop
                    })
                })
            };
        case types.cropLeftAudioRegion:
            GridWorkerService.updateTracks(action);
            SchedulerService.updateAudioRegion({ ...action.region, begin: action.begin, beginCrop: action.beginCrop });
            return {
                ...state,
                tracks: state.tracks.map(t => t.id !== action.region.trackId ? t : {
                    ...t,
                    regions: t.regions.map(r => r.id !== action.region.id ? r : {
                        ...r,
                        begin: action.begin,
                        beginCrop: action.beginCrop
                    })
                })
            };
        case types.updateTrackIdLocally:
            GridWorkerService.updateTracks(action);
            AudioGraphService.updateTrackId(action.localTrack.id, action.track.id);
            if (action.localTrack.type === 'audio') {
                action.localTrack.regions.forEach(r => SchedulerService.removeAudioRegion(r, r.trackId));
            }
            action.track.regions.forEach(r => SchedulerService.updateAudioRegion(r));
            return {
                ...state,
                tracks: state.tracks.map(t => t.localId === action.localTrack.localId ? action.track : t)
            };
        case types.updateLocalRegion:
            GridWorkerService.updateTracks(action);
            SchedulerService.updateAudioRegion(action.region);
            var tracks = state.tracks.map(t => t.id === action.region.trackId ?
                ({
                    ...t,
                    regions: t.regions.map(r => r.localId === action.localId ? {
                        ...r,
                        ...action.region
                    } : r)
                }) : t);
            return { ...state, tracks };
        case types.cutRegion:
            GridWorkerService.updateTracks(action);
            SchedulerService.updateAudioRegion(action.updatedRegion);
            SchedulerService.addAudioRegion(action.newRegion);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id !== action.updatedRegion.trackId ? t : {
                    ...t,
                    regions: [
                        action.newRegion,
                        ...t.regions.map(r => r.id === action.updatedRegion.id ? action.updatedRegion : r)
                    ]
                })
            };
        case types.addTodo:
            GridWorkerService.updateTracks(action);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id !== action.trackId ? t : {
                    ...t,
                    todos: !!t.todos ? [...t.todos, action.todo] : [action.todo]
                })
            };
        case types.deleteTodo:
            GridWorkerService.updateTracks(action);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id !== action.trackId ? t : {
                    ...t,
                    todos: !!t.todos ? t.todos.map(todo => todo.id === action.todoId ? ({
                        ...todo,
                        state: 'DELETED'
                    }) : todo) : []
                })
            };
        case types.updateTodoLocally:
            GridWorkerService.updateTracks(action);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id !== action.trackId ? t : {
                    ...t,
                    todos: [
                        ...t.todos.filter(todo => todo.localId !== action.localId),
                        action.todo
                    ]
                })
            };
        case types.updateTodo:
            GridWorkerService.updateTracks(action);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id !== action.trackId ? t : {
                    ...t,
                    todos: [
                        ...t.todos.filter(todo => todo.id !== action.todo.id),
                        action.todo
                    ]
                })
            };
        case types.setSelectedTodo:
            GridWorkerService.updateTracks(action);
            return {
                ...state,
                tracks: state.tracks.map(t => ({
                    ...t,
                    todos: !!t.todos ? t.todos.map(td => ({
                        ...td,
                        selected: !!action.todo && action.todo.trackId === t.id && action.todo.id === td.id
                    })) : undefined
                }))
            };
        case types.updateTodos:
            GridWorkerService.updateTracks(action);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id === action.trackId ? ({
                    ...t,
                    todos: action.todos.map(td => {
                        if (!!t.todos) {
                            const existingTodo = t.todos.find(todo => todo.id === td.id);
                            if (existingTodo) {
                                return { ...existingTodo, ...td };
                            };
                        }
                        return td;
                    })
                }) : t)
            };
        case types.setAudioRegionUploaded:
            GridWorkerService.updateTracks(action);
            return {
                ...state,
                tracks: state.tracks.map(t => t.id === action.region.trackId ? ({
                    ...t,
                    regions: t.regions.map(r => r.id === action.region.id ? ({
                        ...r,
                        audioData: !!r.audioData ? {
                            ...r.audioData,
                            uploaded: true,
                        } : undefined
                    }) : r)
                }) : t),
                cancelUploads: state.cancelUploads.filter(cu => cu.region.id !== action.region.id)
            };
        case types.setCancelUpload:
            return {
                ...state,
                cancelUploads: [...state.cancelUploads, {
                    region: action.region,
                    cancelUpload: action.cancelUpload
                }]
            };
        case types.removeCancelUpload:
            return {
                ...state,
                cancelUploads: state.cancelUploads.filter(cu => cu.region.id !== action.regionId)
            };
        default:
            return state;
    }
}