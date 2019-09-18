import Document, {Html, Head, Main, NextScript} from 'next/document';
import { ServerStyleSheet } from 'styled-components';



class MyDocument extends Document {

    static async getInitialProps(ctx){
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try{
            ctx.renderPage = () => originalRenderPage({
                enhanceApp: App => (props) => sheet.collectStyles(<App {...props} />),
                enhanceComponent: Component => Component
            });
            
            const props = await Document.getInitialProps(ctx);
            return {
                ...props,
                styles: <>{props.styles}{sheet.getStyleElement()}</>
            }
        }finally{
            sheet.seal();
        }

    }

    render(){
        return (
            <Html>
                <Head></Head>
                <body>
                    <Main></Main>
                    <NextScript></NextScript>
                    {/* <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script> */}
                </body>
            </Html>
        )
    }
}

export default MyDocument;