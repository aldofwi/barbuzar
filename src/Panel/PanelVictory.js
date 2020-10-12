import React, { Component } from 'react';
import { Fireworks } from 'fireworks/lib/react';

const TableHeader = names => {

        return(
            <thead>
            <tr>
                    <React.Fragment>
                        <th><span className="tit3">PLAYERS</span></th>
                        <th><span className="tit1">{names.nameData[0]}</span></th>
                        <th><span className="tit1">{names.nameData[1]}</span></th>
                        <th><span className="tit1">{names.nameData[2]}</span></th>
                        <th><span className="tit1">{names.nameData[3]}</span></th>
                    </React.Fragment>
            </tr>
            </thead>
                
        )
};

const TableFooter = totals => {

    return(
            <thead>
            <tr>
                        <th><span className="tit2">TOTAL</span></th>
                        <th>{totals.totalData[0] > 0 ? "+"+totals.totalData[0] : totals.totalData[0] }</th>
                        <th>{totals.totalData[1] > 0 ? "+"+totals.totalData[1] : totals.totalData[1] }</th>
                        <th>{totals.totalData[2] > 0 ? "+"+totals.totalData[2] : totals.totalData[2] }</th>
                        <th>{totals.totalData[3] > 0 ? "+"+totals.totalData[3] : totals.totalData[3] }</th>
            </tr>
            </thead>
        
    )
};

class PanelVictory extends Component {

    state = {

        names: [
            this.props.names[0],
            this.props.names[1],
            this.props.names[2],
            this.props.names[3],
        ],

        totals: [
            '',
            '',
            '',
            '',
        ]
    };

    componentDidMount() {
        console.log('O9 - PANELVICTORY - componentDidMount()');

        this.handleHeader();
        this.handleTotal();
    }

    handleHeader = () => {
        this.setState({ names: [...this.props.names]})
    };

    handleTotal = () => {
        this.setState({ totals: [...this.props.totals] })
    };

    render() {

        let fxProps = {
            count: 2,
            interval: 500,
            colors: ['#cc3333', '#4CAF50', '#2d3436'],
            calc: (props, i) => ({
              ...props,
              x: (i + 1) * (window.innerWidth / 3) - (i + 1) * 94,
              y: 250 + Math.random() * 100 - 50 + (i === 2 ? -80 : 0)
            })
          }

        console.log('O9 - VICTORY - PROPS.TOTALS : ', this.props.totals);

        const { names } = this.state;
        const { onClickReplayies } = this.props;

        return(

            <div className="Card-table" style={this.props.style}>

                <div className="PanelVictory">
                    VAINQUEUR : {this.props.winner}

                    <input
                        defaultValue="Replay"
                        className="btn btn-primary btn-sm" 
                        onClick={() => onClickReplayies()}
                    />
                </div>

                <Fireworks {...fxProps} />

                <table>
                    <TableHeader nameData={names} />
                    <TableFooter totalData={this.props.totals} />
                </table>

            </div>

        )
    }
}

export default PanelVictory;

// <Fireworks {...fxProps} /> 
// <div className="tabvic">