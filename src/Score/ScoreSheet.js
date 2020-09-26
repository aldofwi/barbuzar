import React, { Component } from 'react';

const TableHeader = names => {

        return(
            <thead>
                <tr>
                    <th><titre3>CONTRACTS</titre3></th>
                    <th><titre1>{names.nameData[0]}</titre1></th>
                    <th><titre1>{names.nameData[1]}</titre1></th>
                    <th><titre1>{names.nameData[2]}</titre1></th>
                    <th><titre1>{names.nameData[3]}</titre1></th>
                </tr>
            </thead>
        )
};

const TableBody = scores => {

    const rows = scores.scoreData.map((row, index) => {

        console.log("05 - SCORESHEET: TABLE BODY = \nrow : ", row, "\nindex = ", index);

        if (index === 7 || index === 15 || index === 23) { // 7 15 23

            return (
                <tr key={index} className="splitLine">
                    <th className="splitLine"> - </th>
                    <td className="splitLine"> ------------------</td>
                    <td className="splitLine"> ------------------</td>
                    <td className="splitLine"> ------------------</td>
                    <td className="splitLine"> ------------------</td>
                </tr>
            )
        }

        return (
                <tr key={index}>
                    <th>{row.contrat}</th>
                    <td>{row.score1 > 0 ? "+" + row.score1 : row.score1}</td>
                    <td>{row.score2 > 0 ? "+" + row.score2 : row.score2}</td>
                    <td>{row.score3 > 0 ? "+" + row.score3 : row.score3}</td>
                    <td>{row.score4 > 0 ? "+" + row.score4 : row.score4}</td>
                </tr>
            )
    });

    return <tbody>{rows}</tbody>
};

const TableFooter = totals => {

    return(
        <thead>
        <tr>
            <th><titre2>TOTAL</titre2></th>
            <th>{totals.totalData[0] > 0 ? "+"+totals.totalData[0] : totals.totalData[0] }</th>
            <th>{totals.totalData[1] > 0 ? "+"+totals.totalData[1] : totals.totalData[1] }</th>
            <th>{totals.totalData[2] > 0 ? "+"+totals.totalData[2] : totals.totalData[2] }</th>
            <th>{totals.totalData[3] > 0 ? "+"+totals.totalData[3] : totals.totalData[3] }</th>
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
                contrat: '',
                score1: '',
                score2: '',
                score3: '',
                score4: '',
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
        console.log('O5 - SCORESHEET - componentDidMount()');

        this.handleHeader();
        this.handleBody();
        this.handleTotal();
    }

    handleHeader = () => {
        this.setState({ names: [...this.props.names]})
    };

    handleBody = () => {
        this.setState({ scores: [this.props.scores]})
    };

    handleTotal = () => {
        this.setState({ totals: [...this.props.totals] })
    };

    render() {

        console.log('O5 - SCORESHEET - PROPS.SCORES : ', this.props.scores);
        console.log('O5 - SCORESHEET - PROPS.TOTALS : ', this.props.totals);

        const { names } = this.state;
        // const { scores } = this.props;
        // const { totals } = this.state;

        return(

            <table>
                <TableHeader nameData={names} />
                <TableBody scoreData={this.props.scores}/>
                <TableFooter totalData={this.props.totals} />
                <br></br>
            </table>


        )
    }
}

export default ScoreSheet;