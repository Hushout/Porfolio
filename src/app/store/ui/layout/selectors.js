import { createSelector } from "reselect";
import { isPopupSelector } from "../Popup/selectors";

export const UILayoutMenuOpenSelector = state => state.UI.layout.menuOpen;
export const UILayoutMenuRightOpenSelector = state => state.UI.layout.menuRightOpen;
export const UILayoutMenuLeftOpenSelector = state => state.UI.layout.menuLeftOpen;
export const UILayoutChatOpenSelector = state => state.UI.layout.chatOpen;
export const UILayoutChatFocusedSelector = state => state.UI.layout.chatFocused;
export const UILayoutVisioSelector = state => state.UI.layout.visio;
export const todoPopupFocusedSelector = state => state.UI.layout.todoPopupFocused;
export const UILayoutCommentFocusedSelector = state => state.UI.layout.commentFocused;
export const UILayoutSelectedMenuRight = state => state.UI.layout.selectedMenuRight;

export const UILayoutSearchCollabFocusedSelector = state => state.UI.layout.searchCollabFocused;

export const hotkeyEnabledSelector = createSelector(
    UILayoutChatFocusedSelector,
    todoPopupFocusedSelector,
    UILayoutCommentFocusedSelector,
    UILayoutSearchCollabFocusedSelector,
    isPopupSelector,
    (chatFocused, todoPopupFocused, commentFocused, searchCollabFocused, isPopup) => !isPopup && !chatFocused && !todoPopupFocused && !commentFocused && !searchCollabFocused
);

export const nbUnreadMessagesSelector = state => state.UI.layout.nbUnreadMessages;