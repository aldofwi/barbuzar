import React, { Component } from  'react';

const TitleInfos = () => {

    return(

        <thead>
            <tr>
                <React.Fragment>
                    <th><span align="center" className="tit3"><h5>Historique</h5><br></br></span></th>
                </React.Fragment>
            </tr>
        </thead>
    )

};


const TableData = data => {

    // style={{width: row.nbVictory+"%"}}

    const rows = data.dataInfos.map((row, index) => {

        return (

            <tr key={index}>

                <th>
                    <strong> {row.name} : 
                        <span className="cb"> {row.nbVictory} </span>
                    </strong> 
                    Victoires
                </th>
                <th>
                <div className="progress">
                    <div 
                        className="progress-bar progress-bar-striped progress-bar-animated" 
                        role="progressbar"
                        style={{width: row.nbVictory+"%"}}
                        aria-valuenow={row.nbVictory}
                        aria-valuemin="0"
                        aria-valuemax="100"></div>
                </div>
                </th>
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
        console.log('08 °°° INFO --- this.props.infos : ', this.props.infos);

        return(

            <table>
                <TitleInfos />
                <TableData dataInfos={this.props.infos} />
            </table>

        );
    }
}

export default Info;