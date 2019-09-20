import {Component} from 'react';
import CreateStore from '../store/store';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getStore(state){
    if(isServer){
        return CreateStore(state);
    }

    if(!window[__NEXT_REDUX_STORE__]){
        window[__NEXT_REDUX_STORE__] = CreateStore(state);
    }

    return window[__NEXT_REDUX_STORE__];
}

function showInfoHoc(App){

    class Hoc extends Component {
        constructor(props) {
            super(props);
            this.store = getStore(props.initialReduxState);
        }

        render(){
            const {Component, props, ...rest} = this.props;
            return <App Component={Component} pageProps={props} {...rest} store={this.store}></App>;
        }
    }

    Hoc.getInitialProps = async (ctx) => {
        const store = getStore();
        ctx.store = store;

        let appProps = {};
        if(typeof App.getInitialProps === 'function'){
            appProps = await App.getInitialProps(ctx);
        }

        console.log(store.getState());

        return {
            ...appProps,
            initialReduxState: store.getState()
        };
    }
    

    return Hoc;
}

export default showInfoHoc;