import {useEffect, useRef, useMemo, memo, useCallback} from 'react'
import Link from 'next/link';
import {connect} from 'react-redux';
import getConfig from 'next/config';
import axios from 'axios';

const {publicRuntimeConfig} = getConfig();

function MyCountFunc(props){
    const spanRef = useRef();
    const config = useMemo(() => (
        {
            text: `count is ${props.count}`,
            color: props.count >= 10 ? 'red' : 'blue'
        }
    ), [props.count]);

    useEffect(() => {
        axios.get('/api/user/info').then(resp => console.log(resp));

        // 闭包陷阱
        const interval = setInterval(() => {
            props.add()
        }, 2000)
        
        // 组件卸载时执行
        return () => clearInterval(interval)
    }, []);

    const onClickDecrease = useCallback(() => {
        props.dispatch({type: 'INCREASE'})
    }, []);

    return (
        <>
            <p><span ref={spanRef}>{props.count}</span></p>
            <ChildEle config={config} decrease={onClickDecrease}></ChildEle>
            <Link href="/author?id=1" as='/author/1'><button>{props.name}</button></Link>
            <a href={publicRuntimeConfig.oAuthUrl}>登录</a>
        </>
    );
}


const ChildEle = memo(function ({config, decrease}){
    return <button onClick={decrease}>
        <span style={{color: config.color}}>{config.text}</span>
    </button>
});


MyCountFunc.getInitialProps = (ctx) => {
    const store = ctx.store;
    // store.dispatch({type: 'INCREASE'});
    return {
        name: process.env.entry
    }
};

export default connect(function mapStateToProps(state){
    return {
        count: state.counter.count
    }
}, function mapDispatchToProps(dispatch){
    return {
        dispatch,
        add: (num) => dispatch({type: 'INCREASE' , num})
    }
})(MyCountFunc);