import gql from 'graphql-tag';

export const tracksSubscription = gql`
    subscription tracksChanged($for: ID!, $projectId: ID!) {
        tracksChanged(for: $for, projectId: $projectId) {
            type,
            projectId,
            track {
                id
                index
                selected
                alreadyInUse
                selectedUserId
                ownerId
                createdByMe
                lock
                solo
                rec
                mute
                name
                volume
                pan
                type
                todos {
                    title
                    creator {
                        id
                        username
                        email
                    }
                    description
                    positionBar
                    dateCreation
                    lastUpdate
                    dueDate
                    priority
                    id
                    state
                    assignee {
                        id
                        username
                        email
                    }
                    trackIndex
                    trackId
                    comments {
                        id
                        date
                        message
                        user {
                            id
                            username
                            email
                        }
                    } 
                }
                regions {
                    id
                    trackId
                    name
                    begin
                    duration
                    beginCrop
                    endCrop
                    isRec
                    notes {
                        note
                        begin
                        end
                        velocity
                    }
                    audioData {
                        fileId
                        url
                        uploadUrl
                        uploaded
                    }
                    from
                }
            }
        }
    }
`;

export const toggleLockTrackMutation = gql`
mutation toggleLockTrackMutation($trackId: ID!) {
    toggleLockTrack(trackId: $trackId)
}
`;

export const setTrackPanMutation = gql`
        mutation setTrackPanMutation($trackId: ID!, $pan: Float!) {
            setTrackPan(trackId: $trackId, pan: $pan)
        }
    `;
export const setSoloMutation = gql`
        mutation setSoloMutation($trackId: ID!, $solo: Boolean!) {
            setSolo(trackId: $trackId, solo: $solo)
        }
    `;
export const setMuteMutation = gql`
    mutation setMuteMutation($trackId: ID!, $mute: Boolean!) {
        setMute(trackId: $trackId, mute: $mute)
    }
    `;
export const setRecMutation = gql`
        mutation setRecMutation($trackId: ID!, $rec: Boolean!) {
            setRec(trackId: $trackId, rec: $rec)
        }
    `;
export const deleteTrackMutation = gql`
        mutation deleteTrackMutation($trackId: ID!) {
            deleteTrack(trackId: $trackId) {
                id
            }
        }
    `;

export const setTrackVolumeMutation = gql`
        mutation setTrackVolumeMutation($volume: Float!, $trackId: ID!) {
            setTrackVolume(volume: $volume, trackId: $trackId)
        }`;

export const releaseSelectedTrackMutation = gql`
        mutation releaseSelectedTrackMutation($projectId: ID!) {
            releaseSelectedTrack(projectId: $projectId) {
                id
            }
        }`;
export const selectTrackMutation = gql`
        mutation selectTrackMutation($trackId: ID!, $projectId: ID!) {
            selectTrack(trackId: $trackId, projectId: $projectId) {
                id
            }
        }`;
export const addTrackMutation = gql`
        mutation addTrackMutation($name: String!, $projectId: ID!, $type: String!, $instrumentId: ID) {
            addTrack(name: $name, projectId: $projectId, type: $type, instrumentId: $instrumentId) {
                id
                index
                selected
                alreadyInUse
                selectedUserId
                createdByMe
                ownerId
                lock
                solo
                rec
                mute
                name
                volume
                pan
                type
                regions {
                    id
                }
                todos {
                    id
                }
            }
        }
    `;

export const duplicateTrackMutation = gql`
    mutation duplicateTrackMutation($projectId: ID!,  $trackId: ID!) {
        duplicateTrack(projectId: $projectId, trackId: $trackId) {
            id,
            index
            selected,
            alreadyInUse,
            selectedUserId
            createdByMe,
            ownerId
            lock,
            solo,
            rec, 
            mute,
            name,
            volume,
            pan,
            type,
            regions {
                id,
                trackId,
                name,
                begin,
                duration,
                beginCrop,
                endCrop,
                isRec,
                notes {
                    note,
                    begin,
                    end,
                    velocity
                }
                audioData {
                    fileId,
                    url,
                    uploadUrl,
                    uploaded
                }
                from
            }
        }
    }
`;

export const tracksQuery = gql`
        query tracksQuery($projectId: ID!) {
            tracks(projectId: $projectId) {
                id,
                index
                selected,
                alreadyInUse,
                selectedUserId
                createdByMe,
                ownerId
                lock,
                solo,
                rec, 
                mute,
                name,
                volume,
                pan,
                type,
                regions {
                    id,
                    trackId,
                    name,
                    begin,
                    duration,
                    beginCrop,
                    endCrop,
                    isRec,
                    notes {
                        note,
                        begin,
                        end,
                        velocity
                    }
                    audioData {
                        fileId,
                        url,
                        uploadUrl,
                        uploaded
                    }
                    from
                }
                todos {
                    title
                    creator {
                        id
                        username
                        email
                    }
                    description
                    positionBar
                    dateCreation
                    lastUpdate
                    dueDate
                    priority
                    id
                    state
                    assignee {
                        id
                        username
                        email
                    }
                    trackIndex
                    trackId
                    comments {
                        id
                        date
                        message
                        user {
                            id
                            username
                            email
                        }
                    } 
                }
            }
        }`;

