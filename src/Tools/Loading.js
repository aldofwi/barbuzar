import React, { Component } from 'react';
import logo from "../Pictures/loadCard.png";

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
            <div className={ this.props.nameofclass } style={this.props.style}>
                    
                    <msgh> { this.props.message } </msgh>

                    <img
                        src={logo}
                        alt="logo"
                        className={ this.props.nameofclass === "LoadPosition" ? "App-logo" : this.props.nameofclass === "Card-table" ? "App-logo2" : "App-logo3" }
                        width={ this.props.width }
                        height={ this.props.height }
                    />
                
               

            </div>
        );

    }
}

export default Loading;