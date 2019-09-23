import {createStore, combineReducers, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import axios from 'axios';

const LOGOUT = 'LOGOUT'

const userInitialState = {};

function userReducer(state = userInitialState, action){
    switch(action.type){
        case LOGOUT:
            return {}
        default:
            return state;
    }
}

const AllReducer = combineReducers({
    user: userReducer
});

const AllState = {
    user: userInitialState
}


export function logout(){
    return dispatch => {
        axios.post('/logout').then(res => {
            console.log(res);
            if(res.status === 200){
                dispatch({
                    type: LOGOUT
                });
            }else{
                console.log('logout failed', res);
            }
        }).catch(e => {
            console.log('logout post failed', e);
        });
    }
}

export default function initialStore(state){
    return createStore(
        AllReducer, 
        Object.assign({}, AllState, state), 
        composeWithDevTools(applyMiddleware(ReduxThunk))
    );
};