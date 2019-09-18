import App, {Container} from 'next/app';
import {Provider} from 'react-redux'
import routeEvent from '../lib/routeEvent';
import {Router} from 'next/router';
import store from '../store/store';

// import 'antd/dist/antd.css';
import './index.css'

function makeEvent(type){
    return (...args) => {
        console.log(type, ...args);
    }
}

for (const key in routeEvent) {
    if (routeEvent.hasOwnProperty(key)) {
        const event = routeEvent[key];
        Router.events.on(event, makeEvent(event));
    }
}


class MyApp extends App {

    static getInitialProps = async ({Component, ctx}) => {
        let pageProps
        if(Component.getInitialProps){
            pageProps = await Component.getInitialProps(ctx);
        }
        return {
            pageProps
        } 
    }

    render(){
        const {Component, pageProps} = this.props;

        return (
            <Container>
                <Provider store={store}>
                    <div className="Header">header</div>
                    <Component {...pageProps}></Component>
                    <div className="Footer">footer</div>
                </Provider>
            </Container>
        )
    }
}

export default MyApp;