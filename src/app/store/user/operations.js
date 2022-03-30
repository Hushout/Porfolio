import gql from 'graphql-tag';

const getKnownCollaboratorsQuery = gql`
        query getKnownCollaboratorsQuery {
            knownCollaborators {
                id
                username
                email
                images {
                    avatar {
                        url
                        uploaded
                    }
                }
                roles
                styles
                city
                country
                description
                online
                isVisioChat
                projectIdPresence
            }
        }
    `;

const getCurrentUserQuery = gql`
    query getCurrentUser {
        user {
            id
            username
            email
            federated
            images {
                avatar {
                    url
                    uploadUrl
                    uploaded
                }
            }
            roles
            styles
            city
            country
            description
            preferences{
                pauseOnChangingTab
                isAZERTY
                language
                emailVisibility
                notifications{
                    collabMail
	                collabPush
                    projectsAddRemCollabMail
                    projectsAddRemCollabPush
                    projectsDelMail
                    projectsDelPush
                    taskDescTitlePush
                    taskStatusChangeMail
                    taskStatusChangePush
                    taskNewCommentMail
                    taskNewCommentPush
                    taskAssignmentMail
                    taskAssignmentPush
                    chatPush
                    marketingMail
                    marketingPush
                }
            }
            online
            isVisioChat
            projectIdPresence
	        skipFeedback
            subscriptionType
	        banned
	        customerId
            totalAudioStorage
        }
    }
`;

const searchCollaboratorsQuery = gql`
    query searchCollaborators($search: String!) {
        searchCollaborators(search: $search) {
            id
            username
            email
            federated
            images {
                avatar {
                    url
                    uploadUrl
                    uploaded
                }
            }
            roles
            styles
            city
            country
            description
            preferences{
                pauseOnChangingTab
                isAZERTY
                language
                emailVisibility
                notifications{
                    collabMail
	                collabPush
                    projectsAddRemCollabMail
                    projectsAddRemCollabPush
                    projectsDelMail
                    projectsDelPush
                    taskDescTitlePush
                    taskStatusChangeMail
                    taskStatusChangePush
                    taskNewCommentMail
                    taskNewCommentPush
                    taskAssignmentMail
                    taskAssignmentPush
                    chatPush
                    marketingMail
                    marketingPush
                }
            }
            online
            isVisioChat
            projectIdPresence
        }
    }
`;

const userImageUploadedMutation = gql`
    mutation userImageUploaded($imageType: String!) {
        userImageUploaded(imageType: $imageType) {
            id
            username
            federated
            email
            images {
                avatar {
                    url
                    uploadUrl
                    uploaded
                }
            }
            roles
            styles
            city
            country
            description
            preferences{
                pauseOnChangingTab
                isAZERTY
                language
                emailVisibility
                notifications{
                    collabMail
	                collabPush
                    projectsAddRemCollabMail
                    projectsAddRemCollabPush
                    projectsDelMail
                    projectsDelPush
                    taskDescTitlePush
                    taskStatusChangeMail
                    taskStatusChangePush
                    taskNewCommentMail
                    taskNewCommentPush
                    taskAssignmentMail
                    taskAssignmentPush
                    chatPush
                    marketingMail
                    marketingPush
                }
            }
            online
            isVisioChat
            projectIdPresence
        }
    }
`;

const updateUserMutation = gql`
    mutation updateUser($user: UserInput!) {
        updateUser(user: $user) 
    }
`;

const federatedLoginMutation = gql`
    mutation federatedLogin($user: UserInput!) {
        federatedLogin(user: $user) {
            id
            username
            federated
            email
            images {
                avatar {
                    url
                    uploadUrl
                    uploaded
                }
            }
            roles
            styles
            city
            country
            description
            preferences{
                pauseOnChangingTab
                isAZERTY
                language
                emailVisibility
                notifications{
                    collabMail
	                collabPush
                    projectsAddRemCollabMail
                    projectsAddRemCollabPush
                    projectsDelMail
                    projectsDelPush
                    taskDescTitlePush
                    taskStatusChangeMail
                    taskStatusChangePush
                    taskNewCommentMail
                    taskNewCommentPush
                    taskAssignmentMail
                    taskAssignmentPush
                    chatPush
                    marketingMail
                    marketingPush
                }
            }
            online
            isVisioChat
            projectIdPresence
            subscriptionType
	        banned
	        customerId
        }
    }
`;

