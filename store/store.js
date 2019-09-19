import {createStore, combineReducers, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

const initialState = {
    count: 0
};

function counterReducer(state = initialState, action){
    switch(action.type){
        case 'INCREASE':
            return {
                count: state.count + 1
            };
        case 'DECREASE':
            return {
                count: state.count - 1
            };
        default:
            return state;
    }
}

const AllReducer = combineReducers({
    counter: counterReducer
});

const AllState = {
    counter: initialState
}

export default function initialStore(state){
    return createStore(
        AllReducer, 
        Object.assign({}, AllState, state), 
        composeWithDevTools(applyMiddleware(ReduxThunk))
    );
};