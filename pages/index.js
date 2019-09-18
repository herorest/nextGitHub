import {useState, useEffect, useReducer, useRef} from 'react'
import {Button} from 'antd';
import Link from 'next/link';
import getConfig from 'next/config';

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();

function MyCountFunc(props){
    // console.log(serverRuntimeConfig, publicRuntimeConfig);
    // const [count, setCount] = useState(0)

    const spanRef = useRef()
    const [count, dispatchCount] = useReducer(countReducer, 0)

    useEffect(() => {
        // 闭包陷阱
        const interval = setInterval(() => {
            console.log(spanRef);
            dispatchCount({type: 'increase'})
        }, 1000)
        
        // 组件卸载时执行
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <span ref={spanRef}>{count}</span>
            <Link href="/author?id=1" as='/author/1'><Button>{props.name}</Button></Link>
        </>
    );
}

function countReducer(state, action){
    switch(action.type){
        case 'increase':
            return state + 1;
        case 'decrease':
            return state - 1;
        default:
            return state;
    }
}


MyCountFunc.getInitialProps = () => {
    return {
        name: process.env.entry
    }
};

export default MyCountFunc;