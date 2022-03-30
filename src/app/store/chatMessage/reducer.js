import { types } from './types';
import { nullId } from '../../services';

export const initialState = {
  selectedChatProjectId: nullId,
  messages: [],
  writers: []
};

const dtoMessage = message => ({ ...message, date: new Date(message.date) });

export const chatReducer = function (state = initialState, action) {
  switch (action.type) {
    case types.addWriter:
      if (state.writers.includes(action.userId)) {
        return state;
      }
      return { ...state, writers: [...state.writers, action.userId] };
    case types.removeWriter:
      return { ...state, writers: state.writers.filter(id => id !== action.userId) };
    case types.setSelectedChatProject:
      return { ...state, selectedChatProjectId: !!action.selectedChatProject ? action.selectedChatProject.id : nullId };
    case types.addChatMessage:
      var existingMessage = state.messages.find(m => m.id === action.message.id);
      if (!!existingMessage) {
        return state;
      }
      return { ...state, messages: [...state.messages, dtoMessage(action.message)] };
    case types.setChatMessages:
      return { ...state, messages: action.messages.map(m => dtoMessage(m)) };
    case types.removeChatMessage:
      return {
        ...state,
        messages: state.messages.filter(m => m.id !== action.message.id)
      }
    case types.replaceChatMessage:
      var newMessages = [];
      var existingMessage = state.messages.find(m => m.id === action.message.id || m.id === `${action.message.projectId}-${action.message.userId}`);
      if (!!existingMessage) {
        newMessages = state.messages.map(m =>
          m.id === `${action.message.projectId}-${action.message.userId}` ?
            dtoMessage(action.message) : m
        );
      } else {
        newMessages = [...state.messages, dtoMessage(action.message)];
      }

      return {
        ...state,
        messages: newMessages,
        writers: state.writers.filter(id => id !== action.message.userId)
      };
    default:
      return state;
  }
}