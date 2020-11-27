import React, { Component } from  'react';

const TableData = data => {

    const rows = data.dataInfos.map((row, index) => {

        return (

            <tr key={index}>

            <th><strong>{row.name} :</strong> {row.nbVictory} Victoires</th>
            
                <div className="progress">
                    <div 
                        className="progress-bar progress-bar-striped progress-bar-animated" 
                        role="progressbar"
                        style={{width: row.nbVictory+"%", align: 'left'}}
                        aria-valuenow={row.nbVictory}
                        aria-valuemin="0"
                        aria-valuemax="100"></div>
                </div>

            </tr>
        )

    });

    return (

        <tbody>
            {rows}
        </tbody>
    )

};

class Info extends Component {

    render() {

        console.log('08 - INFO - this.props.infos : ', this.props.infos);

        return(

            <table>
            <span align="right" className="tit4"><h5>Historique</h5></span>

                <TableData dataInfos={this.props.infos} />
            </table>

        );

    }

}

export default Info;