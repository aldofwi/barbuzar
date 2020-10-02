import React, { Component } from 'react';
import logo from "../Pictures/logo.svg";

class Loading extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nameofclass: this.props.nameofclass,
            height: this.props.height,
            width: this.props.width,
            message: this.props.message,

        };
    }

    render() {

        return (
            <div className={ this.props.nameofclass }>

                <p> { this.props.message } </p>

                <img
                    src={logo}
                    alt="logo"
                    className={ this.props.nameofclass === "LoadPosition" ? "App-logo" : "App-logo2" }
                    width={ this.props.width }
                    height={ this.props.height }
                />
            </div>
        );

    }
}

export default Loading;