import React, { Component } from 'react';
import logo from "../Pictures/redarrow.svg";

class Arrow extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nameofclass: this.props.nameofclass,
            height: this.props.height,
            width: this.props.width,

        };
    }

    render() {

        console.log('06 - ARROW || this.props.nameofclass : ', this.props.nameofclass);

        return (
            <div>
                <img
                    src={logo}
                    alt="logo"
                    className={ this.props.nameofclass }
                    width={ this.props.width }
                    height={ this.props.height }
                />
            </div>
        );

    }
}

export default Arrow;










