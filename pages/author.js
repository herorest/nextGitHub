import Rc from '../components/rc';
import {withRouter} from 'next/router';

const author = ({router}) => <Rc>{router.query.id}</Rc>;
export default withRouter(author);