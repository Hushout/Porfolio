import gql from 'graphql-tag';

export const updateAppSubscription = gql`
    subscription updateApp {
        updateAppChanged {
            status
        }
    }
`;

export const updateAppQuery = gql`
    query updateApp {
        updateApp {
            status
        }
    }
`;



export const operations = {
    subscriptions: {
        updateAppSubscription
    },
    queries: {
        updateAppQuery
    }
}