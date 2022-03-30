import { types } from "./types";

export const setMainGridTool = mainGridTool => async dispatch => await dispatch({type: types.setMainGridTool, mainGridTool})