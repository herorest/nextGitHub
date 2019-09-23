import React, { cloneElement } from 'react';

const style = {
    width: '100%',
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto'
}

// 批量批注提示
export default ({children, renderer = <div/>}) => {
    const newElement = cloneElement(renderer, {
        style: Object.assign({}, renderer.props.style, style),
        children
    });
    return newElement;
}