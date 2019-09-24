import {useEffect, useRef, useMemo, memo, useCallback} from 'react'
import api from '../lib/requestApi';
import {Button} from 'antd';
import {connect} from 'react-redux';

function Index({repos, starred, user}){
    if(!user || !user.id){
        return (
            <div className="root">
                <p>亲，你还没有登录哦！</p>
                <Button>登录</Button>

                <style jsx>{`
                    .root{
                        height:400px;
                        display:flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                `}</style>
            </div>
        );
    }
    return (
        <>
            <ul></ul>
        </>
    );
}


Index.getInitialProps = async ({ctx, store}) => {
    const user = store.getState().user;
    if(!user || !user.id){
        return {}
    }
    const userRepos = await api.request({url: '/user/repos'}, ctx.req, ctx.res);
    const userStarred = await api.request({url: '/user/starred'}, ctx.req, ctx.res);
    
    return {
        repos: userRepos.data,
        starred: userStarred.data
    }
};

export default connect(function mapStateToProps(state){
    return {
        user: state.user
    }
})(Index);
