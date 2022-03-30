import axios from 'axios';
import { types } from './types';
import { getAppsyncClient } from '../../apiClient/APIClient';
import { operations as userOperations } from './operations';
import { setLoginErrorMessage, setRegisterErrorMessage } from '../ui/Auth/actions';
import { Auth } from 'aws-amplify';
import { dictionnaire } from '../../i18n';
import { currentUserSelector } from './selectors';
import { removeProject, upsertProject, upsertUserProjects } from '../project/actions';

export const setIsVisioChat = isVisioChat => async dispatch => await dispatch({ type: types.setIsVisioChat, isVisioChat });


export const removeUserPresence = () => async () => {
    try {
        await getAppsyncClient().mutate({ mutation: userOperations.mutations.removeUserPresence });
    } catch (err) {
        console.log(err);
    }
}

export const logout = history => async dispatch => {
    try {
        await getAppsyncClient().mutate({ mutation: userOperations.mutations.removeUserPresence });
        await Auth.signOut();
        await dispatch({ type: types.logout });
        history.push('/auth');
    }
    catch (err) {

    }
}
export const setCurrentUserLocally = currentUser => async dispatch => await dispatch({ type: types.setCurrentUser, currentUser });
export const setCurrentUser = user => async (dispatch, getState) => {
    const { user: { currentUser } } = getState();
    await dispatch(setCurrentUserLocally(user));
    try {
        await getAppsyncClient().mutate({
            mutation: userOperations.mutations.updateUserMutation,
            variables: { user: dtoUserInput(user) }
        })
    } catch (err) {
        await dispatch(setCurrentUserLocally(currentUser));
        console.log(err);
    }
}

const dtoUserInput = user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    images: {
        avatar: { uploaded: user.images.avatar.uploaded },
    },
    roles: user.roles,
    styles:user.styles,
    city: user.city,
    country: user.country,
    description: user.description
});

export const loadCurrentUser = () => async (dispatch) => {
    try {
        const { data: { user: currentUser } } = await getAppsyncClient().query({
            query: userOperations.queries.getCurrentUserQuery,
        });
        await dispatch(setCurrentUserLocally(currentUser));
    } catch (err) {
        console.log(err);
    }
}

