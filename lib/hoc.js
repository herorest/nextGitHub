function showInfoHoc(App){

    function Hoc({Component, props, ...rest}){
        return <App Component={Component} pageProps={props} {...rest}></App> 
    }

    Hoc.getInitialProps = App.getInitialProps;

    return Hoc;
}

export default showInfoHoc;