export const createAudioRegionMutation = gql`
    mutation createAudioRegion($trackId: ID!, $begin: Float!, $name: String, $isRec: Boolean, $duration: Float, $localId: ID!,$beginCrop: Float!) {
        createAudioRegion(trackId: $trackId, begin: $begin, name: $name, isRec: $isRec, duration: $duration, localId: $localId,beginCrop: $beginCrop) {
            id
            localId
            trackId
            name
            begin
            duration
            beginCrop
            endCrop
            isRec
            notes {
                note
                begin
                end
                velocity
            }
            audioData {
                fileId
                uploadUrl
                uploaded
            }
            from
        }
    }
`;

export const copyAudioRegionMutation = gql`
    mutation copyAudioRegion($trackIdFrom: ID!, $trackIdDest: ID, $regionId: ID!, $begin: Float!, $localId: ID!) {
        copyAudioRegion(trackIdFrom: $trackIdFrom, trackIdDest: $trackIdDest, regionId: $regionId, begin: $begin, localId: $localId) {
            id
            localId
            trackId
            name
            begin
            duration
            beginCrop
            endCrop
            isRec
            notes {
                note
                begin
                end
                velocity
            }
            audioData {
                fileId
                url
                uploadUrl
                uploaded
            }
            from
        }
    }
`;

export const endAudioRegionMutation = gql`
    mutation endAudioRegion($trackId: ID!, $duration: Float!, $localId: ID!) {
        endAudioRegion(trackId: $trackId, duration: $duration, localId: $localId) {
            id
            localId
            trackId
            name
            begin
            duration
            beginCrop
            endCrop
            isRec
            notes {
                note
                begin
                end
                velocity
            }
            audioData {
                fileId
                url
                uploadUrl
                uploaded
            }
            from
        }
    }
`;

export const deleteRegionMutation = gql`
    mutation deleteRegion($projectId: ID!,$trackId: ID!, $regionId: ID, $localId: ID) {
        deleteRegion(projectId: $projectId, trackId: $trackId, regionId: $regionId, localId: $localId)
    }
`;

export const regionsSubscription = gql`
    subscription regionsChanged($for: ID!, $projectId: ID!) {
        regionsChanged(for: $for, projectId: $projectId) {
            for
            type
            projectId
            region {
                id
                trackId
                name
                begin
                duration
                beginCrop
                endCrop
                isRec
                notes {
                    note
                    begin
                    end
                    velocity
                }
                audioData {
                    fileId
                    url
                    uploadUrl
                    uploaded
                }
                from
            }
        }
    }
`;

export const deactivateGlobalSoloMutation = gql`
    mutation deactivateGlobalSolo($projectId: ID!) {
        deactivateGlobalSolo(projectId: $projectId)
    }
`;

export const audioRegionUploadedMutation = gql`
    mutation audioRegionUploaded($trackId: ID!, $regionId: ID!, $size: Float!, $name: String!, $stereo: Boolean!, $duration: Float!, $sampleRate: Int!) {
        audioRegionUploaded(trackId: $trackId, regionId: $regionId, size: $size, name: $name, stereo: $stereo, duration : $duration, sampleRate: $sampleRate)
    }
`;

export const moveAudioRegionMutation = gql`
    mutation moveAudioRegion($trackIdFrom: ID!, $trackIdDest: ID, $regionId: ID!, $begin: Float!) {
        moveAudioRegion(trackIdFrom: $trackIdFrom, trackIdDest: $trackIdDest, regionId: $regionId, begin: $begin)
    }
`;

export const cropRightAudioRegionMutation = gql`
    mutation cropRightAudioRegion($trackId: ID!, $regionId: ID!, $endCrop: Float!) {
        cropRightAudioRegion(trackId: $trackId, regionId: $regionId, endCrop: $endCrop)
    }
`;

export const cropLeftAudioRegionMutation = gql`
    mutation cropLeftAudioRegion($trackId: ID!, $regionId: ID!, $begin: Float!,$beginCrop: Float! ) {
        cropLeftAudioRegion(trackId: $trackId, regionId: $regionId, begin: $begin, beginCrop: $beginCrop)
    }
`;

export const cutAudioRegionMutation = gql`
    mutation cutAudioRegion($trackId: ID!, $regionId: ID!, $cutAtBar: Float!, $newLocalId: ID!) {
        cutAudioRegion(trackId: $trackId, regionId: $regionId, cutAtBar: $cutAtBar, newLocalId: $newLocalId) {
            id
            localId
            trackId
            name
            begin
            duration
            beginCrop
            endCrop
            isRec
            notes {
                note
                begin
                end
                velocity
            }
            audioData {
                fileId
                url
                uploadUrl
                uploaded
            }
            from
        }
    }
`;

