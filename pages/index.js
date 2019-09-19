import {useState, useEffect, useReducer, useRef, useMemo, memo, useCallback} from 'react'
import {Button, Input} from 'antd';
import Link from 'next/link';
import {connect} from 'react-redux';

function MyCountFunc(props){
    const spanRef = useRef();
    const [name, setName] = useState('hello');
    const config = useMemo(() => (
        {
            text: `count is ${props.count}`,
            color: props.count >= 10 ? 'red' : 'blue'
        }
    ), [props.count]);

    useEffect(() => {
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
            <Input type="text" value={name} onChange={e => setName(e.target.value)}></Input>
            <ChildEle config={config} decrease={onClickDecrease}></ChildEle>
            <Link href="/author?id=1" as='/author/1'><Button>{props.name}</Button></Link>
        </>
    );
}


const ChildEle = memo(function ({config, decrease}){
    return <Button onClick={decrease}>
        <span style={{color: config.color}}>{config.text}</span>
    </Button>
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