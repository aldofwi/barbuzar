import React, { Component } from 'react';
//import logo from "../Pictures/redarrow.svg";

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

        // console.log('06 - ARROW || this.props.nameofclass : ', this.props.nameofclass);

        return (
            <div className={this.props.nameofclass}>

                    {
                        this.props.nameofclass !== ""
                                    ?
                        <span role="img" aria-label="Reveil">⏰</span>
                                    : null
                    }
            </div>
        );  
    }
}

export default Arrow;










