import { selectedChatProjectSelector } from "../chatMessage/selectors";
import { createSelector } from 'reselect';
import { subscriptionTypes } from "../payment/types";

export const currentUserSelector = state => state.user.currentUser;
export const isAzertySelector = state => !state.user.currentUser || !state.user.currentUser.preferences || state.user.currentUser.preferences.isAZERTY;

export const preferencesSelector = createSelector(
  currentUserSelector,
  currentUser => !!currentUser && !!currentUser.preferences ? currentUser.preferences : {}
);

export const subscriptionTypeSelector = createSelector(
  currentUserSelector,
  currentUser => !!currentUser && !!currentUser.subscriptionType ? currentUser.subscriptionType : subscriptionTypes.free
);

export const limitNbOfProjectsBySubscriptionTypeSelector = createSelector(
  currentUserSelector,
  currentUser => !!currentUser && !!currentUser.subscriptionType ? currentUser.subscriptionType === subscriptionTypes.free? 3 : currentUser.subscriptionType === subscriptionTypes.premium? 12 : 1000 : 0
)

export const limitNbOfCollaboratorsBySubscriptionTypeSelector = createSelector(
  currentUserSelector,
  currentUser => !!currentUser && !!currentUser.subscriptionType ? currentUser.subscriptionType === subscriptionTypes.free? 1 : currentUser.subscriptionType === subscriptionTypes.premium? 3 : 7 : 0
)

export const limitNbOfCloudBySubscriptionTypeSelector = createSelector(
  currentUserSelector,
  currentUser => !!currentUser && !!currentUser.subscriptionType ? currentUser.subscriptionType === subscriptionTypes.free? 1*10e7 : currentUser.subscriptionType === subscriptionTypes.premium? 2*10e8 : 2*10e9 : 0
)

export const authTypeSelector = state => state.user.authType;
export const googleUserSelector = state => state.user.googleUser;
export const facebookUserSelector = state => state.user.facebookUser;

export const selectedChatCollaboratorsSelector = createSelector(
  selectedChatProjectSelector,
  currentUserSelector,
  (selectedChatProject, currentUser) => !!selectedChatProject ? [selectedChatProject.owner, ...selectedChatProject.collaborators].filter(c => c.id !== currentUser.id) : []
);
