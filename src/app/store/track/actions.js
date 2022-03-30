import { types } from './types';
import { getAppsyncClient } from '../../apiClient/APIClient';
import { operations } from './operations';
import { AudioService, nullId } from '../../services';
import axios from 'axios';
import { FileService } from '../../services/FileService';
import { RecorderService } from '../../services/RecorderService';
import { AudioContext } from '../../services/audio/AudioContext';
import { uuid } from '../../utils/uuid';
import { TimeService } from '../../services/audio/TimeService';
import { asyncForeach } from '../../utils/asyncForeach';
import { GridWorkerService } from '../../services/workers/GridWorkerService';
import { setAckPopup, setShowAckPopup } from '../ui/Popup/actions';
import { dictionnaire } from '../../i18n';
import { updateAudioFiles } from '../project/actions';
import { currentProjectOwnerLimitOfCloudSelector, currentProjectOwnerSelector } from '../project/selectors'
import { limitNbOfCloudBySubscriptionTypeSelector } from '../user/selectors';
import { latencyRecSelector } from '../preferences/selectors';

export const upsertTrack = track => async dispatch => await dispatch({ type: types.upsertTrack, track });
export const deleteTrackLocally = track => async dispatch => await dispatch({ type: types.deleteTrack, track });
export const deleteTrack = track => async dispatch => {
    if (track.id !== nullId) {
        try {
            await dispatch(deleteTrackLocally(track));
            await getAppsyncClient().mutate({
                mutation: operations.mutations.deleteTrackMutation,
                variables: { trackId: track.id }
            });
        }
        catch (err) {
            await dispatch({ type: types.addTrack, track });
            console.log(err);
        }
    }
}

const toggleRecTrackLocally = (track, rec) => async dispatch => await dispatch({ type: types.setRecTrack, track, rec });

export const toggleRecTrack = track => async dispatch => {
    const rec = !track.rec;
    await dispatch(toggleRecTrackLocally(track, rec));
    if (track.id !== nullId) {
        try {
            await getAppsyncClient().mutate({
                mutation: operations.mutations.setRecMutation,
                variables: { trackId: track.id, rec }
            });
        }
        catch (err) {
            await dispatch(toggleRecTrackLocally(track, !rec));
            console.log(err);
        }
    }
};

export const setMonitoring = (monitoring) => async dispatch => await dispatch({ type: types.setMonitoring, monitoring });

export const setInputGain = (track, inputGain) => async dispatch => await dispatch({ type: types.setInputGain, track, inputGain });

const setSoloTrackLocally = (track, solo) => async dispatch => await dispatch({ type: types.setSoloTrack, track, solo });
export const toggleSoloTrack = track => async dispatch => {
    const solo = !track.solo;
    try {
        await dispatch(setSoloTrackLocally(track, solo));
        if (track.id !== nullId) {
            await getAppsyncClient().mutate({
                mutation: operations.mutations.setSoloMutation,
                variables: { trackId: track.id, solo }
            });
        }
    }
    catch (err) {
        await dispatch(setSoloTrackLocally(track, !solo));
        console.log(err);
    }
}

const setMuteTrackLocally = (track, mute) => async dispatch => await dispatch({ type: types.setMuteTrack, track, mute });

export const toggleMuteTrack = track => async dispatch => {
    const mute = !track.mute;
    try {
        await dispatch(setMuteTrackLocally(track, mute));
        if (track.id !== nullId) {
            await getAppsyncClient().mutate({
                mutation: operations.mutations.setMuteMutation,
                variables: { trackId: track.id, mute }
            });
        }
    }
    catch (err) {
        await dispatch(setMuteTrackLocally(track, !mute));
        console.log(err);
    }
}

export const setPanTrack = (track, pan) => async dispatch => await dispatch({ type: types.setPanTrack, track, pan });
export const setPanTrackDb = (track, pan) => async dispatch => {
    if (track.id !== nullId) {
        const previousPan = track.pan;
        await dispatch(setPanTrack(track, pan));
        try {
            await getAppsyncClient().mutate({
                mutation: operations.mutations.setTrackPanMutation,
                variables: { trackId: track.id, pan }
            });
        }
        catch (err) {
            await dispatch(setTrackPan(track, previousPan));
            console.log(err);
        }
    }
}

const setTracks = tracks => async dispatch => await dispatch({ type: types.setTracks, tracks });

