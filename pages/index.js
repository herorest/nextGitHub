import {useState, useEffect, useReducer, useRef, useMemo, memo, useCallback} from 'react'
import {Button, Input} from 'antd';
import Link from 'next/link';
import getConfig from 'next/config';

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();

function MyCountFunc(props){
    // console.log(serverRuntimeConfig, publicRuntimeConfig);
    // const [count, setCount] = useState(0)

    const spanRef = useRef()
    const [name, setName] = useState('hello')
    const [count, dispatchCount] = useReducer(countReducer, 0)
    const config = useMemo(() => (
        {
            text: `count is ${count}`,
            color: count >= 10 ? 'red' : 'blue'
        }
    ), [count])

    useEffect(() => {
        // 闭包陷阱
        const interval = setInterval(() => {
            dispatchCount({type: 'increase'})
        }, 2000)
        
        // 组件卸载时执行
        return () => clearInterval(interval)
    }, [])

    const onClickDecrease = useCallback(() => {
        dispatchCount({type: 'decrease'})
    }, [])

    return (
        <>
            <p><span ref={spanRef}>{count}</span></p>
            <Input type="text" value={name} onChange={e => setName(e.target.value)}></Input>
            <ChildEle config={config} decrease={onClickDecrease}></ChildEle>
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

const ChildEle = memo(function ({config, decrease}){
    return <Button onClick={decrease}>
        <span style={{color: config.color}}>{config.text}</span>
    </Button>
})


MyCountFunc.getInitialProps = () => {
    return {
        name: process.env.entry
    }
};

export default MyCountFunc;