import gql from 'graphql-tag';

export const chatMessagesQuery = gql`
    query chatMessagesQuery($projectId: ID!){
        chatMessages(projectId: $projectId) {
            id,
            userId,
            projectId,
            type,
            message,
            date
    }
}`;

export const addChatMessageMutation = gql`
    mutation addChatMessageMutation($projectId: ID!, $message: String!) {
        addChatMessage(projectId: $projectId, message: $message) {
            id,
            userId,
            projectId,
            type,
            message,
            date
        } 
    }
`;

export const newChatMessageSubscription = gql`
    subscription newChatMessageSubscription($projectId: ID!) {
        newChatMessage(projectId: $projectId) {
            id,
            userId,
            projectId,
            type,
            message,
            date
        }
    }
`;

export const isWritingMutation = gql`
    mutation isWritingMutation($projectId: ID!) {
        isWriting(projectId: $projectId) {
            id,
            userId,
            projectId,
            type,
            date
        }
    }
`;

export const operations = {
    queries: {
        chatMessagesQuery
    },
    mutations: {
        addChatMessageMutation,
        isWritingMutation
    },
    subscriptions: {
        newChatMessageSubscription
    }
};