export const loadTracks = () => async (dispatch, getState) => {
    const { project: { currentProjectId } } = getState();
    if (!!currentProjectId && currentProjectId !== nullId) {
        try {
            const { data: { tracks } } = await getAppsyncClient().query({
                query: operations.queries.tracksQuery,
                variables: { projectId: currentProjectId }
            });
            await dispatch(setTracks(tracks));
            tracks.forEach(t => {
                t.regions.forEach(r => {
                    if (!!r.audioData && r.audioData.uploaded) {
                        dispatch(cacheAudioRegion(r));
                    }
                })
            })
        } catch (err) {
            console.log(err);
        }
    }
}


const selectTrackLocally = trackId => async dispatch => await dispatch({ type: types.selectTrack, trackId });

export const selectTrack = trackId => async (dispatch, getState) => {
    const { track: { tracks }, project: { currentProjectId }, audio: { isRec } } = getState();
    if (!isRec) {
        const previousSelectedTrack = tracks.find(t => t.selected);
        if (!previousSelectedTrack || trackId !== previousSelectedTrack.id) {
            try {
                await dispatch(selectTrackLocally(trackId));
                await getAppsyncClient().mutate({
                    mutation: operations.mutations.selectTrackMutation,
                    variables: { trackId, projectId: currentProjectId }
                });

            }
            catch (err) {
                await dispatch({ type: types.releaseSelectedTrack });
                if (previousSelectedTrack) {
                    await dispatch({ type: types.selectTrack, track: previousSelectedTrack });
                }
                console.log(err);
            }
        }
    }
}

export const toggleLockTrackLocally = track => async dispatch => await dispatch({ type: types.toggleLockTrack, track });

export const toggleLockTrack = track => async dispatch => {
    try {
        await dispatch(toggleLockTrackLocally(track));
        await getAppsyncClient().mutate({
            mutation: operations.mutations.toggleLockTrackMutation,
            variables: { trackId: track.id }
        });
    } catch (err) {
        await dispatch(toggleLockTrackLocally(track));
        console.log(err);
    }
}

export const addTrackLocally = track => async dispatch => {
    await dispatch({ type: types.addTrack, track });
    if (track.type === 'audio') {
        track.regions.forEach(r => {
            if (!!r.audioData && r.audioData.uploaded) {
                dispatch(cacheAudioRegion(r))
            }
        });
    }
}

export const createTrack = (trackname, selectedType, selectedInstr) => {
    return async (dispatch, getState) => {
        const { project: { currentProjectId } } = getState();
        try {
            const { data: { addTrack: addedTrack } } = await getAppsyncClient().mutate({
                mutation: operations.mutations.addTrackMutation,
                variables: {
                    name: trackname,
                    projectId: currentProjectId,
                    type: selectedType,
                    instrumentId: selectedInstr ? selectedInstr.id : undefined
                }
            });
            await dispatch({ type: types.releaseSelectedTrack });
            await dispatch(addTrackLocally(addedTrack));
            return addedTrack;
        }
        catch (err) {
            console.log(err);
        }
    };
}

export const releaseSelectedTrack = () => async (dispatch, getState) => {
    const { project: { currentProjectId }, track: { tracks } } = getState();

    if (!!currentProjectId && currentProjectId !== nullId && !!tracks) {
        const selectedTrack = tracks.find(t => t.selected);
        if (!!selectedTrack) {
            try {
                await dispatch({ type: types.releaseSelectedTrack });
                await getAppsyncClient().mutate({
                    mutation: operations.mutations.releaseSelectedTrackMutation,
                    variables: { projectId: currentProjectId }
                })
            }
            catch (err) {
                console.log(err);
            }
        }
    }
};

export const setTrackVolume = (track, volume) => async dispatch => await dispatch({ type: types.setTrackVolume, track, volume });
export const setTrackVolumeDb = (track, volume) => async dispatch => {
    const oldVolume = track.volume
    await dispatch(setTrackVolume(track, volume));
    if (track.id !== nullId) {//master 
        try {
            await getAppsyncClient().mutate({
                mutation: operations.mutations.setTrackVolumeMutation,
                variables: { volume, trackId: track.id }
            });
        } catch (err) {
            await dispatch(setTrackVolume(track, oldVolume));
            console.log(err);
        }
    }
}

export const setTrackName = (track, name) => async dispatch => {
    const oldTrackName = track.name;
    await dispatch({ type: types.setTrackName, track, name });
    try {
        await getAppsyncClient().mutate({
            mutation: operations.mutations.setTrackName,
            variables: {
                trackId: track.id,
                name
            }
        })
    } catch (err) {
        await dispatch({ type: types.setTrackName, track, name: oldTrackName });
        console.log(err);
    }
}

