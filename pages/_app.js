import App, {Container} from 'next/app';
import {Provider} from 'react-redux'
import routeEvent from '../lib/routeEvent';
import {Router} from 'next/router';
import uniqueStore from '../lib/uniqueStore';
import Layout from '../components/layout';

// import 'antd/dist/antd.css';

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

    static getInitialProps = async (ctx) => {
        const Component = ctx.Component;
        let pageProps;
        if(Component.getInitialProps){
            pageProps = await Component.getInitialProps(ctx);
        }
        return {
            pageProps
        };
    }

    render(){
        const {Component, pageProps, store} = this.props;

        return (
            <Container>
                <Provider store={store}>
                    <Layout>
                        <Component {...pageProps}></Component>
                    </Layout>
                </Provider>
            </Container>
        )
    }
}

export default uniqueStore(MyApp);