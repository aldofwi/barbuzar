import React, { Component } from 'react';

class Contractor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            contractor: this.props.contractor,
        };
    }

    getClass = (nsew) => {
        console.log('06 - CONTRACTOR || this.getClass() ');

        switch(nsew) {
            case "NORTH" : return "contractor-north";
            case "EAST"  : return "contractor-east";
            case "SOUTH" : return "contractor-south";
            case "WEST"  : return "contractor-west";
            default: break;

        }

    };

    render() {
        console.log('06 - CONTRACTOR || this.props.contractor : ', this.props.contractor);

        return (
            <div className={this.getClass(this.props.contractor)}>
               <b>ⓒ</b>
            </div>
        );

    }
}

export default Contractor;