export const updateTrackReleased = track => async dispatch => await dispatch({ type: types.updateTrackReleased, track });
export const updateTrackSelected = track => async dispatch => await dispatch({ type: types.updateTrackSelected, track });

export const createDroppedAudioRegion = (track, file, begin, onError) => async (dispatch, getState) => {
    const state = getState();
    const currentProjectOwner = currentProjectOwnerSelector(state);
    const totalAudioStorage = currentProjectOwner.totalAudioStorage;
    const limitOfCloud = currentProjectOwnerLimitOfCloudSelector(state);


    if (file.size + totalAudioStorage > limitOfCloud) {
        dispatch(setAckPopup({
            show: true,
            title: dictionnaire.ui.studio.warning.reachStoragelimit,
            text: dictionnaire.ui.studio.warning.overAllowedSize,
            onAck: () => {
                dispatch(setShowAckPopup(false));
            },
            showSubscribeBtn: true,
            canDismiss: false,
        }))
    } else {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await AudioContext.decodeAudioData(arrayBuffer);
            const localId = uuid();
            await dispatch({ type: types.createLocalRegion, localId, trackId: track.id, name: file.name, begin,beginCrop : 0, duration: audioBuffer.duration });
            const { data: { createAudioRegion: region } } = await getAppsyncClient().mutate({
                mutation: operations.mutations.createAudioRegionMutation,
                variables: {
                    trackId: track.id,
                    localId,
                    begin,
                    name: file.name,
                    duration: audioBuffer.duration,
                    beginCrop: 0
                }
            });
            await dispatch({ type: types.updateLocalRegion, localId, region });
            FileService.insertBuffer(region.audioData.fileId, audioBuffer);
            await dispatch(audioRegionCached(region.audioData.fileId));
            await dispatch(uploadAudioFile(track.id, region.id, file, audioBuffer.sampleRate, audioBuffer.duration, audioBuffer.numberOfChannels));
        } catch (err) {
            if (onError) {
                onError(err);
            }
        }
    }
}

export const cancelRecRegion = () => async (dispatch, getState) => {
    const { track: { tracks } } = getState();
    const recTracks = tracks.filter(t => t.rec);
    await asyncForeach(recTracks, async t => {
        const region = t.regions.find(r => r.isRec);
        if (!!region) {
            await dispatch(deleteRegion(region));
        }
    })
}

const saveFile = (blob, fileName) => {
    const a = document.createElement("a");
    a.style = "display: none";
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(a.href);
};

export const createAudioRegion = (track, begin ,latencyRec = 0) => async (dispatch, getState) => {
    const localId = uuid();
    const state = getState();
    const currentProjectOwner = currentProjectOwnerSelector(state);
    const totalAudioStorage = currentProjectOwner.totalAudioStorage;
    const limitOfCloud = currentProjectOwnerLimitOfCloudSelector(state);

    function beforeUnload(e) {
        AudioService.stop();
        dispatch(cancelRecRegion());
        e.returnValue = 'Record in progress ...';
    }

    window.addEventListener('beforeunload', beforeUnload);
    RecorderService.record(
        track.id,
        localId,
        async ({ trackId, localId, file, buffer, isError }) => {
            const { track: { tracks } } = getState();
            const currentTrack = tracks.find(t => t.id === trackId);
            const currentRegion = currentTrack.regions.find(r => r.localId === localId);
            if (isError || !currentRegion.id) {
                dispatch(deleteRegion(currentRegion));
            } else if (file.size + totalAudioStorage > limitOfCloud) {
                await dispatch(endAudioRegion(trackId, localId, buffer.duration));
                await dispatch(setAckPopup({
                    show: true,
                    title: dictionnaire.ui.studio.warning.reachStoragelimit,
                    text: dictionnaire.ui.studio.warning.recordLimitOfCloud,
                    onAck: () => {
                        dispatch(deleteRegion(currentRegion)).then(() => {
                            const blob = new Blob([file], { type: 'audio/webm;codecs=opus' });
                            saveFile(blob, file.name)
                        })
                    },
                    showSubscribeBtn: true,
                    canDismiss: false,
                }))
            } else {
                await dispatch(endAudioRegion(trackId, localId, buffer.duration));
                FileService.insertBuffer(currentRegion.audioData.fileId, buffer);
                await dispatch(audioRegionCached(currentRegion.audioData.fileId));
                await dispatch(uploadAudioFile(trackId, currentRegion.id, file, buffer.sampleRate, buffer.duration, buffer.numberOfChannels));
            }
            window.removeEventListener('beforeunload', beforeUnload);
        }
    );
    await dispatch({ type: types.createLocalRegion, localId, begin, trackId: track.id, isRec: true ,beginCrop: latencyRec});
    try {
        const { data: { createAudioRegion: region } } = await getAppsyncClient().mutate({
            mutation: operations.mutations.createAudioRegionMutation,
            variables: {
                trackId: track.id,
                localId,
                begin,
                beginCrop: latencyRec,
                isRec: true
            }
        });
        await dispatch({ type: types.updateLocalRegion, localId, region });
    } catch (err) {
        console.log(err);
        await dispatch(deleteRegionLocally({ trackId: track.id, localId }));
    }
}

