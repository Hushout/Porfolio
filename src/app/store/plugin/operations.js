import gql from 'graphql-tag';

export const availablePluginsQuery = gql`
query availablePlugins($instrumentOnly: Boolean){
    availablePlugins(instrumentOnly: $instrumentOnly) {
        id, 
        name,
        type
    }
}`;

export const operations = {
    queries: {
        availablePluginsQuery
    },
};