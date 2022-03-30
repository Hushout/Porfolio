import gql from 'graphql-tag';

export const projectsSubscription = gql`
subscription projectsChanged($for: ID!) {
    projectsChanged(for: $for) {
        for
        type
        project {
            id
            name
            division {
                nbBeatsPerBar,
                unity
            }
            owner{
                id
                username
                email
                images {
                    avatar {
                        url
                        uploaded
                    }
                }
                city
                country
                description
                online
                isVisioChat
                projectIdPresence
                totalAudioStorage
                subscriptionType
            }
            collaborators {
                id,
                username
                email
                images {
                    avatar {
                        url
                        uploaded
                    }
                }
                city
                country
                description
                online
                isVisioChat
                projectIdPresence
            }
            tempo
            preferences{
                autoMute
                showEditor
                isMetronome
                zoomGrid
                latencyRec
                loopBar {
                    begin
                    end
                    active
                }
            }
            invites
            knownInvites {
                id,
                username
                email
                images {
                    avatar {
                        url
                        uploaded
                    }
                }
                city
                country
                description
                online
                isVisioChat
                projectIdPresence
            }
            waitingInvite
            audioStorage
            audioFiles {
                id
                name
                size
                stereo
                duration
                sampleRate
                creationDate
                regionIds
                url
            }
        }
    }
}`;

export const removeCollaboratorMutation = gql`
    mutation removeCollaboratorMutation($userId: ID!, $projectId: ID!) {
        removeCollaborator(userId: $userId, projectId: $projectId) {
            id
            username
            email
            images {
                avatar {
                    url
                    uploaded
                }
            }
            city
            country
            description
        }
    }`;
export const addCollaboratorMutation = gql`
    mutation addCollaboratorMutation($userId: ID!, $projectId: ID!) {
        addCollaborator(userId: $userId, projectId: $projectId) {
            id
            username
            email
            images {
                avatar {
                    url
                    uploaded
                }
            }
            city
            country
            description
            online
            isVisioChat
            projectIdPresence
        }
    }`;
export const projectsQuery = gql`
    query projects {
        projects {
            id,
            name,
            owner{
                id
                username
                email
                images {
                    avatar {
                        url
                        uploaded
                    }
                }
                city
                country
                description
                online
                isVisioChat
                projectIdPresence
                totalAudioStorage
                subscriptionType
            },
            collaborators {
                id,
                username,
                email
                images {
                    avatar {
                        url
                        uploaded
                    }
                }
                city
                country
                description
                online
                isVisioChat
                projectIdPresence
            },
            tempo,
            division {
                nbBeatsPerBar,
                unity
            }
            preferences{
                autoMute
                showEditor
                isMetronome
                zoomGrid
                latencyRec
                loopBar {
                    begin
                    end
                    active
                }
            }
            tracks {
                id
                selected
                alreadyInUse
                regions {
                    id
                    begin
                    beginCrop
                    endCrop
                    duration
                    isRec
                }
            }
            invites
            knownInvites {
                id,
                username
                email
                images {
                    avatar {
                        url
                        uploaded
                    }
                }
                city
                country
                online
                isVisioChat
                projectIdPresence
            }
            waitingInvite
            audioStorage
            audioFiles {
                id
                name
                size
                stereo
                duration
                sampleRate
                creationDate
                regionIds
                url
            }
        }
        }`;

export const projectQuery = gql`
    query project($projectId: ID!) {
        project(projectId: $projectId) {
            id,
            name,
            owner{
                id
                username
                email
                images {
                    avatar {
                        url
                        uploaded
                    }
                }
                city
                country
                description
                online
                isVisioChat
                projectIdPresence
                totalAudioStorage
                subscriptionType
            },
            collaborators {
                id,
                username,
                email
                images {
                    avatar {
                        url
                        uploaded
                    }
                }
                city
                country
                description
                online
                isVisioChat
                projectIdPresence
            },
            tempo,
            division {
                nbBeatsPerBar,
                unity
            }
            preferences{
                autoMute
                showEditor
                isMetronome
                zoomGrid
                latencyRec
                loopBar {
                    begin
                    end
                    active
                }
            }
            tracks {
                id
                selected
                alreadyInUse
                regions {
                    id
                    begin
                    beginCrop
                    endCrop
                    duration
                    isRec
                }
            }
            invites
            knownInvites {
                id
                username
                email
                images {
                    avatar {
                        url
                        uploaded
                    }
                }
                city
                country
                description
                online
                isVisioChat
                projectIdPresence
            }
            audioStorage
            audioFiles {
                id
                name
                size
                stereo
                duration
                sampleRate
                creationDate
                regionIds
                url
            }
        }
    }`;

export const addProjectMutation = gql`
    mutation addProjectMutation($name: String!) {
        addProject(name: $name) {
            id
            name
            tempo
            division {
                nbBeatsPerBar,
                unity
            }
            owner {
                id
                username
                email
                images {
                    avatar {
                        url
                        uploaded
                    }
                }
                city
                country
                description
                online
                isVisioChat
                projectIdPresence
                totalAudioStorage
                subscriptionType
            }
            collaborators {
                id
                username
                email
                images {
                    avatar {
                        url
                        uploaded
                    }
                }
                city
                country
                description
                online
                isVisioChat
                projectIdPresence
            }
            preferences{
                autoMute
                showEditor
                isMetronome
                zoomGrid
                latencyRec
                loopBar {
                    begin
                    end
                    active
                }
            }
            invites
            knownInvites {
                id
                username
                email
                images {
                    avatar {
                        url
                        uploaded
                    }
                }
                city
                country
                description
                online
                isVisioChat
                projectIdPresence
            }
            audioStorage
            audioFiles {
                id
                name
                size
                stereo
                duration
                sampleRate
                creationDate
                regionIds
                url
            }
        }
    }
`;

export const setProjectName = gql`
    mutation setProjectName($projectId: ID!, $name: String!) {
        setProjectName(projectId: $projectId, name: $name)
    }
`;


export const setTempoMutation = gql`
    mutation setTempoMutation($projectId: ID!, $tempo: Float!) {
        setTempo(projectId: $projectId, tempo: $tempo)
    }
`;

export const setDivisionMutation = gql`
    mutation setDivisionMutation($projectId: ID!, $division: DivisionInput!) {
        setDivision(projectId: $projectId, division: $division)
    }
`;

export const deleteProjectMutation = gql`
    mutation deleteProjectMutation($projectId: ID!) {
        deleteProject(projectId: $projectId)
    }
`;

export const deleteFileMutation = gql`
    mutation deleteFileMutation($projectId: ID!, $fileId: ID!) {
        deleteFile(projectId: $projectId, fileId: $fileId)
    }
`;

export const removeProjectInviteMutation = gql`
    mutation removeProjectInvite($projectId: ID!, $email: String!) {
        removeProjectInvite(projectId: $projectId, email: $email)
    }
`;

export const removeProjectKnownInviteMutation = gql`
    mutation removeProjectKnownInvite($projectId: ID!, $inviteId: ID!) {
        removeProjectKnownInvite(projectId: $projectId, inviteId: $inviteId)
    }
`;

export const operations = {
    queries: {
        projectsQuery,
        projectQuery
    },
    mutations: {
        removeCollaboratorMutation,
        addCollaboratorMutation,
        addProjectMutation,
        setTempoMutation,
        setDivisionMutation,
        deleteProjectMutation,
        deleteFileMutation,
        removeProjectInviteMutation,
        removeProjectKnownInviteMutation,
        setProjectName
    },
    subscriptions: {
        projectsSubscription
    }
};