export const addRegionLocally = region => async dispatch => await dispatch({ type: types.addRegion, region });

export const recTracks = begin => async (dispatch, getState) => {
    const state = getState();
    let latencyRec = latencyRecSelector(state);
    latencyRec = latencyRec/1000;
    const armedTracks = getState().track.tracks.filter(t => t.rec && !t.alreadyInUse);
    await asyncForeach(armedTracks, async t => {
        try {
            await dispatch(createAudioRegion(t, begin,latencyRec));
        } catch (err) {
            console.log(err);
        }
    })
}


const endAudioRegion = (trackId, localId, duration) => async (dispatch) => {

    await dispatch({ type: types.endLocalRegion, duration, localId, trackId });
    try {
        await getAppsyncClient().mutate({
            mutation: operations.mutations.endAudioRegionMutation,
            variables: {
                trackId,
                localId,
                duration
            }
        });
    } catch (err) {
        console.log(err);
    }
}

export const stopRecTracks = () => async (_, getState) => {
    const armedTracks = getState().track.tracks.filter(t => t.rec);
    armedTracks.forEach(t => {
        RecorderService.stopRecord(t.id);
    });
}

export const deleteRegionLocally = region => async dispatch => await dispatch({ type: types.deleteRegion, region });
export const deleteRegion = region => async (dispatch, getState) => {
    const { project: { currentProjectId, projects }, track: { cancelUploads } } = getState();
    const project = projects.find(p => p.id === currentProjectId);
    const cu = cancelUploads.find(cu => cu.region.id === region.id);
    if (!!cu) {
        cu.cancelUpload();
        await dispatch(removeCancelUpload(region.id));
    }
    await dispatch(deleteRegionLocally(region));

    try {
        await getAppsyncClient().mutate({
            mutation: operations.mutations.deleteRegionMutation,
            variables: {
                trackId: region.trackId,
                regionId: !!region.id ? region.id : null,
                localId: !!region.localId ? region.localId : null,
                projectId: currentProjectId
            }
        });
        await dispatch(updateAudioFiles(project.id, project.audioFiles.map(f => f.id === region.audioData.fileId ? ({
            ...f,
            regionIds: f.regionIds.filter(rId => rId !== region.id)
        }) : f)));
    } catch (err) {
        console.log(err);
        await dispatch(addRegionLocally(region));
    }
}

const removeCancelUpload = regionId => async dispatch => await dispatch({ type: types.removeCancelUpload, regionId });

export const insertAudioRegionLocally = region => async dispatch => await dispatch({ type: types.insertAudioRegion, region });
export const upsertRegionLocally = region => async dispatch => await dispatch({ type: types.upsertRegion, region });

const deactivateGlobalSoloLocally = () => async dispatch => await dispatch({ type: types.deactivateGlobalSolo });
export const deactivateGlobalSolo = projectId => async dispatch => {
    await dispatch(deactivateGlobalSoloLocally());
    try {
        await getAppsyncClient().mutate({
            mutation: operations.mutations.deactivateGlobalSoloMutation,
            variables: {
                projectId
            }
        });
    } catch (err) {
        console.log(err);
    }
}

