import React, { Component } from 'react';

import "bootstrap/dist/css/bootstrap.css";

class PanelChoice extends Component {

    constructor(props) {
        super(props);

        this.contractsStates = [
            this.checkState(this.props.gameContracts[0]),
            this.checkState(this.props.gameContracts[1]),
            this.checkState(this.props.gameContracts[2]),
            this.checkState(this.props.gameContracts[3]),
            this.checkState(this.props.gameContracts[4]),
            this.checkState(this.props.gameContracts[5]),
            this.checkState(this.props.gameContracts[6]),
        ];

        this.state = {

            contractor: this.props.contractor,
            contracts: this.props.contracts,
            gameContracts: this.props.gameContracts,
            panelVis: this.props.panelVis,
            posPicked: this.props.posPicked,
            lastContract: this.props.lastContract,
            points: this.props.points,

        };
    }

    componentDidUpdate(props) {
        // console.log('03 - PANELCHOICE - componentDidUpdate - got some props: ', props);

        /*this.setState({
            panelVisible: props.panelVisible,
            contractor: props.contractor,
            lastContract: props.lastContract,
            gameContracts: props.gameContracts,
            contracts: props.contracts,
            points: props.points,
        });*/
    }

    checkState = (contract) => {

        switch(this.props.contractor) {

            case "NORTH" : if(this.props.contracts[0].indexOf(contract) > -1){ return "disabled"; } else { return ""; }
            case "SOUTH" : if(this.props.contracts[1].indexOf(contract) > -1){ return "disabled"; } else { return ""; }
            case "EAST"  : if(this.props.contracts[2].indexOf(contract) > -1){ return "disabled"; } else { return ""; }
            case "WEST"  : if(this.props.contracts[3].indexOf(contract) > -1){ return "disabled"; } else { return ""; }

            default : break;
        }

    };

    checkButton = (visible) => {
        // console.log('04 - BARBU - checkState() - visible : ', visible);

        if (visible) { return "button"; }
        else { return "hidden"; }

    };

    render() {

        // console.log('04 - PANELCHOICE - render() - this.props.contractor : ', this.props.contractor);
        // console.log('04 - PANELCHOICE - render() - this.props.contracts[1] : ', this.props.contracts[1]);
        // console.log('04 - PANELCHOICE - render() - this.contractsStates() : ', this.contractsStates);

        const PanelContracts = () => {

            return(
                <div className="PanelChoice">

                    <b> Make a Choice </b>

                </div>
            );

        };

        const { onClickHandies } = this.props;

        // <Emoji symbol="♥️" label="heart"/> {this.props.gameContracts[3]+ ' ♥️'}
        // console.log('04 - PANELCHOICE - checkState() - posPicked : ', this.props.posPicked);
        // , {this.props.username} console.log('04 - PANELCHOICE - checkState() - panelVisible : ', this.props.panelVis);

        return (

            <div className="PanelPosition">

                {
                    

                            this.state.panelVis && this.props.posPicked
                            ?
                                <PanelContracts/>
                            : null
                }

                <input className="btn btn-light" type={this.checkButton(this.state.panelVis && this.props.posPicked)} size={10} value={this.props.gameContracts[0]+' 🎅🏾'} onClick={() => onClickHandies(this.props.gameContracts[0])} disabled={this.contractsStates[0]}/><br/>
                <input className="btn btn-light" type={this.checkButton(this.state.panelVis && this.props.posPicked)} size={10} value={'🎲 '+this.props.gameContracts[2]} onClick={() => onClickHandies(this.props.gameContracts[2])} disabled={this.contractsStates[2]}/><br/>
                <input className="btn btn-light" type={this.checkButton(this.state.panelVis && this.props.posPicked)} size={10} value={this.props.gameContracts[1]+' 🔥'} onClick={() => onClickHandies(this.props.gameContracts[1])} disabled={this.contractsStates[1]}/><br/>
                <input className="btn btn-light" type={this.checkButton(this.state.panelVis && this.props.posPicked)} size={10} value={'🧡 Cœurs'} onClick={() => onClickHandies(this.props.gameContracts[3])} disabled={this.contractsStates[3]}/><br/>
                <input className="btn btn-light" type={this.checkButton(this.state.panelVis && this.props.posPicked)} size={10} value={this.props.gameContracts[4]+' 👸🏽'} onClick={() => onClickHandies(this.props.gameContracts[4])} disabled={this.contractsStates[4]}/><br/>
                <input className="btn btn-light" type={this.checkButton(this.state.panelVis && this.props.posPicked)} size={10} value={'🀄️ '+this.props.gameContracts[5]} onClick={() => onClickHandies(this.props.gameContracts[5])} disabled={this.contractsStates[5]}/><br/>
                <input className="btn btn-light" type={this.checkButton(this.state.panelVis && this.props.posPicked)} size={10} value={this.props.gameContracts[6]+' 🎖'} onClick={() => onClickHandies(this.props.gameContracts[6])} disabled={this.contractsStates[6]}/><br/>

            </div>

        );
    }
}

export default PanelChoice;
