import Rc from '../components/rc';
import {withRouter} from 'next/router';
import Link from 'next/link';
import {Button} from 'antd';

const author = (props) => {
    return (
        <>
            <Rc>{props.router.query.id} {props.name}</Rc>
            <Link href="#hash"><Button>hash</Button></Link>
        </>
    )
} ;
    

author.getInitialProps = () => {
    return {
        name: 'jim'
    }
};

export default withRouter(author);