export const setAudioRegionUploadedLocally = region => async dispatch => await dispatch({ type: types.setAudioRegionUploaded, region });
export const uploadAudioFile = (trackId, regionId, file, sampleRate, duration, nbOfChannels) => async (dispatch, getState) => {
    const { track: { tracks } } = getState();

    const track = tracks.find(t => t.id === trackId);
    if (!!track) {
        const region = track.regions.find(r => r.id === regionId);
        if (!!region && !!region.audioData && !!region.audioData.uploadUrl) {
            const url = region.audioData.uploadUrl;

            let cancelTokenSource = axios.CancelToken.source();
            function cancelUploadCallback() {
                cancelTokenSource.cancel('Upload cancelled');
                dispatch(deleteRegion(region));
            }

            function beforeUnload(e) {
                e.returnValue = 'Are you sure you want to quit ?'
                cancelUploadCallback();
            }

            try {
                window.addEventListener('beforeunload', beforeUnload);
                await dispatch(setCancelUpload(region, () => cancelTokenSource.cancel('Upload cancelled')));
                await axios.put(url, file,
                    {
                        onUploadProgress: function (data) {
                            updateRegionProgressUI(trackId, regionId, data.loaded / data.total * 100, cancelUploadCallback)
                        },
                        headers: { 'Content-Type': file.type },
                        cancelToken: cancelTokenSource.token
                    });
                updateRegionProgressUI(trackId, regionId, undefined);
                await getAppsyncClient().mutate({
                    mutation: operations.mutations.audioRegionUploadedMutation,
                    variables: {
                        trackId: region.trackId,
                        regionId: region.id,
                        size: file.size,
                        name: file.name,
                        stereo: nbOfChannels > 1,
                        duration,
                        sampleRate
                    }
                });
                await dispatch(setAudioRegionUploadedLocally(region));
                window.removeEventListener('beforeunload', beforeUnload);
            } catch (err) {
                console.log(err)
            };
        }
    } else {
        console.log('error uploadUrl not found', region);
    }
}

const setCancelUpload = (region, cancelUpload) => async dispatch => await dispatch({ type: types.setCancelUpload, region, cancelUpload });

const audioRegionCached = (fileId) => async dispatch => await dispatch({ type: types.audioRegionCached, fileId });
export const cacheAudioRegion = region => async (dispatch) => {
    if (!region.cached) {
        try {
            const buffer = FileService.get(region.audioData.fileId);
            if (!buffer) {
                await FileService.fetchBuffer(region.audioData.fileId, region.audioData.url, (progress, cancelCallback) => updateRegionProgressUI(region.trackId, region.id, progress, cancelCallback));
            }
            await dispatch(audioRegionCached(region.audioData.fileId));
        } catch (err) {
            console.log(err);
        }
    }
}

export const selectRegion = (trackId, regionId) => async dispatch => await dispatch({ type: types.selectRegion, trackId, regionId });

export const updateRegionProgressUI = (trackId, regionId, progress, cancelUploadCallback) => {
    GridWorkerService.updateRegionProgress(trackId, regionId, progress, cancelUploadCallback);
}

export const moveAudioRegionLocally = (region, begin) => async dispatch => await dispatch({ type: types.moveAudioRegion, region, begin });
export const moveAudioRegionToTrackLocally = region => async (dispatch, getState) => {
    const { track: { tracks } } = getState();
    const trackIdFrom = tracks.find(t => !!t.regions && t.regions.some(r => r.id === region.id)).id;
    await dispatch({
        type: types.moveAudioRegionToTrack,
        region,
        trackIdFrom,
        trackIdDest: region.trackId,
        begin: region.begin
    });
}
export const moveAudioRegion = (region, deltaBar) => async dispatch => {
    const previousBegin = region.begin;
    const begin = previousBegin + deltaBar;
    try {
        await dispatch(moveAudioRegionLocally(region, begin));
        await getAppsyncClient().mutate({
            mutation: operations.mutations.moveAudioRegionMutation,
            variables: {
                trackIdFrom: region.trackId,
                trackIdDest: region.trackId,
                regionId: region.id,
                begin
            }
        });
    }
    catch (err) {
        await dispatch(moveAudioRegionLocally(region, previousBegin));
        console.log(err);
    }
}

export const moveAudioRegionToTrack = (region, track, begin) => async dispatch => {
    if (region.cached && !!region.audioData && region.audioData.uploaded) {
        const trackIdFrom = region.trackId;
        const trackIdDest = track.id;
        const previousBegin = region.begin;
        try {
            await dispatch(selectTrackLocally(track.id));
            await dispatch({
                type: types.moveAudioRegionToTrack,
                region,
                trackIdFrom,
                trackIdDest,
                begin
            });
            await getAppsyncClient().mutate({
                mutation: operations.mutations.moveAudioRegionMutation,
                variables: {
                    trackIdFrom,
                    trackIdDest,
                    regionId: region.id,
                    begin
                }
            });

        } catch (err) {
            await dispatch({
                type: types.moveAudioRegionToTrack,
                region,
                trackIdFrom: trackIdDest,
                trackIdDest: trackIdFrom,
                begin: previousBegin
            })
            console.log(err);
        }
    }
}

