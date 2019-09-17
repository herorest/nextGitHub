import {Button} from 'antd';
import Link from 'next/link';
import Head from 'next/head';

export default () => {
    return (
        <>
            <Link href="/author?id=1" as='/author/1'><Button>提交</Button></Link>
        </>
    );
}