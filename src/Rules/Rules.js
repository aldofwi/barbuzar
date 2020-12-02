import React, { Component } from 'react';
import Emoji from '../Tools/Emoji';

const Intro = () => {

    return(

        <React.Fragment>

                <span className="tit1" align="center"><h1>Les Règles du Barbu</h1></span>
                
                <span align="center" className="textrules"><dd>
                Chacun des 4 joueurs doit effectuer <b>7 contrats</b>.<br></br>
                Celui qui démarre est désigné par le tirage au sort.<br></br>
                La carte la plus forte commence à faire ses contrats.<br></br>
                Celui qui effectue ses contrats apparaît en <span className="crr">ROUGE</span>.<br></br>
                </dd></span><br></br>
                
        </React.Fragment>

    )

};

const Seven = () => {

    return(
        <table>
        <tbody>
        <tr>
            <React.Fragment>

            <th>
                <span className="tit4"><h5>DERNIER PLI <Emoji symbol="🎖" label="medal"/></h5></span>
                <span className="textrules">
                Celui qui récupère le <b>DERNIER PLI</b> perd <b><span className="crr">25 points</span></b>.<br></br><br></br>
                </span>

                <span className="tit4"><h5>PLIS <Emoji symbol="🀄️" label="cardx"/></h5></span>
                <span className="textrules">
                Vous perdrez <b><span className="crr">5 points</span></b> pour chaque pli récupéré.<br></br>
                Celui qui récupère <b>TOUS LES PLIS</b> gagne <b><span className="cg">+40 points</span></b>.<br></br><br></br>
                </span>

                <span className="tit4"><h5>COEURS <Emoji symbol="♥️" label="heart"/></h5></span>
                <span className="textrules">
                Vous perdrez <b><span className="crr">5 points</span></b> pour chaque <Emoji symbol="♥️" label="heart"/> contenu dans vos plis.<br></br>
                Celui qui récupère <b>TOUS LES COEURS</b> gagne <b><span className="cg">+40 points</span></b>.<br></br><br></br>
                </span>

                <span className="tit4"><h5>DAMES <Emoji symbol="👸🏽" label="queen"/></h5></span>

                <span className="textrules">
                Vous perdrez <b><span className="crr">10 points</span></b> par dame contenue dans vos plis.<br></br>
                Celui qui récupère <b>TOUTES LES DAMES</b> gagne <b><span className="cg">+40 points</span></b>.<br></br><br></br>
                </span>
                
            </th>

            <th>

                <span className="tit4"><h5>BARBU <Emoji symbol="🎅🏾" label="santa"/></h5></span>
                <span className="textrules">Celui qui récupère le Barbu (<b>Roi de <Emoji symbol="♥️" label="heart"/></b>) perd <b><span className="crr">40 points</span></b>.<br></br><br></br></span>
                
                <span className="tit4"><h5>DOMINO <Emoji symbol="🎲" label="dice"/></h5></span>
                <span className="textrules">

                C'est le même principe que le jeu du Domino classic.<br></br>
                On commence <b>OBLIGATOIREMENT</b> par un <b>Valet</b>.<br></br>
                Il va falloir poser les cartes <b>dans l'ordre de leur valeur</b>.<br></br>
                <i>Exemple</i> : (A.R.D.<span className="cb">V</span>.10.9.8.7)<br></br>
                Celui qui n'a plus de cartes en main gagne le Domino.<br></br>
                <b>1er : <span className="cg">+50 points</span> | 2e : <span className="cg">+25 points</span> | 3e : 0 | 4e : <span className="crr">-25 points</span></b><br></br><br></br>
                
                </span>
                
                <span className="tit4"><h5>RATA <Emoji symbol="🔥" label="fire"/></h5></span>
                <span className="textrules">

                La RATA rassemble <b>TOUS LES CONTRATS</b> sauf le Domino.<br></br>
                Celui qui récupère <b>TOUS LES PLIS</b> de la RATA<br></br>
                gagne <b><span className="cg">+185 points</span></b>.<br></br><br></br>
                </span>

            </th>
                
            </React.Fragment>
        </tr>
        </tbody>
        </table>

    )

};

const Outro = () => {

    return(

            <React.Fragment>

                <span align="center" className="textrules">
                
                    <dd>Au bout des <b>28 contrats</b>, le score <b>le plus élevé</b> gagne la partie!</dd>
                
                </span>
                
            </React.Fragment>

    )

};

class Rules extends Component {

    render() {

        return(

            <React.Fragment>
                <Intro />
                <Seven />
                <Outro /> 
            </React.Fragment>
            
        )

    }

}

export default Rules;