export const copyAudioRegion = (region, trackId, newBegin) => async dispatch => {
    if (region.cached && !!region.audioData && region.audioData.uploaded) {
        const newRegion = {
            ...region,
            localId: uuid(),
            id: undefined,
            begin: newBegin,
            trackId: trackId,
            cached: true
        };
        await dispatch(selectTrackLocally(trackId));
        await dispatch(insertAudioRegionLocally(newRegion));
        try {
            const { data: { copyAudioRegion } } = await getAppsyncClient().mutate({
                mutation: operations.mutations.copyAudioRegionMutation,
                variables: {
                    trackIdFrom: region.trackId,
                    trackIdDest: trackId,
                    regionId: region.id,
                    localId: newRegion.localId,
                    begin: newBegin
                }
            });
            await dispatch({ type: types.updateLocalRegion, localId: newRegion.localId, region: copyAudioRegion });
        } catch (err) {
            await dispatch(deleteRegionLocally(newRegion));
            console.log(err)
        }
    }
}

export const cropRightAudioRegionLocally = (region, endCrop) => async dispatch => await dispatch({ type: types.cropRightAudioRegion, region, endCrop });
export const cropRightAudioRegion = (region, endCrop) => async dispatch => {
    const previousEndCrop = region.endCrop;
    try {
        await dispatch(cropRightAudioRegionLocally(region, endCrop));
        await getAppsyncClient().mutate({
            mutation: operations.mutations.cropRightAudioRegionMutation,
            variables: {
                trackId: region.trackId,
                regionId: region.id,
                endCrop
            }
        });
    }
    catch (err) {
        await dispatch(cropRightAudioRegionLocally(region, previousEndCrop));
        console.log(err);
    }
}

export const cropLeftAudioRegionLocally = (region, begin, beginCrop) => async dispatch => await dispatch({ type: types.cropLeftAudioRegion, region, begin, beginCrop });
export const cropLeftAudioRegion = (region, begin, beginCrop) => async dispatch => {
    const previousBegin = region.begin;
    const previousBeginCrop = region.beginCrop;
    try {
        await dispatch(cropLeftAudioRegionLocally(region, begin, beginCrop));
        await getAppsyncClient().mutate({
            mutation: operations.mutations.cropLeftAudioRegionMutation,
            variables: {
                trackId: region.trackId,
                regionId: region.id,
                begin,
                beginCrop
            }
        });
    }
    catch (err) {
        await dispatch(cropLeftAudioRegionLocally(region, previousBegin, previousBeginCrop));
        console.log(err);
    }
}

export const isContainsUploadingRegion = track => {
    let isUpload = false;
    if (!!track && !!track.regions && track.regions.length > 0) {
        track.regions.forEach(r => {
            if (!r.cached || !r.audioData || !r.audioData.uploaded) {
                isUpload = true;
            }
        })
    }
    return isUpload;
}
export const duplicateTrack = track => async (dispatch, getState) => {
    const isUpload = isContainsUploadingRegion(track);
    if (!isUpload) {
        const { project: { currentProjectId } } = getState();

        const trackCopy = {
            ...track,
            name: `${track.name}-dup`,
            localId: uuid(),
            id: uuid(),
            regions: track.regions.map(r => ({
                ...r,
                id: uuid(),
                trackId: track.id
            }))
        };
        try {
            await dispatch(addTrackLocally(trackCopy));
            await dispatch(selectTrackLocally(trackCopy.id))

            const { data: { duplicateTrack } } = await getAppsyncClient().mutate({
                mutation: operations.mutations.duplicateTrackMutation,
                variables: {
                    projectId: currentProjectId,
                    trackId: track.id
                }
            });
            await dispatch(updateTrackIdLocally(trackCopy, duplicateTrack));
            await dispatch(selectTrackLocally(duplicateTrack.id))
            if (duplicateTrack.type === 'audio') {
                duplicateTrack.regions.forEach(r => {
                    if (!!r.audioData && r.audioData.uploaded) {
                        dispatch(cacheAudioRegion(r));
                    }
                });
            }
        } catch (err) {
            await dispatch(deleteTrackLocally(trackCopy));
            await dispatch(selectTrackLocally(track.id));
            console.log(err);
        }
    }
}