export const addTodoMutation = gql`
    mutation addTodo($trackId: ID!, $title: String!, $description: String!, $positionBar: Float!, $priority: Int!) {
        addTodo(trackId: $trackId, title: $title, description: $description, positionBar: $positionBar, priority: $priority) {
            title
            creator {
                id
                username
                email
            }
            description
            positionBar
            dateCreation
            lastUpdate
            dueDate
            priority
            id
            state
            assignee {
                id
                username
                email
            }
            trackIndex
            trackId
            comments {
                id
                date
                message
                user {
                    id
                    username
                    email
                }
            }
        }
    }
`;

export const updateTodoPriorityMutation = gql`
    mutation updateTodoPriority($trackId: ID!, $todoId: ID!, $priority: Int!) {
        updateTodoPriority(trackId: $trackId, todoId: $todoId, priority: $priority)
    }
`;

export const updateTodoTitleMutation = gql`
    mutation updateTodoTitle($trackId: ID!, $todoId: ID!, $title: String!) {
        updateTodoTitle(trackId: $trackId, todoId: $todoId, title: $title)
    }
`;

export const updateTodoStateMutation = gql`
    mutation updateTodoState($trackId: ID!, $todoId: ID!, $state: String!) {
        updateTodoState(trackId: $trackId, todoId: $todoId, state: $state)
    }
`;

export const updateTodoDescriptionMutation = gql`
    mutation updateTodoDescription($trackId: ID!, $todoId: ID!, $description: String!) {
        updateTodoDescription(trackId: $trackId, todoId: $todoId, description: $description)
    }
`;

export const updateTodoDueDateMutation = gql`
    mutation updateTodoDueDate($trackId: ID!, $todoId: ID!, $dueDate: AWSDateTime) {
        updateTodoDueDate(trackId: $trackId, todoId: $todoId, dueDate: $dueDate)
    }
`;

export const updateTodoAssigneeMutation = gql`
    mutation updateTodoAssignee($trackId: ID!, $todoId: ID!, $assignee: UserInput) {
        updateTodoAssignee(trackId: $trackId, todoId: $todoId, assignee: $assignee)
    }
`;

export const updateTodoAddCommentMutation = gql`
    mutation updateTodoAddComment($trackId: ID!, $todoId: ID!, $message: String!) {
        updateTodoAddComment(trackId: $trackId, todoId: $todoId, message: $message) {
            id
            message
            date
            user {
                id
                username
                email
            }
        }
    }
`;

export const updateTodoDeleteCommentMutation = gql`
    mutation updateTodoDeleteComment($trackId: ID!, $todoId: ID!, $commentId: ID!) {
        updateTodoDeleteComment(trackId: $trackId, todoId: $todoId, commentId: $commentId) 
    }
`;

export const deleteTodoMutation = gql`
    mutation deleteTodo($trackId: ID!, $todoId: ID!) {
        deleteTodo(trackId: $trackId, todoId: $todoId)
    }
`;

export const insertUnusedFileMutation = gql`
    mutation insertUnusedFile($trackId: ID!, $fileId: ID!, $beginBar: Float!) {
        insertUnusedFile(trackId: $trackId, fileId: $fileId, beginBar: $beginBar)
    }
`;

export const setTrackName = gql`
    mutation setTrackName($trackId: ID!, $name: String!) {
        setTrackName(trackId: $trackId, name: $name)
    }
`;

export const operations = {
    queries: {
        tracksQuery,
    },
    mutations: {
        toggleLockTrackMutation,
        setTrackPanMutation,
        setSoloMutation,
        setMuteMutation,
        setRecMutation,
        deleteTrackMutation,
        setTrackVolumeMutation,
        releaseSelectedTrackMutation,
        selectTrackMutation,
        addTrackMutation,
        duplicateTrackMutation,
        createAudioRegionMutation,
        copyAudioRegionMutation,
        endAudioRegionMutation,
        deleteRegionMutation,
        deactivateGlobalSoloMutation,
        audioRegionUploadedMutation,
        moveAudioRegionMutation,
        cropRightAudioRegionMutation,
        cropLeftAudioRegionMutation,
        cutAudioRegionMutation,
        addTodoMutation,
        updateTodoPriorityMutation,
        updateTodoTitleMutation,
        updateTodoStateMutation,
        updateTodoDescriptionMutation,
        updateTodoDueDateMutation,
        updateTodoAssigneeMutation,
        updateTodoAddCommentMutation,
        updateTodoDeleteCommentMutation,
        deleteTodoMutation,
        insertUnusedFileMutation,
        setTrackName,
    },
    subscriptions: {
        tracksSubscription,
        regionsSubscription
    }
}