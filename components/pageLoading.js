import { Spin } from 'antd';


// 批量批注提示
export default () => {
    return (
        <div className="root">
            <Spin></Spin>
            <style jsx>{
                `
                .root{
                    position:fixed;
                    left:0;
                    top:0;
                    right:0;
                    bottom:0;
                    background:rgba(255,255,255,0.24);
                    z-index:10001;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                }
            `
            }</style>
        </div>
    )
}