const updateTrackIdLocally = (localTrack, track) => async dispatch => await dispatch({ type: types.updateTrackIdLocally, localTrack, track });

export const cutAudioRegion = (region, cutAtBar) => async dispatch => {
    if (!region.isRec && cutAtBar !== region.begin && cutAtBar !== region.begin + TimeService.secToBar(region.endCrop - region.beginCrop)) {
        const rightId = uuid();
        const previousEndCrop = region.endCrop;
        const durationLeft = TimeService.barToSec(cutAtBar - region.begin);
        const updatedRegion = { ...region, endCrop: region.beginCrop + durationLeft };
        const newRegion = { ...region, id: rightId, localId: rightId, begin: cutAtBar, beginCrop: region.beginCrop + durationLeft };
        try {
            await dispatch({ type: types.cutRegion, updatedRegion, newRegion });
            const { data: { cutAudioRegion } } = await getAppsyncClient().mutate({
                mutation: operations.mutations.cutAudioRegionMutation,
                variables: {
                    trackId: region.trackId,
                    regionId: region.id,
                    cutAtBar,
                    newLocalId: rightId
                }
            });

            if (!!cutAudioRegion) {
                await dispatch({
                    type: types.updateLocalRegion,
                    localId: rightId,
                    region: {
                        ...cutAudioRegion,
                        cached: FileService.exists(cutAudioRegion.audioData.fileId)
                    }
                });
            } else {
                await dispatch(deleteRegionLocally(newRegion));
                await dispatch(cropRightAudioRegionLocally(updatedRegion, previousEndCrop));
            }
        } catch (err) {
            await dispatch(deleteRegionLocally(newRegion));
            await dispatch(cropRightAudioRegionLocally(updatedRegion, previousEndCrop));
            console.log(err);
        }
    }
}

export const cutAudioRegionLocally = (newRegion) => async (dispatch, getState) => {
    const { track: { tracks } } = getState();
    const track = tracks.find(t => t.id === newRegion.trackId);
    const updatedRegion = {
        ...track.regions.find(r => r.id === newRegion.from),
        endCrop: newRegion.beginCrop
    };
    if (FileService.exists(newRegion.audioData.fileId)) {
        newRegion.cached = true;
    }
    await dispatch({ type: types.cutRegion, updatedRegion, newRegion });
}


export const addTodo = (trackId, title, description, positionBar, priority, trackIndex) => async (dispatch, getState) => {
    const { user: { currentUser } } = getState();
    const date = new Date();
    const localId = uuid();

    const todo = {
        title,
        creator: currentUser,
        description,
        positionBar,
        dateCreation: date,
        lastUpdate: date,
        dueDate: undefined,
        priority: priority,
        id: localId,
        localId,
        state: 'TODO',
        trackIndex: trackIndex,
        trackId: trackId,
        comments: [],
        assignee: null,
    };

    await dispatch({ type: types.addTodo, trackId, todo });

    try {
        const { data } = await getAppsyncClient().mutate({
            mutation: operations.mutations.addTodoMutation,
            variables: {
                trackId,
                title,
                description,
                positionBar,
                priority
            }
        });
        await dispatch(updateTodoLocally(trackId, localId, data.addTodo));

    } catch (e) {
        console.log(e);
        await dispatch({ type: types.deleteTodo, trackId, todoId: todo.id });
    }
}

export const deleteTodo = (trackId, todoId) => async (dispatch, getState) => {
    const { track: { tracks } } = getState();
    const track = tracks.find(t => t.id === trackId);
    const todos = track.todos;
    const todo = todos.find(t => t.id === todoId);
    await dispatch({ type: types.deleteTodo, trackId, todoId });
    try {
        await getAppsyncClient().mutate({
            mutation: operations.mutations.deleteTodoMutation,
            variables: {
                trackId,
                todoId
            }
        });
    } catch (e) {
        console.log(e);
        await dispatch({ type: types.addTodo, trackId, todo });
    }
}

export const updateTodoLocally = (trackId, localId, todo) => async dispatch => await dispatch({ type: types.updateTodoLocally, trackId, localId, todo });

