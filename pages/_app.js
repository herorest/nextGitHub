import App, {Container} from 'next/app';
// import 'antd/dist/antd.css';
import routeEvent from '../lib/routeEvent';
import {Router} from 'next/router';

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

    static getInitialProps = async ({Component}) => {
        let pageProps
        if(Component.getInitialProps){
            pageProps = await Component.getInitialProps();
        }
        return {
            pageProps
        } 
    }

    render(){
        const {Component, pageProps} = this.props;

        return (
            <Container>
                <div className="Header">header</div>
                <Component {...pageProps}></Component>
                <div className="Footer">footer</div>
            </Container>
        )
    }
}

export default MyApp;