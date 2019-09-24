import App, {Container} from 'next/app';
import {Provider} from 'react-redux'
import routeEvent from '../lib/routeEvent';
import {Router} from 'next/router';
import uniqueStore from '../lib/uniqueStore';
import Layout from '../components/layout';
import PageLoading from '../components/pageLoading';

// import 'antd/dist/antd.css';

// function makeEvent(type){
//     return (...args) => {
//         console.log(type, ...args);
//     }
// }

// for (const key in routeEvent) {
//     if (routeEvent.hasOwnProperty(key)) {
//         const event = routeEvent[key];
//         Router.events.on(event, makeEvent(event));
//     }
// }

class MyApp extends App {
    state = {
        loading: false
    }

    componentDidMount(){
        Router.events.on(routeEvent['changeStart'], this.startLoading);
        Router.events.on(routeEvent['changeComplete'], this.stopLoading);
        Router.events.on(routeEvent['changeError'], this.stopLoading);
    }

    componentWillUnmount(){
        Router.events.off(routeEvent['changeStart'], this.startLoading);
        Router.events.off(routeEvent['changeComplete'], this.stopLoading);
        Router.events.off(routeEvent['changeError'], this.stopLoading);
    }

    startLoading = () => {
        this.setState({
            loading: true
        });
    }

    stopLoading = () => {
        this.setState({
            loading: false
        });
    }

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
                    {
                        this.state.loading &&
                        <PageLoading></PageLoading>
                    }
                    <Layout>
                        <Component {...pageProps}></Component>
                    </Layout>
                </Provider>
            </Container>
        )
    }
}

export default uniqueStore(MyApp);