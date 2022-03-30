export const setTracks = 'track/SET_TRACKS';
export const updateTrackReleased = 'track/UPDATE_TRACK_RELEASED';
export const updateTrackSelected = 'track/UPDATE_TRACK_SELECTED';
export const selectTrack = 'track/SET_CURRENT_TRACK';
export const setTrackVolume = 'track/SET_TRACK_VOLUME';
export const deleteTrack = 'track/DELETE_TRACK';
export const addTrack = 'track/ADD_TRACK';
export const upsertTrack = 'track/UPSERT_TRACK';
export const updateTrackIdLocally = 'track/UPDATE_TRACK_ID_LOCALLY';
export const setRecTrack = 'track/SET_REC_TRACK';
export const setMuteTrack = 'track/SET_MUTE_TRACK';
export const setSoloTrack = 'track/SET_SOLO_TRACK';
export const setPanTrack = 'track/SET_PAN_TRACK';
export const toggleLockTrack = 'track/TOGGLE_LOCK_TRACK';
export const releaseSelectedTrack = 'track/RELEASE_SELECTED_TRACK';
export const deactivateGlobalSolo = 'track/DEACTIVATE_GLOBAL_SOLO';

export const addTodo = 'track/ADD_TODO';
export const deleteTodo = 'track/DELETE_TODO';
export const updateTodo = 'track/UPDATE_TODO';
export const updateTodos = 'track/UPDATE_TODOS';
export const updateTodoLocally = 'track/UPDATE_TODO_LOCALLY';
export const setSelectedTodo = 'track/SET_SELECTED_TODO';

export const createLocalRegion = 'region/CREATE_LOCAL_REGION';
export const updateLocalRegion = 'region/UPDATE_LOCAL_REGION';
export const endLocalRegion = 'region/END_LOCAL_REGION';
export const addRegion = 'region/ADD_REGION';
export const deleteRegion = 'region/DELETE_REGION';
export const upsertRegion = 'region/UPSERT_REGION';
export const insertAudioRegion = 'region/INSERT_AUDIO_REGION';
export const audioRegionCached = 'region/AUDIO_REGION_CACHED';
export const selectRegion = 'region/SELECT_REGION';
export const audioRegionProgress = 'region/AUDIO_REGION_PROGRESS';
export const moveAudioRegion = 'region/MOVE_AUDIO_REGION';
export const moveAudioRegionToTrack = 'region/MOVE_AUDIO_REGION_TO_TRACK';
export const cropRightAudioRegion = 'region/CROP_RIGHT_AUDIO_REGION';
export const cropLeftAudioRegion = 'region/CROP_LEFT_AUDIO_REGION';
export const cutRegion = 'region/CUT_REGION';
export const setAudioRegionUploaded = 'region/SET_AUDIO_REGION_UPLOADED';
export const setCancelUpload = 'region/SET_CANCEL_UPLOAD';
export const removeCancelUpload = 'region/REMOVE_CANCEL_UPLOAD';
export const setTrackName = 'track/SET_TRACK_NAME';
export const setMonitoring = 'track/SET_MONITORING';
export const setInputGain = 'track/SET_MONITORING_GAIN';

export const types = {
    setTracks,
    updateTrackReleased,
    updateTrackSelected,
    selectTrack,
    setTrackVolume,
    deleteTrack,
    addTrack,
    upsertTrack,
    updateTrackIdLocally,
    setRecTrack,
    setMuteTrack,
    setSoloTrack,
    setPanTrack,
    toggleLockTrack,
    releaseSelectedTrack,
    deactivateGlobalSolo,
    setTrackName,

    setMonitoring,
    setInputGain,

    addTodo,
    deleteTodo,
    updateTodo,
    updateTodos,
    updateTodoLocally,
    setSelectedTodo,
    
    createLocalRegion,
    updateLocalRegion,
    endLocalRegion,
    addRegion,
    deleteRegion,
    insertAudioRegion,
    upsertRegion,
    audioRegionCached,
    selectRegion,
    audioRegionProgress,
    moveAudioRegion,
    moveAudioRegionToTrack,
    cropRightAudioRegion,
    cropLeftAudioRegion,
    cutRegion,
    setAudioRegionUploaded,
    setCancelUpload,
    removeCancelUpload
}