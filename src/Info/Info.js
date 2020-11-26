import React, { Component } from  'react';

const TableData = data => {

    const rows = data.dataInfos.map((row, index) => {

        return (

            <tr key={index}>
                
                <th> {row.name} : </th>
                <td> {row.nbVictory} </td>

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

        return(

            <table>
                <TableData dataInfos={this.props.infos} />
            </table>

        );

    }

}

export default Info;