import { Action, Reducer, combineReducers } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface LoginState {
    isLoading: boolean;
    username: string;
    password: string;
    logins: Login[];
}

export interface Login {
    id: number,
    username: string;
    password: string;
    active: boolean;
    lastLogin: string;
    clientId: number;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestLoginsAction {
    type: 'REQUEST_LOGINS';
    username: string;
    password: string;
}

interface UpdateLoginsAction {
    type: 'REQUEST_LOGINS';
    username: string;
    password: string;
}

interface ReceiveLoginsAction {
    type: 'RECEIVE_LOGINS';
    username: string;   
    password: string;
    logins: Login[];
}

interface ClearLoginsAction {
    type: 'CLEAR_LOGINS';
    username: string;
    password: string;
}

interface GetLoginsAction {
    type: 'GET_LOGINS';
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestLoginsAction | UpdateLoginsAction | ReceiveLoginsAction | ClearLoginsAction | GetLoginsAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestLogins: (username: string, password: string): AppThunkAction<KnownAction> => (dispatch, getState) =>
    { 
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();

        if (appState && appState.logins && username !== appState.logins.username && password !== appState.logins.password)
        {
            fetch("api/login?username=" + username + "&password=" + password)
                .then(response => response.json() as Promise<Login[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_LOGINS', username: username, password: password, logins: data });
                });

            dispatch({ type: 'REQUEST_LOGINS', username: username, password: password });
        }
    },
    updateLogins: (username: string, password: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();

        if (appState && appState.logins && username !== appState.logins.username && password !== appState.logins.password) {
            fetch("api/login?username=" + username + "&password=" + password)
                .then(response => response.json() as Promise<Login[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_LOGINS', username: username, password: password, logins: data });
                });
        }
    },
    requestLogout: (username: string, password: string): AppThunkAction<KnownAction> => (dispatch) => { dispatch({ type: 'CLEAR_LOGINS', username: username, password: password }); },
    getLogin: (): AppThunkAction<KnownAction> => (dispatch) => { dispatch({ type: 'GET_LOGINS'}); }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: LoginState = { isLoading: false, username: "", password: "", logins:[] };

export const reducer: Reducer<LoginState> = (state: LoginState | undefined, incomingAction: Action): LoginState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'GET_LOGINS':
            return {
                username: state.username,
                password: state.password,
                logins: state.logins,
                isLoading: false
            };
        case 'REQUEST_LOGINS':
            return {
                username: action.username,
                password: action.password,
                logins: state.logins,
                isLoading: true
            };
        case 'RECEIVE_LOGINS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.username === state.username && action.password === state.password) {
                return {
                    username: action.username,
                    password: action.password,
                    logins: action.logins,
                    isLoading: false
                };
            }
            break;
    }

    return state;
};

export const rootReducer = (state: LoginState | undefined, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    if (action.type === 'CLEAR_LOGINS') {
        state = undefined;
    }

    return reducer(state, action)
}
