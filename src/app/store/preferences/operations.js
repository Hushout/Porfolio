import gql from 'graphql-tag';

const setAutoMuteMutation = gql`
    mutation setAutoMuteMutation($projectId: ID!, $autoMute: Boolean!) {
        setAutoMute(projectId: $projectId, autoMute: $autoMute)
    }
`;

const getPreferencesQuery = gql`
    query getPreferencesQuery($projectId: ID!) {
        preferences(projectId: $projectId) {
            autoMute,
            loopBar {
                begin,
                end,
                active
            },
            showEditor,
            isMetronome,
            zoomGrid
            latencyRec
        }
    }
`;

const setLoopBarMutation = gql`
    mutation setLoopBarMutation($projectId: ID!, $loopBar: LoopBarInput!) {
        setLoopBar(projectId: $projectId, loopBar: $loopBar) 
    }
`;

const setShowEditorMutation = gql`
    mutation setShowEditorMutation($projectId: ID!, $showEditor: Boolean!) {
        setShowEditor(projectId: $projectId, showEditor: $showEditor) 
    }
`;

const setIsMetronomeMutation = gql`
    mutation setIsMetronomeMutation($projectId: ID!, $isMetronome: Boolean!) {
        setIsMetronome(projectId: $projectId, isMetronome: $isMetronome) 
    }
`;

const setZoomGridMutation = gql`
    mutation setZoomGridMutation($projectId: ID!, $zoomGrid: Float!) {
        setZoomGrid(projectId: $projectId, zoomGrid: $zoomGrid) 
    }
`;

const setLatencyRecMutation = gql`
    mutation setLatencyRecMutation($projectId: ID!, $latencyRec: Float!) {
        setLatencyRec(projectId: $projectId, latencyRec: $latencyRec) 
    }
`;

export const operations = {
    queries: {
        getPreferencesQuery
    },
    mutations: {
        setAutoMuteMutation,
        setLoopBarMutation,
        setShowEditorMutation,
        setIsMetronomeMutation,
        setZoomGridMutation,
        setLatencyRecMutation
    }
};