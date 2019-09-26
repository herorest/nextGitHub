import React, { useState, useCallback } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Input, Avatar, Dropdown } from 'antd';
import Container from './container';
import getConfig from 'next/config';
import {connect} from 'react-redux';
import {logout} from '../store/store';
import {withRouter} from 'next/router';
import './layout.css'
import axios from 'axios';

const { Header, Content, Footer } = Layout;
const {publicRuntimeConfig} = getConfig();



// 批量批注提示
const LayoutComp = ({children, user, userLogout, router}) => {
    const [searchVal, setSearchVal] = useState('');

    const handleSearchChange = useCallback((e) => {
        setSearchVal(e.target.value);
    }, []);

    const handleOnSearch = useCallback((e) => {
        
    }, []);

    const handleLogout = useCallback((e) => {
        userLogout();
    }, [userLogout]);

    const handleGoOAuth = useCallback((e) => {
        e.preventDefault();
        axios.get(`/prepare-auth?url=${router.asPath}`).then(res => {
            if(res.status === 200){
                location.href = publicRuntimeConfig.oAuthUrl;
            }else{
                console.log('prepare auth failed', res);
            }
        }).catch(err => {
            console.log('prepare auth ajax failed', err);
        });
    }, []);

    const menu = (
        <Menu>
            <Menu.Item>
                <a href="javascript:void(0);" onClick={handleLogout}>登出</a>
            </Menu.Item>
        </Menu>
    );
    

    return (
        <Layout>
            <Header>
                <div className="header-inner">
                    <div className="header-left">
                        <div className="logo">
                            <Icon type="github" />
                        </div>
                        <div className="search">
                            <Input type="search" placeholder="搜索仓库" value={searchVal} onChange={handleSearchChange} onSearch={handleOnSearch}></Input>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="user">
                            {
                                user && user.id ? 
                                <Dropdown overlay={menu}>
                                    <a href="javascript:void(0);" className="avatar">
                                        <Avatar size={40} src={user.avatar_url}></Avatar>
                                    </a>
                                </Dropdown>
                                :
                                <a href="javascript:void(0);" onClick={handleGoOAuth}>
                                    <Avatar size={40} icon="user"></Avatar>
                                </a>
                            }
                        </div>
                    </div>
                </div>
            </Header>
            <Content>
                <Container>
                    {children}
                </Container>
            </Content>
            <Footer style={{ textAlign: 'center' }}>©2018 Created by SJ</Footer>
            <style jsx>
                {`
                    .header-inner{
                        display:flex;
                        justify-content: space-between;
                    }
                    .header-left{
                        display:flex;
                        justify-content: space-between;
                    }
                `}
            </style>
            <style jsx global>
                {`
                    #__next{
                        height:100%;
                    }
                    .ant-layout{
                        height:100%;
                    }
                    .ant-layout-header{
                        padding:0 20px;
                    }
                    .avatar{
                        display:block;
                    }
                `}
            </style>
        </Layout>
    )
}

LayoutComp.getInitialProps = (ctx) => {
    const store = ctx.store;
    return {
        
    }
};

export default connect(function mapStateToProps(state){
    return {
        user: state.user
    }
}, function mapDispatchToProps(dispatch){
    return {
        dispatch,
        userLogout: () => dispatch(logout())
    }
})(withRouter(LayoutComp));