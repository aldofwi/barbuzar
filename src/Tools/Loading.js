import React, { Component } from 'react';
import logo from "../Pictures/loadCard.png";
import PanelDisplay from "../Panel/PanelDisplay";

class Loading extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nameofclass: this.props.nameofclass,
            height: this.props.height,
            width: this.props.width,
            message: this.props.message,
            name: this.props.name,
        };
    }

    render() {

        return (
            <div className={ this.props.nameofclass } style={this.props.style}>
                    
                    <div className={    this.props.nameofclass === "Card-table" ? "msghome" : 
                                        this.props.nameofclass === "LoadPosition" ? "msgpos" : "msgho"}> 

                                { this.props.message } 
                    </div>

                    {
                        this.props.nameofclass === "Card-table" ?

                        <PanelDisplay
                            nameofclass={"msgname"}
                            content={this.props.name}
                        />
                    : null
                    }

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