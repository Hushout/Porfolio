import { setIsVisioChat } from "../../user/actions";
import { types } from "./types";

export const setMenuOpen = menuOpen => async dispatch => await dispatch({ type: types.setMenuOpen, menuOpen });
export const setMenuRightOpen = menuRightOpen => async dispatch => await dispatch({ type: types.setMenuRightOpen, menuRightOpen });
export const setMenuLeftOpen = menuLeftOpen => async dispatch => await dispatch({ type: types.setMenuLeftOpen, menuLeftOpen });
export const setChatOpen = chatOpen => async dispatch => await dispatch({ type: types.setChatOpen, chatOpen });
export const setChatFocused = focused => async dispatch => await dispatch({ type: types.setChatFocused, focused });
export const setShowVisio = show => async dispatch => {
    if(!show){
       await  dispatch(setIsVisioChat(false));
    }
    await dispatch({ type: types.setShowVisio, show });
};
export const setVisioPosition = position => async dispatch => await dispatch({ type: types.setVisioPosition, position });
export const setCommentFocused = focused => async dispatch => await dispatch({ type: types.setCommentFocused, focused });

export const setTodoPopupFocused = focused => async dispatch => await dispatch({ type: types.setTodoPopupFocused, focused });

export const setSelectedMenuRight = selectedMenu => async dispatch => await dispatch({
    type: types.setSelectedMenuRight,
    selectedMenu
});

export const setSearchCollabFocused = focused => async dispatch => await dispatch({ type: types.setSearchCollabFocused, focused });

export const setNbUnreadMessages = (nbNotif = null) => async (dispatch,getState) => {
    let newNbNotif = nbNotif;
    const { UI: { layout: { nbUnreadMessages : storeNbNotif} } } = getState();
    if(newNbNotif === null){
        newNbNotif = storeNbNotif + 1;
    }
    await dispatch({type: types.setNbUnreadMessages,newNbNotif});
}