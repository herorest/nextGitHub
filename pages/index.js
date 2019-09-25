import {useEffect, useRef, useMemo, memo, useCallback} from 'react'
import api from '../lib/requestApi';
import {Button, Icon, Tabs} from 'antd';
import {connect} from 'react-redux';
import Repo from '../components/Repo';
import Router, {withRouter} from 'next/router';

let cacheUserRepos, cacheUserStarred;
const isServer = typeof window === 'undefined';

function Index({repos, starred, user, router}){
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
    const tabkey = router.query.tabkey || 1;

    const handleTabChange = (key) => {
        Router.push(`/?tabkey=${key}`);
    }

    useEffect(() => {
        if(!isServer){
            cacheUserRepos = repos;
            cacheUserStarred = starred;
        }
        setTimeout(() => {
            cacheUserRepos = null;
            cacheUserStarred = null;
        }, 1000 * 50);
    }, [repos, starred]);

    return (
        <div className="root">
            <div className="user-info">
                <img src={user.avatar_url} className="avatar"></img>
                <span className="login">{user.login}</span>
                <span className="name">{user.name}</span>
                <span className="bio">{user.bio}</span>
                <p className="email">
                    <Icon type="email" style={{marginRight: 10}}></Icon>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                </p>
            </div>
            <div className="user-repos">
                <Tabs defaultActiveKey={tabkey} onChange={handleTabChange} animated={false}>
                    <Tabs.TabPane tab="我的仓库" key="1">
                        {
                            repos.length > 0 &&
                            repos.map(repo => <Repo key={repo.id} repo={repo}></Repo>)
                        }
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="我关注的仓库" key="2">
                        {
                            starred.length > 0 && 
                            starred.map(repo => <Repo key={repo.id} repo={repo}></Repo>)
                        }
                    </Tabs.TabPane>
                </Tabs>
                
            </div>
                <style jsx>{`
                    .root{
                        display:flex;
                        align-items: flex-start;
                        padding:20px;
                    }
                    .user-info{
                        width:200px;
                        margin-right:40px;
                        flex-shrink: 0;
                        display:flex;
                        flex-direction: column;
                    }
                    .login{
                        font-weight:800;
                        font-size:20px;
                        margin-top:20px;
                    }
                    .name{
                        font-size:16px;
                        color:#777;
                    }
                    .bio{
                        margin-top:20px;
                        color:#333;
                    }
                    .avatar{
                        width:100%;
                        border-radius:5px;
                    }
                    .user-repos{
                        flex-grow:1;
                    }
                `}</style>
        </div>
    );
}

Index.getInitialProps = async ({ctx, store}) => {
    const user = store.getState().user;
    if(!user || !user.id){
        return {}
    }
    
    if(!isServer && cacheUserRepos && cacheUserStarred){
        return {
            repos: cacheUserRepos,
            starred: cacheUserStarred
        }
    }

    const userRepos = await api.request({url: '/user/repos'}, ctx.req, ctx.res);
    const userStarred = await api.request({url: '/user/starred'}, ctx.req, ctx.res);
    
    return {
        repos: userRepos.data,
        starred: userStarred.data
    }
};

export default withRouter(connect(function mapStateToProps(state){
    return {
        user: state.user
    }
})(Index));
