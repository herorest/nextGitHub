import {useEffect, useRef, useMemo, memo, useCallback} from 'react'
import Link from 'next/link';
import {connect} from 'react-redux';
import getConfig from 'next/config';
import Router, {withRouter} from 'next/router';
import api from '../lib/requestApi';
import {Row, Col, List, Pagination} from 'antd'
import Repo from '../components/Repo';

const LANGUAGES = ['javascript', 'html', 'css', 'typescript', 'python', 'java'];

const SORTTYPES = [
    {
        name: 'best match'
    },
    {
        name: 'most stars',
        value: 'stars',
        order: 'desc'
    },
    {
        name: 'most forks',
        value: 'forks',
        order: 'desc'
    }
]

const selectedStyle = {
    borderLeft: '2px #e36209 solid',
    fontWeight:'100px'
}

const pagesize = 10;

const FilterLink = ({name, query, lang, sort, order, page}) => {
    let queryString = `?query=${query}`;
    if(lang) queryString += `&lang=${lang}`;
    if(sort) queryString += `&sort=${sort}&order=${order || 'desc'}`;
    if(page) queryString += `&page=${page}`;
    queryString += `&per_page=${pagesize}`;
    return <Link href={`/search${queryString}`}><a>{name}</a></Link>
}

function Search({router, repos}){
    const {sort, order, lang, query, page} = router.query;

    return (
        <div className="root">
            <Row gutter={20}>
                <Col span={6}>
                    <List 
                        bordered 
                        header={<span className="list-header">语言</span>} 
                        dataSource={LANGUAGES} 
                        renderItem={item => {
                            const selected = lang === item;
                            return (
                                <List.Item style={selected ? selectedStyle : null}>
                                    <FilterLink name={item} query={query} lang={item} sort={sort} order={order}></FilterLink>
                                </List.Item>
                            )
                    }}></List>

                    <List 
                        bordered 
                        header={<span className="list-header">条件</span>} 
                        dataSource={SORTTYPES} 
                        renderItem={item => {
                            let selected = false;
                            return (
                                <List.Item style={selected ? selectedStyle : null}>
                                    <FilterLink name={item.name} query={query} lang={item} sort={sort} order={order}></FilterLink>
                                </List.Item>
                            )
                    }}></List>
                </Col>
                <Col span={18}>
                    <h3 className="repos-title">{repos.total_count} 个仓库</h3>
                    {
                        repos.items && repos.items.length > 0 &&
                        repos.items.map(repo => <Repo repo={repo} key={repo.id}></Repo>)
                    }
                    
                    {
                        repos.items && repos.items.length > 0 &&
                        <div className="page">
                            <Pagination pageSize={pagesize} defaultCurrent={Number(page) || 1} total={repos.total_count > 1000 ? 1000 : repos.total_count} itemRender={(page, type, ol) => {
                                const p = type === 'page' ? page : type === 'prev' ? page - 1 : page + 1;
                                const name = type === 'page' ? page : ol;
                                return <FilterLink page={p} name={name} query={query} lang={lang} sort={sort} order={order}></FilterLink>
                            }} />
                        </div>
                    }
                </Col>
            </Row>
            <style jsx>{`
                .root{
                    padding:20px 0;
                }
                .list-header{
                    font-weight:bold;
                    font-size:16px;
                }
                .repos-title{
                    border-bottom: 1px solid #eee;
                    font-size:24px;
                    line-height:50px;
                }
            `}</style>

            <style jsx global>{`
                .ant-row{
                    margin:0!important;
                }
                .ant-list{
                    margin-bottom: 20px;
                }
            `}</style>

        </div>
    )
}

Search.getInitialProps = async ({ctx}) => {
    const {query, sort, lang, order, page} = ctx.query;

    if(!query){
        return {
            repos: {
                total_count: 0
            }
        }
    }

    let queryString = `?q=${query}`;

    if(lang) queryString += `+language:${lang}`;
    if(sort) queryString += `&sort=${sort}&order=${order || 'desc'}`;
    if(page) queryString += `&page=${page}`;
    queryString += `&per_page=${pagesize}`;

    const result = await api.request({ url: `/search/repositories${queryString}` }, ctx.req, ctx.res);

    return {
        repos: result.data
    }
}

export default withRouter(Search)