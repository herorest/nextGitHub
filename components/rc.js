import React, { Component } from 'react'

// 批量批注提示
export default class RevisionComment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            connected: true,
            isRestrictEditMode: undefined
        };
    }

    componentWillUnmount() {
        
    }

    componentDidMount(){
        
    }

    render() {
        
        return (
            <div className="list">
                {this.props.children}
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                </ul>
            </div>
        );
    }
}
