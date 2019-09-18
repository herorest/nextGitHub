import {withRouter} from 'next/router';
import Link from 'next/link';
import {Button} from 'antd';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

//next按需引入组件
const Rc = dynamic(import('../components/rc'));

const Title = styled.h1`color: yellow; font-size: 40px`;

const author = (props) => {
    return (
        <>
            <Title>author</Title>
            <Rc>{props.router.query.id} {props.name}</Rc>
            <Link href="#hash"><Button>hash</Button></Link>
            <a href="javascript:void(0);">a 标签3</a>
            <a href="javascript:void(0);">a 标签2</a>
            <style jsx>
                {
                    `a{
                        color:#f00;
                    }`
                }
            </style>
        </>
    )
} ;
    

author.getInitialProps = () => {
    return {
        name: 'jim'
    }
};

export default withRouter(author);