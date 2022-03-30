import * as userTypes from './types';
import { AUTH_TYPE } from 'aws-appsync';

export const initialState = {
  authType: AUTH_TYPE.AWS_IAM,
  googleUser: undefined,
  facebookUser: undefined,
  currentUser: undefined,
};

export const userReducer = function (state = initialState, action) {
  switch (action.type) {
    case userTypes.setIsVisioChat:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          isVisioChat: action.isVisioChat
        }
      };
    case userTypes.setCurrentUser:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    case userTypes.logout:
      return initialState;
    case userTypes.setPreferences:
      return !!state.currentUser
        ? ({
          ...state,
          currentUser: {
            ...state.currentUser,
            preferences: action.preferences
          }
        })
        : state;
    case userTypes.setAuthType:
      return {
        ...state,
        authType: action.authType
      };
    case userTypes.setGoogleUser:
      return {
        ...state,
        googleUser: action.googleUser
      }
    case userTypes.setFacebookUser:
      return {
        ...state,
        facebookUser: action.facebookUser
      }
    case userTypes.setCurrentUserTotalAudioStorage:
      return {
        ...state,
        currentUser: { ...state.currentUser, totalAudioStorage: action.totalAudioStorage }
      }
    default:
      return state;
  }
}