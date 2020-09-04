import React, { Component } from 'react';

class PanelDisplay extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nameofclass: this.props.nameofclass,
            content: this.props.content,
        };
    }

    render() {

        // console.log('06 - PANELDISPLAY || content : ', this.props.content);

        return (

            <div className={this.props.nameofclass} >

                    { this.props.content }

            </div>
        );
    }
}

export default PanelDisplay;