export const updateTodoField = (trackId, todoId, fieldname, value, mutation) => async (dispatch, getState) => {
    const { track: { tracks } } = getState();
    const track = tracks.find(t => t.id === trackId);
    const previousTodo = track.todos.find(t => t.id === todoId);

    await dispatch({ type: types.updateTodo, trackId, todo: { ...previousTodo, [fieldname]: value } });

    try {
        await getAppsyncClient().mutate({
            mutation,
            variables: {
                trackId,
                todoId,
                [fieldname]: value
            }
        });

    } catch (e) {
        console.log(e);
        await dispatch({ type: types.updateTodo, trackId, todo: previousTodo });
    }
}
export const updateTodoPriority = (trackId, todoId, priority) => async dispatch => await dispatch(updateTodoField(trackId, todoId, 'priority', priority, operations.mutations.updateTodoPriorityMutation));

export const updateTodoTitle = (trackId, todoId, title) => async (dispatch) => await dispatch(updateTodoField(trackId, todoId, 'title', title, operations.mutations.updateTodoTitleMutation));


export const updateTodoState = (trackId, todoId, state) => async (dispatch) => await dispatch(updateTodoField(trackId, todoId, 'state', state, operations.mutations.updateTodoStateMutation));

export const updateTodoDescription = (trackId, todoId, description) => async (dispatch) => await dispatch(updateTodoField(trackId, todoId, 'description', description, operations.mutations.updateTodoDescriptionMutation));

export const updateTodoDueDate = (trackId, todoId, dueDate) => async (dispatch) => await dispatch(updateTodoField(trackId, todoId, 'dueDate', dueDate, operations.mutations.updateTodoDueDateMutation));

export const updateTodoAssignee = (trackId, todoId, assignee) => async (dispatch) => await dispatch(updateTodoField(trackId, todoId, 'assignee', !!assignee ? ({
    id: assignee.id,
    username: assignee.username,
    email: assignee.email
}) : undefined, operations.mutations.updateTodoAssigneeMutation));


export const updateTodoAddComment = (trackId, todoId, comment) => async (dispatch, getState) => {
    const { track: { tracks }, user: { currentUser } } = getState();
    const track = tracks.find(t => t.id === trackId);
    const previousTodo = track.todos.find(t => t.id === todoId);

    await dispatch({
        type: types.updateTodo, trackId, todo: {
            ...previousTodo, comments: [...previousTodo.comments, {
                id: uuid(),
                message: comment,
                date: new Date(Date.now()),
                user: currentUser
            }]
        }
    });

    try {
        const { data: { updateTodoAddComment } } = await getAppsyncClient().mutate({
            mutation: operations.mutations.updateTodoAddCommentMutation,
            variables: {
                trackId,
                todoId,
                message: comment
            }
        });
        await dispatch({
            type: types.updateTodo, trackId, todo: {
                ...previousTodo, comments: [...previousTodo.comments, updateTodoAddComment]
            }
        });
    } catch (e) {
        console.log(e);
        await dispatch({ type: types.updateTodo, trackId, todo: previousTodo });
    }
}

export const setSelectedTodo = todo => async dispatch => await dispatch({ type: types.setSelectedTodo, todo });

export const updateTodoDeleteComment = (trackId, todoId, comment) => async (dispatch, getState) => {
    const { track: { tracks } } = getState();
    const track = tracks.find(t => t.id === trackId);
    const previousTodo = track.todos.find(t => t.id === todoId);

    await dispatch({
        type: types.updateTodo, trackId, todo: {
            ...previousTodo,
            comments: previousTodo.comments.filter(c => c.id !== comment.id)
        }
    });

    try {
        await getAppsyncClient().mutate({
            mutation: operations.mutations.updateTodoDeleteCommentMutation,
            variables: {
                trackId,
                todoId,
                commentId: comment.id
            }
        });
    } catch (e) {
        console.log(e);
        await dispatch({ type: types.updateTodo, trackId, todo: previousTodo });
    }
}

export const updateTodosLocally = (track) => async dispatch => await dispatch({ type: types.updateTodos, trackId: track.id, todos: track.todos });

export const insertUnusedFile = file => async (dispatch, getState) => {
    const { track: { tracks } } = getState();
    const selectedTrack = tracks.find(t => t.selected);

    if (!!selectedTrack) {
        const currentBar = AudioService.getBar();
        try {
            await getAppsyncClient().mutate({
                mutation: operations.mutations.insertUnusedFileMutation,
                variables: {
                    trackId: selectedTrack.id,
                    fileId: file.id,
                    beginBar: currentBar
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
}