const upsertUserPreferencesMutation = gql`
    mutation upsertUserPreferences($preferences: UserPreferencesInput!){
         upsertUserPreferences(preferences: $preferences) {
            id
            username
            email
            images {
                avatar {
                    url
                    uploadUrl
                    uploaded
                }
            }
            roles
            styles
            city
            country
            description
            preferences{
                pauseOnChangingTab
                isAZERTY
                language
                emailVisibility
                notifications{
                    collabMail
	                collabPush
                    projectsAddRemCollabMail
                    projectsAddRemCollabPush
                    projectsDelMail
                    projectsDelPush
                    taskDescTitlePush
                    taskStatusChangeMail
                    taskStatusChangePush
                    taskNewCommentMail
                    taskNewCommentPush
                    taskAssignmentMail
                    taskAssignmentPush
                    chatPush
                    marketingMail
                    marketingPush
                }
            }
            online
            isVisioChat
            projectIdPresence
        }
    }
`;

const updateUserPresence = gql`
    mutation updateUserPresence($projectId: ID!, $currentTime: Float , $isPlaying: Boolean,$isVisioChat: Boolean) {
        updateUserPresence(projectId: $projectId, currentTime: $currentTime, isPlaying: $isPlaying, isVisioChat: $isVisioChat) {
            userId
            projectId
            online
            isVisioChat
            currentTime
            isPlaying
        }
    }
`;

const removeUserPresence = gql`
    mutation removeUserPresence {
        removeUserPresence
    }
`;

const inviteCollaboratorMutation = gql`
    mutation inviteCollaborator($email: String, $inviteId: ID, $projectId: ID!) {
        inviteCollaborator(email: $email, inviteId: $inviteId, projectId: $projectId)
    }
`;

const userPresenceSubscription = gql`
    subscription userPresenceChanged($for: ID!) {
        userPresenceChanged(for: $for) {
            userId
            projectId
            online
            isVisioChat
            currentTime
            isPlaying
            loopBar {
                active
                begin
                end
            }
        }
    }
`;

const manageInviteMutation = gql`
    mutation manageInvite($projectId: ID!, $accept: Boolean!) {
        manageInvite(projectId: $projectId, accept: $accept) {
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
                description
                online
                isVisioChat
                projectIdPresence
            }
            waitingInvite
        }
    }
`;

const emailAvailableQuery = gql`
    query emailAvailableQuery($email: String!, $federated: String) {
        emailAvailable(email: $email, federated: $federated)
    }
`;

const usernameAvailableQuery = gql`
    query usernameAvailableQuery($username: String!) {
        usernameAvailable(username: $username)
    }
`;

const usersQuery = gql`
    query users{
        users {
            id
            username
            email
            federated
            images {
                avatar {
                    url
                    uploaded
                }
            }
            roles
            styles
            city
            country
            description
            preferences{
                pauseOnChangingTab
                isAZERTY
                language
                emailVisibility
                notifications{
                    collabMail
	                collabPush
                    projectsAddRemCollabMail
                    projectsAddRemCollabPush
                    projectsDelMail
                    projectsDelPush
                    taskDescTitlePush
                    taskStatusChangeMail
                    taskStatusChangePush
                    taskNewCommentMail
                    taskNewCommentPush
                    taskAssignmentMail
                    taskAssignmentPush
                    chatPush
                    marketingMail
                    marketingPush
                }
            }
            online
            isVisioChat
            projectIdPresence
            subscriptionType
	        banned
	        customerId
        }
    }
`;

const sendFeedbackUserMutation = gql`
    mutation sendFeedbackUser($type: String!, $feedback:String!, $satisfied: Boolean!) {
        sendFeedbackUser(type: $type, feedback: $feedback, satisfied: $satisfied)
    }
`;

const userSubscriptionSubscription = gql`
    subscription userSubscriptionChanged($userId: ID!) {
        userSubscriptionChanged(userId: $userId) {
            userId
            subscriptionType
            banned
            messageType
        }
    }
`;
export const operations = {
    queries: {
        getKnownCollaboratorsQuery,
        getCurrentUserQuery,
        searchCollaboratorsQuery,
        emailAvailableQuery,
        usernameAvailableQuery,
        usersQuery
    },
    mutations: {
        userImageUploadedMutation,
        updateUserMutation,
        federatedLoginMutation,
        upsertUserPreferencesMutation,
        updateUserPresence,
        removeUserPresence,
        inviteCollaboratorMutation,
        manageInviteMutation,
        sendFeedbackUserMutation
    },
    subscriptions: {
        userPresenceSubscription,
        userSubscriptionSubscription
    }
}