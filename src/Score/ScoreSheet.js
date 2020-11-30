import React, { Component } from 'react';

const TableHeader = names => {

        return(
            <thead>
            <tr>
                <React.Fragment>
                    <th><span className="tit3">CONTRACTS</span></th>
                    <th><span className="tit1"><h4>{names.nameData[0]}</h4></span></th>
                    <th><span className="tit1"><h4>{names.nameData[1]}</h4></span></th>
                    <th><span className="tit1"><h4>{names.nameData[2]}</h4></span></th>
                    <th><span className="tit1"><h4>{names.nameData[3]}</h4></span></th>
                </React.Fragment>
            </tr>
            </thead>
        )
};

const TableBody = scores => {

    const rows = scores.scoreData.map((row, index) => {

        // console.log("05 - SCORESHEET: TABLE BODY = \nrow : ", row, "\nindex = ", index);

        if (index === 7 || index === 15 || index === 23) { // 7 15 23 --> 8 16 24

            return (
                    <tr key={index} className="splitLine">
                        <th className="splitLine"> - </th>
                        <td className="splitLine"> ------------------</td>
                        <td className="splitLine"> ------------------</td>
                        <td className="splitLine"> ------------------</td>
                        <td className="splitLine"> ------------------</td>
                    </tr>
            )
        } else {

            return (

                <tr key={index}>
                    <th>{row.contrat === "Barbu" ? row.contrat+' 🎅🏾' : row.contrat === "RATA" ? row.contrat+' 🔥' : row.contrat === "Domino" ? row.contrat+' 🎲' : row.contrat === "Dames" ? row.contrat+' 👸🏽' : row.contrat === "Coeur" ? 'Cœurs 🧡' : row.contrat === "Pli" ? row.contrat+' 🀄️' : row.contrat+' 🎖'}</th>
                    <td>{row.score1 > 0 ? <span className="cg"> {"+" + row.score1} </span> : (row.contrat === "Dernier Pli" || "Barbu" || "Domino") && (row.score1 < 0) ? <span className="crr"> {row.score1} </span> : row.score1}</td>
                    <td>{row.score2 > 0 ? <span className="cg"> {"+" + row.score2} </span> : (row.contrat === "Dernier Pli" || "Barbu" || "Domino") && (row.score2 < 0) ? <span className="crr"> {row.score2} </span> : row.score2}</td>
                    <td>{row.score3 > 0 ? <span className="cg"> {"+" + row.score3} </span> : (row.contrat === "Dernier Pli" || "Barbu" || "Domino") && (row.score3 < 0) ? <span className="crr"> {row.score3} </span> : row.score3}</td>
                    <td>{row.score4 > 0 ? <span className="cg"> {"+" + row.score4} </span> : (row.contrat === "Dernier Pli" || "Barbu" || "Domino") && (row.score4 < 0) ? <span className="crr"> {row.score4} </span> : row.score4}</td>
                </tr>
            )
        }
    });

    return (

        <tbody>
            {rows}
        </tbody>
    )
};

const TableLine = () => {

        return (
            <thead>
            <tr className="splitLine">
                <th className="splitLine"> - </th>
                <td className="splitLine"> ------------------</td>
                <td className="splitLine"> ------------------</td>
                <td className="splitLine"> ------------------</td>
                <td className="splitLine"> ------------------</td>
            </tr>
            </thead>
        )

};


const TableFooter = totals => {

    return(
        <thead>
        <tr>
        <React.Fragment>
            <th><span className="tit2"><h6>TOTAL</h6></span></th>
            <th>{totals.totalData[0] > 0 ? "+"+totals.totalData[0] : totals.totalData[0] }</th>
            <th>{totals.totalData[1] > 0 ? "+"+totals.totalData[1] : totals.totalData[1] }</th>
            <th>{totals.totalData[2] > 0 ? "+"+totals.totalData[2] : totals.totalData[2] }</th>
            <th>{totals.totalData[3] > 0 ? "+"+totals.totalData[3] : totals.totalData[3] }</th>
        </React.Fragment>
        </tr>
        </thead>
    )
};

class ScoreSheet extends Component {

    state = {

        names: [
            this.props.names[0],
            this.props.names[1],
            this.props.names[2],
            this.props.names[3],
        ],

        scores: [
            {
                contrat: 'X',
                score1: '0',
                score2: '0',
                score3: '0',
                score4: '0',
            },
        ],

        totals: [
            '',
            '',
            '',
            '',
        ]
    };

    componentDidMount() {
        console.log('O5 °°° SCORESHEET --- componentDidMount()');

        this.handleHeader();
        this.handleBody();
        this.handleTotal();
    }

    handleHeader = () => {
        this.setState({ names: [...this.props.names]})
    };

    handleBody = () => {
        this.setState({ scores: [...this.props.scores]})
    };

    handleTotal = () => {
        this.setState({ totals: [...this.props.totals] })
    };

    render() {

        // console.log('O5 - SCORESHEET - PROPS.SCORES : ', this.props.scores);
        // console.log('O5 - SCORESHEET - PROPS.TOTALS : ', this.props.totals);

        const { names } = this.state;
        // const { scores } = this.state;
        // const { totals } = this.state;

        return(

            <table>
                <TableHeader nameData={names} />
                <TableLine />
                <TableBody scoreData={this.props.scores} />
                <TableLine />
                <TableFooter totalData={this.props.totals} />
            </table>
            

        )
    }
}

export default ScoreSheet;