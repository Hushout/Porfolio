import { storeProject } from '../../project/types';
import { types } from './types';

export const initialState = {
    menuOpen: false,
    menuRightOpen: false,
    menuLeftOpen: false,
    chatOpen: true,
    nbUnreadMessages: 0,
    chatFocused: false,
    todoPopupFocused: false,
    visio: {
        show: false,
        position: {
            x: 0,
            y: 0
        }
    },
    commentFocused: false,
    selectedMenuRight: 'todoList',
    searchCollabFocused: false
};

export const UILayoutReducer = function (state = initialState, action) {
    switch (action.type) {
        case types.setNbUnreadMessages:
            return {...state, nbUnreadMessages : !state.chatOpen || !state.menuRightOpen? action.newNbNotif : 0}
        case types.setMenuOpen:
            return { ...state, menuOpen: action.menuOpen };
        case types.setMenuRightOpen:
            return { ...state, 
                menuRightOpen: action.menuRightOpen,
                nbUnreadMessages: action.menuRightOpen && state.chatOpen ? 0 : state.nbUnreadMessages};
        case types.setMenuLeftOpen:
            return { ...state, menuLeftOpen: action.menuLeftOpen };
        case types.setChatOpen:
            return { ...state, 
                chatOpen: action.chatOpen,
                nbUnreadMessages: action.chatOpen && state.menuRightOpen ? 0 : state.nbUnreadMessages };
        case types.setChatFocused:
            return { ...state, chatFocused: action.focused };
        case types.setShowVisio:
            return { ...state, visio: { ...state.visio, show: action.show } };
        case types.setVisioPosition:
            return { ...state, visio: { ...state.visio, position: action.position } };
        case types.setTodoPopupFocused:
            return { ...state, todoPopupFocused: action.focused };
        case types.setCommentFocused:
            return { ...state, commentFocused: action.focused };
        case types.setSelectedMenuRight:
            return { ...state, selectedMenuRight: action.selectedMenu };
        case types.setSearchCollabFocused:
            return { ...state, searchCollabFocused: action.focused };
        default:
            return state;
    }
}