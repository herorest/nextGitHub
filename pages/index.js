import {useEffect, useRef, useMemo, memo, useCallback} from 'react';
import axios from 'axios';

function Index(props){
    return (
        <>
            <ul></ul>
        </>
    );
}


Index.getInitialProps = async ({ctx}) => {
    const result = await api.request({url: '/search/repositories?q=react'}, ctx.req, ctx.res);
    return {
        data: result.data
    }
};

export default Index;