export const getAllUsers = () => async () => {
    try {
        const { data: { users } } = await getAppsyncClient().query({
            query: userOperations.queries.usersQuery
        });
        return users;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export const login = (email, password, firstTime) => async dispatch => {
    let message = '';
    try {
        const user = await Auth.signIn(email, password);
        if (!!user) {
            if (process.env.LOCAL) {
                const allUsers = await dispatch(getAllUsers());
                const currentUser = allUsers.find(u => !u.federated && u.email === email);
                await dispatch(setCurrentUserLocally(currentUser));
            } else {
                await dispatch(loadCurrentUser());
            }
            await dispatch(setLoginErrorMessage(undefined))
        } else if (!firstTime) {
            await dispatch(setLoginErrorMessage(dictionnaire.ui.register.invalidUsernamePassword))
        }
    }
    catch (error) {
        console.log(error)
        switch (error.code) {
            case 'UserNotConfirmedException':
                message = dictionnaire.ui.register.firstConfirmMail;
                break;
            case 'PasswordResetRequiredException':
                message = dictionnaire.ui.register.passwordBeenReset;
                break;
            case 'NotAuthorizedException':
                message = dictionnaire.ui.register.incorrectMailPassword;
                break;
            case 'UserNotFoundException':
                message = dictionnaire.ui.register.userUnknown;
                break;
            case 'InternalErrorException':
                message = dictionnaire.ui.register.internalError;
                break;
            case 'InvalidParameterException':
                message = dictionnaire.ui.register.invalidParameter;
                break;
            case 'ResourceNotFoundException':
                message = dictionnaire.ui.register.resourceNotFound;
                break;
            case 'TooManyRequestsException':
                message = dictionnaire.ui.register.tooManyRequests;
                break;
            default:
                message = error.message
                break;
        }
        await dispatch(setLoginErrorMessage(message));
        return message;
    }
}

export const federatedLogin = (user) => async (dispatch) => {
    try {
        await getAppsyncClient().mutate({
            mutation: userOperations.mutations.federatedLoginMutation,
            variables: {
                user
            }
        });
        await dispatch(loadCurrentUser());
        await dispatch(setLoginErrorMessage(undefined));

    } catch (err) {
        console.log(err);
    }
}

export const register = (username, email, password) => async dispatch => {
    let message = '';
    try {
        await Auth.signUp({
            username: email,
            password,
            attributes: {
                email: email,
                nickname: username
            }
        });
        await dispatch(setRegisterErrorMessage(undefined));
    }
    catch (error) {
        console.log(error);
        switch (error.code) {
            case 'CodeDeliveryFailureException':
                message = dictionnaire.ui.register.verificationCodeFails;
                break;
            case 'InternalErrorException':
                message = dictionnaire.ui.register.internalError;
                break;
            case 'InvalidEmailRoleAccessPolicyException':
                message = dictionnaire.ui.register.noAccessEmail;
                break;
            case 'InvalidLambdaResponseException':
                message = dictionnaire.ui.register.invalidLambdaResponse;
                break;
            case 'InvalidParameterException':
                message = dictionnaire.ui.register.invalidParameter;
                break;
            case 'InvalidPasswordException':
                message = dictionnaire.ui.register.invalidPassword;
                break;
            case 'InvalidSmsRoleAccessPolicyException':
                message = dictionnaire.ui.register.noPermissionforSMS;
                break;
            case 'InvalidSmsRoleTrustRelationshipException':
                message = dictionnaire.ui.register.noTrustRoleforSMS;
                break;
            case 'NotAuthorizedException':
                message = dictionnaire.ui.register.incorrectMailPassword;
                break;
            case 'ResourceNotFoundException':
                message = dictionnaire.ui.register.resourceNotFound;
                break;
            case 'TooManyRequestsException':
                message = dictionnaire.ui.register.tooManyRequests;
                break;
            case 'UnexpectedLambdaException':
                message = dictionnaire.ui.register.unexpectedLambda;
                break;
            case 'UserLambdaValidationException':
                message = dictionnaire.ui.register.wrongLambdaValidation;
                break;
            case 'UsernameExistsException':
                message = dictionnaire.ui.register.existsUsername;
                break;
            default:
                message = error.message
                break;
        }

    };
    return message;
}


export const uploadUserImage = (file, imageType, onUploadProgress) => async (dispatch, getState) => {
    const { user: { currentUser }} = getState();
    if (!!currentUser.images[imageType] && !!currentUser.images[imageType].uploadUrl) {
        const url = currentUser.images[imageType].uploadUrl;
        if (!!url && !!file) {
            try {
                await axios.put(url, file,
                    {
                        onUploadProgress,
                        headers: {
                            'Content-Type': file.type,
                        }
                    });
                const { data: { userImageUploaded } } = await getAppsyncClient().mutate({
                    mutation: userOperations.mutations.userImageUploadedMutation,
                    variables: { imageType }
                });
                await dispatch(upsertUserProjects(userImageUploaded));
                await dispatch(setCurrentUserLocally(userImageUploaded));
            } catch (err) {
                console.log(err);
            }
        }
    }
}

export const setPreferencesLocally = preferences => async dispatch => await dispatch({
    type: types.setPreferences,
    preferences
});

export const setAuthType = authType => async dispatch => await dispatch({ type: types.setAuthType, authType });

export const setGoogleUser = googleUser => async dispatch => await dispatch({ type: types.setGoogleUser, googleUser });
export const setFacebookUser = facebookUser => async dispatch => await dispatch({ type: types.setFacebookUser, facebookUser });
export const upsertUserPreferences = preferences => async (dispatch, getState) => {
    const currentUser = currentUserSelector(getState());
    const oldPrefs = currentUser.preferences;

    await dispatch(setPreferencesLocally({ ...oldPrefs, ...preferences }));
    try {
        await getAppsyncClient().mutate({
            mutation: userOperations.mutations.upsertUserPreferencesMutation,
            variables: { preferences }
        });
    } catch (err) {
        await dispatch(setPreferencesLocally(oldPrefs));
        console.log(err);
    }
}

export const inviteCollaborator = (email, invitee, project) => async (dispatch) => {
    const previousInvites = !!project.invites ? project.invites : [];
    const previousKnownInvites = !!project.knownInvites ? project.knownInvites : [];
    if (!!email) {
        await dispatch(upsertProject({ ...project, invites: [...previousInvites, email] }));
    } else if (!!invitee) {
        await dispatch(upsertProject({ ...project, knownInvites: [...previousKnownInvites, invitee] }));
    }
    if (!!email || !!invitee) {
        try {
            await getAppsyncClient().mutate({
                mutation: userOperations.mutations.inviteCollaboratorMutation,
                variables: {
                    email: !!email ? email : null,
                    inviteId: !!invitee ? invitee.id : null,
                    projectId: project.id
                }
            });
        } catch (err) {
            if (!!email) {

                await dispatch(upsertProject({ ...project, invites: previousInvites }));
            } else if (!!invitee) {
                await dispatch(upsertProject({ ...project, knownInvites: previousKnownInvites }));
            }
            console.log(err);
        }
    }

}

export const manageInvite = (projectId, accept) => async (dispatch) => {
    try {
        const { data: { manageInvite } } = await getAppsyncClient().mutate({
            mutation: userOperations.mutations.manageInviteMutation,
            variables: {
                projectId,
                accept
            }
        });
        if (!!manageInvite) {
            await dispatch(upsertProject(manageInvite));
        } else {
            await dispatch(removeProject({ id: projectId }));
        }
    } catch (err) {
        console.log(err);
    }
}

export const sendFeedbackUser = ({ type, feedback, satisfied }) => async () => {
    try {
        await getAppsyncClient().mutate({
            mutation: userOperations.mutations.sendFeedbackUserMutation,
            variables: {
                type,
                feedback,
                satisfied
            }
        });
    } catch (err) {
        console.log(err);
    }
}

export const emailAvailable = (email, federated = '') => async () => {
    try {
        const res = await fetch(process.env.GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': process.env.GRAPHQL_API_KEY
            },
            body: JSON.stringify({
                query: `query emailAvailableQuery($email: String!, $federated: String) {
                emailAvailable(email: $email, federated: $federated)
            }`,
                variables: {
                    email,
                    federated
                }
            })
        })
        const { data: { emailAvailable } } = await res.json();
        return emailAvailable;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const usernameAvailable = (username) => async () => {
    try {
        const res = await fetch(process.env.GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-key': process.env.GRAPHQL_API_KEY
            },
            body: JSON.stringify({
                query: `query usernameAvailableQuery($username: String!) {
                    usernameAvailable(username: $username)
            }`,
                variables: {
                    username
                }
            })
        })
        const { data: { usernameAvailable } } = await res.json();
        return usernameAvailable;
    } catch (error) {
        console.log(error);
        return false;
    }
}