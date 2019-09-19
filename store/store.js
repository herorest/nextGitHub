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

const store = createStore(combineReducers({
    counter: counterReducer
}), {
    counter: initialState
}, composeWithDevTools(applyMiddleware(ReduxThunk)));

export default store;