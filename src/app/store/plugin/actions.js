import { types } from './types';
import { getAppsyncClient } from '../../apiClient/APIClient';
import { operations } from './operations';

export const loadAvailablePlugins = () => async dispatch => {
    try {
        const { data: { availablePlugins } } = await getAppsyncClient().query({
            query: operations.queries.availablePluginsQuery
        });
        await dispatch({ type: types.setAvailablePlugins, availablePlugins });
    } catch (err) {
        console.log(err);
    }
};