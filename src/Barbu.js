import React, { Component } from 'react';

import Modal from "react-modal";
import SocketIO from "socket.io-client";

import './PlayingCard/Table/Table.css';
import "bootstrap/dist/css/bootstrap.css";
import gitLogo from "./Pictures/gitLogo.png";

import Chat from "./Chat/Chat";
import Arrow from "./Tools/Arrow";
import Loading from "./Tools/Loading";
import Deck from './PlayingCard/Deck';
// import Contractor from "./Tools/Contractor";
import Board from "./PlayingCard/Board";
import PanelChoice from "./Panel/PanelChoice";
import PanelDisplay from "./Panel/PanelDisplay";
import ScoreSheet from "./Score/ScoreSheet";
import HandBarbu from "./PlayingCard/Hand/HandBarbu";
import BoardDomino from "./PlayingCard/BoardDomino";
import PanelVictory from './Panel/PanelVictory';

const { Map } = require('immutable');

const customStylesR = {
    content : {
        top                   : '30%',
        left                  : '38%',
        bottom                : '-25%',
        right                 : 'auto',
        marginRight           : '-50%',
        overflow              : 'scroll',
        transform             : 'translate(-50%, -30%)'
    }
};

const customStylesS = {
    content : {
        top                   : '5%',
        left                  : '38%',
        bottom                : 'auto',
        right                 : 'auto',
        marginRight           : '-50%',
        overflow              : 'scroll',
        transform             : 'translate(-50%, -10%)'
    }
};

// TODO : CANNOT READ PROPS

const Rules = () => {

    return(

        <div>

            <h1 align="center"> <tit1>Les Règles du Barbu</tit1> </h1>

                <table>Chaque joueur doit effectuer <b>7 contrats</b>.</table>
                <table>Celui qui démarre est désigné par le tirage au sort.</table>
                <table>La carte la plus forte commence à faire ses contrats.</table>
                <table>Celui qui effectue ses contrats apparaît en <b><crr>ROUGE</crr></b>.</table>

            <br></br>

        <div className="rules">

            <tr><b><contrat>DERNIER PLI</contrat></b></tr>
            <tr>Celui qui récupère le <b>DERNIER PLI</b> perd <b><cr>25 points</cr></b>.</tr>
            <br></br>

            <tr><b><contrat>PLIS</contrat></b></tr>
            <tr>Vous perdrez <b><cr>5 points</cr></b> pour chaque pli récupéré.</tr>
            <tr>Celui qui récupère <b>TOUS LES PLIS</b> gagne <b><cg>+40 points</cg></b>.</tr>
            <br></br>

            <tr><b><contrat>COEURS</contrat></b></tr>
            <tr>Vous perdrez <b><cr>5 points</cr></b> pour chaque ♥ contenu dans vos plis.</tr>
            <tr>Celui qui récupère <b>TOUS LES COEURS</b> gagne <b><cg>+40 points</cg></b>.</tr>
            <br></br>

            <tr><b><contrat>DAMES</contrat></b></tr>
            <tr>Vous perdrez <b><cr>10 points</cr></b> par dame contenue dans vos plis.</tr>
            <tr>Celui qui récupère <b>TOUTES LES DAMES</b> gagne <b><cg>+40 points</cg></b>.</tr>
            <br></br>

        </div>

        <div className="rules">

            <tr><b><contrat>BARBU</contrat></b></tr>
            <tr>Celui qui récupère le Barbu (<b>Roi de ♥</b>) perd <b><cr>40 points</cr></b>.</tr>
            <br></br>

            <tr><b><contrat>DOMINO</contrat></b></tr>
            <tr>C'est le même principe que le jeu du Domino classic.</tr>
            <tr>On commence <b>OBLIGATOIREMENT</b> par un <b>Valet</b>.</tr>
            <tr>Il va falloir poser les cartes <b>dans l'ordre de leur valeur</b>.</tr>
            <tr><span className="marge"><i>Exemple</i> : (A.R.D.<b><cb>V</cb></b>.10.9.8.7)</span></tr>
            <tr>Celui qui n'a plus de cartes en main gagne le Domino.</tr>
            <tr><b>1er : <cg>+50 points</cg> | 2e : <cg>+25 points</cg> | 3e : 0 | 4e : <cr>-25 points</cr></b></tr>
            <br></br>

            <tr><b><contrat>RATA</contrat></b></tr>
            <tr>La RATA rassemble <b>TOUS LES CONTRATS</b> sauf le Domino.</tr>
            <tr>Celui qui récupère <b>TOUS LES PLIS</b> de la RATA</tr>
            <tr>gagne <b><cg>+185 points</cg></b>.</tr>
            <br></br>

        </div>

        <table>Au bout des <b>28 contrats</b>, le score <b>le plus élevé</b> gagne la partie !</table>

            <br></br>

        </div>
    )
};


class Barbu extends Component {

    constructor(props) {
        super(props);

        this.players = {};
        this.deck = new Deck();
        this.deck.shuffle();

        this.gameStarted = 0;
        this.partyIsOver = false;
        this.playersName = ["P1","P2","P3","P4"];

        // POSITION
        this.flipped = "";
        this.flopped = "";
        this.ranks = [];
        this.ranking = [];
        this.rankPosition = [];
        this.positionPicked = false;
        this.boardPosition = true;
        this.myPosition = 0;

        this.boardHand = [];
        this.tempoPli = [];
        this.layoutBoard = ["star", "domino"];
        this.nbClic = 0;

        // GAMEPLAY
        this.cardStarted = "Cx";
        this.hasStarted = "Px";
        this.hasClicked = "Px";
        this.isMaster = "Px";
        this.isHigher = "Px";
        this.inProgress = false;
        this.arrow = "";

        this.cardN = ""; this.cardS = "";
        this.cardE = ""; this.cardW = "";

        this.heartsDone = false;
        this.queensDone = false;

        // DOMINO
        this.ranksDomino = [];
        this.hasToPlayDomino = "Px";
        this.boardDominoVisible = false;
        this.northBoude = this.southBoude = false ;
        this.eastBoude = this.westBoude = false ;
        this.handSpides = []; this.handHearts = [];
        this.handClubs = []; this.handDiamonds = [];

        // POINTS
        this.pointsN = 0; this.pointsS = 0;
        this.pointsE = 0; this.pointsW = 0;

        this.allPoints = [
            this.pointsN, this.pointsS,
            this.pointsE, this.pointsW];

        this.gamePointsN = 0; this.gamePointsS = 0;
        this.gamePointsE = 0; this.gamePointsW = 0;

        this.gamePoints = [
            this.gamePointsN, this.gamePointsS,
            this.gamePointsE, this.gamePointsW];

        // CONTRACTS
        // this.contractsN = ["RATA", "Domino", "Coeur", "Dames", "Pli", "Dernier Pli"]; this.contractsS = ["RATA", "Domino", "Coeur", "Dames", "Pli", "Dernier Pli"];
        // this.contractsE = ["RATA", "Domino", "Coeur", "Dames", "Pli", "Dernier Pli"]; this.contractsW = ["RATA", "Domino", "Coeur", "Dames", "Pli", "Dernier Pli"];
        this.contractsN = []; this.contractsS = [];
        this.contractsE = []; this.contractsW = [];

        this.allContracts = [
            this.contractsN, this.contractsS,
            this.contractsE, this.contractsW];

        this.plisN = []; this.plisS = [];
        this.plisE = []; this.plisW = [];

        this.contractor = "Px";
        this.display = "Position";
        this.winner = "Tartenpion";
        this.currentChoice = "";
        this.currentScore = [];

        this.nbContracts = 0 ; // DUR - this.nbContracts = 6;
        this.lastContract = false;
        this.displayLoadingBasic = false;
        this.displayLoadingPosition = true;
        this.displayLoadingPlayers = true;

        this.panelVisible = true;
        this.hidePlayersCards = true;

        this.orderValue = ["7", "8", "9", "t", "j", "q", "k", "1"];
        this.gameContracts = ["Barbu", "RATA", "Domino", "Coeur", "Dames", "Pli", "Dernier Pli"];

        this.cardSize = this.props.cardSize;
        this.websocket = this.props.websocket;

        this.state = {
            modalSCIsOpen: false,
            modalRIsOpen: false,

            nbPeopleConnected: 0,

            contractor : this.contractor,
            positionPicked : this.positionPicked,
            panelVisible : this.panelVisible,
            hidePlayersCards : this.hidePlayersCards,

            contractsN: this.contractsN,
            contractsS: this.contractsS,
            contractsE: this.contractsE,
            contractsW: this.contractsW,

            handN : this.deck.deal(8),
            handS : this.deck.deal(8),
            handE : this.deck.deal(8),
            handW : this.deck.deal(8),

            cardBoardN : this.cardN,
            cardBoardS : this.cardS,
            cardBoardE : this.cardE,
            cardBoardW : this.cardW,

            loadCards : Map({
                handId : "loadCards",
                hide : false,
                hand : this.boardHand,
                contract : this.currentChoice,
                layout : this.layoutBoard
            }),

            loadDominoCards : Map({
                handId      : "loadDominoCards",
                handSpides  : this.handSpides,
                handHearts  : this.handHearts,
                handClubs   : this.handClubs,
                handDiamonds: this.handDiamonds
            }),

            loadPositionCards : Map({
                handId  : "loadPositionCards",
            })
        };

        this.fullHandN = [...this.state.handN];
        this.fullHandS = [...this.state.handS];
        this.fullHandE = [...this.state.handE];
        this.fullHandW = [...this.state.handW];

        this.styles = {
            eightHand: function () {
                return {
                    handE : {
                        'bottom': '-80%',
                        'east': '0',
                        'right': '-65%',
                        'position': 'absolute',
                        // FULLSCREEN 'transform' : 'translateY(-80%) translateX(-80%) rotate(90deg)',
                        'transform' : 'translateY(10%) translateX(-80%) rotate(90deg)',
                        'transformOrigin' : ' 0px -' + window.innerWidth / 2 + 'px'
                    },
                    handW : {
                        'bottom': '-80%',
                        'right': '23%',
                        'position': 'absolute',
                        // FULLSCR33N 'transform' : 'translateY(-110%) translateX(80%) rotate(90deg)',
                        'transform' : 'translateY(10%) translateX(80%) rotate(90deg)',
                        'transformOrigin' : ' 0px -' + window.innerWidth / 2 + 'px'
                    },
                    handN: {
                        'height' : '20%',
                        'top': '-1%',
                        'right': '50%',
                        'position': 'absolute',
                        'transform' : 'translateY(-30%) translateX(-80%) rotate(180deg)'
                    },
                    handS: {
                        'height' : '30%',
                        'bottom': '-2%',
                        'right': '50%',
                        'position': 'absolute',
                        'transform' : 'translateY(30%) translateX(-80%) rotate(0deg)'
                    },
                    board: {
                        'middle': 'calc(100% - ' + props.cardSize * 2 + 'px)',
                        'top': '65%', // FULL SCREEN
                        'left': '70%', // FULL SCREEN
                        // 'top': '70%', // SPLIT SCREEN //
                        // 'right': '-30%', // SPLIT SCREEN //
                        'position': 'absolute',
                        'width': props.cardSize * 4 + 'px'
                    },
                    boardDomino: {
                        'top': '50%',
                        'right': '15%',
                        'position': 'absolute',
                        'width': props.cardSize * 4 + 'px'
                    },
                    // OLD POSITION
                    boardPosition: {
                        'top': '50%',
                        'right': '80%',
                        'position': 'absolute',
                        'width': props.cardSize * 4 + 'px'
                    },
                    // POSITION
                    hand1: {
                        'position'  : 'absolute',
                        'width'     : props.cardSize + 'px',
                        'transform' : 'translateY(-60%) translateX(-50%) rotate(180deg)'
                    },
                    hand2: {
                        'position': 'absolute',
                        'width'     : props.cardSize + 'px',
                        'transform': 'translateY(-120%) translateX(-50%) rotate(180deg)'
                    },
                    hand3: {
                        'position': 'absolute',
                        'width'     : props.cardSize + 'px',
                        'transform': 'translateY(60%) translateX(-50%) rotate(180deg)'
                    },
                    hand4: {
                        'position': 'absolute',
                        'width'     : props.cardSize + 'px',
                        'transform': 'translateY(0%) translateX(-50%) rotate(180deg)'
                    }
                }
            }
        };
    }

    componentDidMount() {
        console.log('O1 - BARBU - componentDidMount()');

        this.check();
    }

    setModalSCIsOpen = (value) => {
        this.setState({ modalSCIsOpen: value });
    };

    setModalRIsOpen = (value) => {
        this.setState({ modalRIsOpen: value });
    };

    whichArrow = () => {
        // console.log('O1 - BARBU - whichArrow() - this.currentChoice : ', this.currentChoice);
        // console.log('O1 - BARBU - whichArrow() - this.hasToPlayDomino : ', this.hasToPlayDomino);

        if(this.currentChoice === "Domino") {

            switch(this.hasToPlayDomino) {

                case "NORTH" : this.arrow = "App-arrow-north" ; break;
                case "SOUTH" : this.arrow = "App-arrow-south" ; break;
                case "EAST"  : this.arrow = "App-arrow-east" ; break;
                case "WEST"  : this.arrow = "App-arrow-west" ; break;

                default: break;

            }

        }
        else if ((this.boardHand.length === 0) || (this.boardHand.length === 4)) {

            switch (this.isMaster) {
                case "NORTH" : this.arrow = "App-arrow-north" ; break;
                case "SOUTH" : this.arrow = "App-arrow-south" ; break;
                case "EAST"  : this.arrow = "App-arrow-east" ; break;
                case "WEST"  : this.arrow = "App-arrow-west" ; break;

                default: break;
            }
        }
        else if (this.boardHand.length === 1) {

            switch (this.hasStarted) {
                case "NORTH" : this.arrow = "App-arrow-east" ; break;
                case "SOUTH" : this.arrow = "App-arrow-west" ; break;
                case "EAST"  : this.arrow = "App-arrow-south" ; break;
                case "WEST"  : this.arrow = "App-arrow-north" ; break;

                default: break;
            }
        }
        else if (this.boardHand.length === 2) {

            switch (this.hasStarted) {
                case "NORTH" : this.arrow = "App-arrow-south" ; break;
                case "SOUTH" : this.arrow = "App-arrow-north" ; break;
                case "EAST"  : this.arrow = "App-arrow-west" ; break;
                case "WEST"  : this.arrow = "App-arrow-east" ; break;

                default: break;
            }
        }
        else if (this.boardHand.length === 3) {

            switch (this.hasStarted) {
                case "NORTH" : this.arrow = "App-arrow-west" ; break;
                case "SOUTH" : this.arrow = "App-arrow-east" ; break;
                case "EAST"  : this.arrow = "App-arrow-north" ; break;
                case "WEST"  : this.arrow = "App-arrow-south" ; break;

                default: break;
            }
        }

        // console.log('O1 - BARBU - whichArrow() - this.arrow : ', this.arrow);

    };

    setPosition(cle) {

        if (!this.state.positionPicked) {

            // REMPLIR LE BOARD.
            this.flipCardPosition(cle);

            // DECREMENTER LA MAIN SANS RETIRER LA CARTE.
            // this.removeOneCard(index, cle);

            if (this.tempoPli.length === 4) {

                // Checker la hauteur des cartes.
                this.sortPlayersPosition();

                // Définir la position du joueur client.
                this.myPosition = this.getPosition(this.props.barbuser.name);

                this.startGame();

                this.displayLoadingBasic = true;
                this.boardPosition = false;

                this.clearPosition();
                this.cleanBoardEnd();

                this.contractor = this.isMaster;
                this.playersName = [this.getNamePosition(0), this.getNamePosition(1), this.getNamePosition(2), this.getNamePosition(3)];

                console.log('O1 - BARBU - setPosition() - ', this.getNamePosition(0), ' COMMENCE LA PARTIE !');
                console.log('O1 - BARBU - setPosition() - ', this.getNamePosition(1), ' ENCHAINERA EN 2ND !');
                console.log('O1 - BARBU - setPosition() - ', this.getNamePosition(2), ' JOUERA EN 3E !');
                console.log('O1 - BARBU - setPosition() - ', this.getNamePosition(3), ' FERME LA MARCHE !');

                console.log('01 - BARBU - setPosition() - Je joue en ', this.myPosition, 'e.');
                console.log('01 - BARBU - setPosition() - CONTRACTOR = ', this.getNameByCardinal(this.contractor));

                this.setState({ positionPicked: true });
            }
        }
    }

    getCardName(name){
        console.log('01 - BARBU - getCardName()');

        switch(name) {

            case "7h": return "7 de ♥️"; 
            case "7c": return "7 de ♣️"; 
            case "7d": return "7 de ♦️"; 
            case "7s": return "7 de ♠️"; 

            case "8h": return "8 de ♥️"; 
            case "8c": return "8 de ♣️"; 
            case "8d": return "8 de ♦️"; 
            case "8s": return "8 de ♠️"; 

            case "9h": return "9 de ♥️"; 
            case "9c": return "9 de ♣️"; 
            case "9d": return "9 de ♦️"; 
            case "9s": return "9 de ♠️";

            case "th": return "10 de ♥️"; 
            case "tc": return "10 de ♣️"; 
            case "td": return "10 de ♦️"; 
            case "ts": return "10 de ♠️";

            case "jh": return "valet de ♥️"; 
            case "jc": return "valet de ♣️"; 
            case "jd": return "valet de ♦️"; 
            case "js": return "valet de ♠️";

            case "qh": return "dame de ♥️"; 
            case "qc": return "dame de ♣️"; 
            case "qd": return "dame de ♦️"; 
            case "qs": return "dame de ♠️";

            case "kh": return "roi de ♥️"; 
            case "kc": return "roi de ♣️"; 
            case "kd": return "roi de ♦️"; 
            case "ks": return "roi de ♠️";

            case "1h": return "as de ♥️"; 
            case "1c": return "as de ♣️"; 
            case "1d": return "as de ♦️"; 
            case "1s": return "as de ♠️";

            default: break;
        }
    };

    getBadgeConnected(num) {
        console.log('01 - BARBU - getBadgeConnected() - State nb people connected = '+num);
        console.log('01 - BARBU - getBadgeConnected() - displayLoadingPlayers is '+this.displayLoadingPlayers);

        switch(num) {

            case 1: return "1️⃣"; 
            case 2: return "2️⃣"; 
            case 3: return "3️⃣";
            case 4: return "4️⃣";

            default: return "💬" ;
        }

    }

    getBadgeCC(choice) {
        console.log('01 - BARBU - getBadgeCC() - check during choice');

        switch(choice) {

            case "RATA": return "R"; 
            case "Barbu": return "B"; 
            case "Domino": return "D"; 
            case "Coeur": return "♥️";
            case "Dames": return "Q";
            case "Pli": return "P";
            case "Dernier Pli": return "DP";

            default: if(!this.inProgress) return "💬" ;
        }

    }

    getCardinal(name) {
        console.log('01 - BARBU - getCardinal()');

        switch(this.myPosition) {

            case 1 :
                switch(this.getPosition(name)) {
                    case 1 : return "SOUTH";
                    case 2 : return "WEST";
                    case 3 : return "NORTH";
                    case 4 : return "EAST";
                    default: break;
                } break;

            case 2 :
                switch(this.getPosition(name)) {
                    case 1 : return "EAST";
                    case 2 : return "SOUTH";
                    case 3 : return "WEST";
                    case 4 : return "NORTH";
                    default: break;
                } break;

            case 3 :
                switch(this.getPosition(name)) {
                    case 1 : return "NORTH";
                    case 2 : return "EAST";
                    case 3 : return "SOUTH";
                    case 4 : return "WEST";
                    default: break;
                } break;

            case 4 :
                switch(this.getPosition(name)) {
                    case 1 : return "WEST";
                    case 2 : return "NORTH";
                    case 3 : return "EAST";
                    case 4 : return "SOUTH";
                    default: break;
                } break;

            default: break;
        }
    };

    getCardinalByPos(num) {
        console.log('01 - BARBU - getCardinalByPos()');

        switch(this.myPosition) {

            case 1 :
                switch(num) {
                    case 1 : return "SOUTH";
                    case 2 : return "WEST";
                    case 3 : return "NORTH";
                    case 4 : return "EAST";
                    default: break;
                } break;

            case 2 :
                switch(num) {
                    case 1 : return "EAST";
                    case 2 : return "SOUTH";
                    case 3 : return "WEST";
                    case 4 : return "NORTH";
                    default: break;
                } break;

            case 3 :
                switch(num) {
                    case 1 : return "NORTH";
                    case 2 : return "EAST";
                    case 3 : return "SOUTH";
                    case 4 : return "WEST";
                    default: break;
                } break;

            case 4 :
                switch(num) {
                    case 1 : return "WEST";
                    case 2 : return "NORTH";
                    case 3 : return "EAST";
                    case 4 : return "SOUTH";
                    default: break;
                } break;

            default: break;
        }

    };

    getPosition(name) {
        console.log('01 - BARBU - getPosition()');

        if(this.ranks.length === 4){

            for(let t=0; t<this.ranks.length; t++) {

                if(this.ranking[t].name === name) {
                    return t+1;
                }
            }
        } else { console.log('01 - BARBU - getPosition() - ranks.length !== 4'); }

    };

    getNameByCardinal(nsew) {
        // console.log('01 - BARBU - getNamePosition()');

        switch(this.myPosition) {

            case 1 :
                switch(nsew) {
                    case "SOUTH" : return this.getNamePosition(0);
                    case "WEST"  : return this.getNamePosition(1);
                    case "NORTH" : return this.getNamePosition(2);
                    case "EAST"  : return this.getNamePosition(3);
                    default: break;
                } break;

            case 2 :
                switch(nsew) {
                    case "EAST"  : return this.getNamePosition(0);
                    case "SOUTH" : return this.getNamePosition(1);
                    case "WEST"  : return this.getNamePosition(2);
                    case "NORTH" : return this.getNamePosition(3);
                    default: break;
                } break;

            case 3 :
                switch(nsew) {
                    case "NORTH" : return this.getNamePosition(0);
                    case "EAST"  : return this.getNamePosition(1);
                    case "SOUTH" : return this.getNamePosition(2);
                    case "WEST"  : return this.getNamePosition(3);
                    default: break;
                } break;

            case 4 :
                switch(nsew) {
                    case "WEST"  : return this.getNamePosition(0);
                    case "NORTH" : return this.getNamePosition(1);
                    case "EAST"  : return this.getNamePosition(2);
                    case "SOUTH" : return this.getNamePosition(3);
                    default: break;
                } break;

            default: break;
        }

    }

    getNamePosition(num) {
        // console.log('01 - BARBU - getNamePosition() - this.ranks[num].name : ', this.ranks[num].name);

        if(this.ranks.length === 4){

            for(let t=0; t<this.ranks.length; t++) {

                if(this.rankPosition[num] === this.ranks[t].key) {
                    return this.ranks[t].name;
                }
            }
        } else { console.log('01 - BARBU - getNamePosition() - ranks.length !== 4'); }
    };

    checkNameInRanks(name) {
        console.log('O1 - BARBU - checkNameInRanks() - this.ranks.length : ', this.ranks.length);

        if (this.ranks.length === 0) return false;

        else if (this.ranks.length === 1) {
            return this.ranks[0].name === name;
        }

        else if (this.ranks.length === 2) {

            return this.ranks[0].name === name
                || this.ranks[1].name === name;
        }

        else if (this.ranks.length === 3) {

            return this.ranks[0].name === name
                || this.ranks[1].name === name
                || this.ranks[2].name === name;
        }

        else if (this.ranks.length === 4) {

            return this.ranks[0].name === name
                || this.ranks[1].name === name
                || this.ranks[2].name === name
                || this.ranks[3].name === name;
        }

    }

     /**
     * @function sendHands
     * This function establishes the connect with the websocket
     * and informs the server about other payers hands.
     */
    sendHands() {
        console.log('O1 - BARBU - sendHands()');

        // WEBSOCKET DEFINITION
        let barbuWS = SocketIO("http://localhost:"+this.props.port, { transports: ["websocket"] });
        
        let cardinalFirst = this.getCardinalByPos(1);

        let deck = {};

        console.log('O1 - BARBU - sendHands() | positionFirst : ', cardinalFirst);

        switch(cardinalFirst) {

            case "NORTH" :
                deck = {
                    hand1 : this.state.handN,
                    hand2 : this.state.handE,
                    hand3 : this.state.handS,
                    hand4 : this.state.handW,
                }; break;
            case "SOUTH" :
                deck = {
                    hand1 : this.state.handS,
                    hand2 : this.state.handW,
                    hand3 : this.state.handN,
                    hand4 : this.state.handE,
                }; break;
            case "EAST" :
                deck = {
                    hand1 : this.state.handE,
                    hand2 : this.state.handS,
                    hand3 : this.state.handW,
                    hand4 : this.state.handN,
                }; break;
            case "WEST" :
                deck = {
                    hand1 : this.state.handW,
                    hand2 : this.state.handN,
                    hand3 : this.state.handE,
                    hand4 : this.state.handS,
                }; break;
            default: break;
        }

        // WEBSOCKET TO SERVER
        barbuWS.emit("deck", deck);

        console.log('O1 - BARBU - sendHands() | deck : ', deck);
    };

    /**
     * @function click
     * This function establishes the connect with the websocket
     * and informs the server about the value & the clicker.
     */
    click = (cle) => {
        console.log('O1 - BARBU - click()');

        // WEBSOCKET DEFINITION
        let barbuWS = SocketIO("http://localhost:"+this.props.port, { transports: ["websocket"] });
        // let barbuWS = this.websocket;

        let valeur = {
            key  : cle,
            name : this.props.barbuser.name,
        };

        if(!this.state.positionPicked) this.ranks.push(valeur);

        // WEBSOCKET TO SERVER
        barbuWS.emit("click", valeur);

    };

    /**
     * @function check
     * This function checks events happening on the server.
     */
    check = () => {

        // WEBSOCKET DEFINITION
        let barbuWS = SocketIO("http://localhost:"+this.props.port, { transports: ["websocket"] });
        // let barbuWS = this.props.websocket;


        // WEBSOCKET ON USERS EVENT LISTENER
        barbuWS.on("users", users => {
            this.players = users;
            this.setState({nbPeopleConnected: users.length}) ;

            if( users.length > 3) {
                // Ne plus afficher le Loader Players.
                this.displayLoadingPlayers = false;

                console.log('01 - BARBU - check() - USERS : ', users);
            }

            this.setState(this.state);            
        });

        // WEBSOCKET ON CLICK EVENT LISTENER
        barbuWS.on("onclick", value => {
            console.log('01 - BARBU - check() - onClick() - ', value);

            if(!this.state.positionPicked) {
                // Message Général délivré par JARVIS.
                this.barbuWS.emit("sendtxt", [value.name+" a retourné : "+this.getCardName(value.key), "J@rvis"]);
            }
        
            // Si on tire les positions, Retourne les cartes des autres joueurs.
            if(!this.state.positionPicked && value.name !== this.props.barbuser.name) {

                this.ranks.push(value);
                this.setPosition(value.key);

            }
            else if(this.state.positionPicked && value.name !== this.props.barbuser.name) {

                // WEBSOCKET ON NEW CHOICE EVENT LISTENER
                if(this.myPosition !== this.gameStarted && this.gameContracts.indexOf(value.key)>-1) {
                    this.displayLoadingBasic = false;
                    this.onClickBoard(value.key);
                    console.log('01 - BARBU - check() "onclick" - contract : ', value);
                }
                else if(this.gameContracts.indexOf(value.key) === -1) {
                    // CONDITION CLICK ON CARD, NOT ON CONTRACT
                    this.displayLoadingBasic = false;
                    this.onClickHand(value.key);
                    this.setState(this.state);
                    console.log('01 - BARBU - check() "onclick" - card : ', value);
                }
            }
        });

        // WEBSOCKET ON NEW HANDS EVENT LISTENER
        barbuWS.on("newdeck", nudeck => {

            if(this.myPosition !== this.gameStarted && nudeck.hand3.length === 8) {

                switch(this.myPosition) {

                    case 1 :
                        this.setState({
                            handS: nudeck.hand1,
                            handW: nudeck.hand2,
                            handN: nudeck.hand3,
                            handE: nudeck.hand4,
                        }); break;

                    case 2 :
                        this.setState({
                            handE: nudeck.hand1,
                            handS: nudeck.hand2,
                            handW: nudeck.hand3,
                            handN: nudeck.hand4,
                        }); break;

                    case 3 :
                        this.setState({
                            handN: nudeck.hand1,
                            handE: nudeck.hand2,
                            handS: nudeck.hand3,
                            handW: nudeck.hand4,
                        }); break;

                    case 4 :
                        this.setState({
                            handW: nudeck.hand1,
                            handN: nudeck.hand2,
                            handE: nudeck.hand3,
                            handS: nudeck.hand4,
                        }); break;

                    default: break;
                }

            }

            this.fullHandN = [...this.state.handN];
            this.fullHandS = [...this.state.handS];
            this.fullHandE = [...this.state.handE];
            this.fullHandW = [...this.state.handW];

            // console.log('01 - BARBU - check() - fullHandS : ', this.fullHandS);
            // console.log('01 - BARBU - check() - NU DECK : ', nudeck);
        });

    };

    startGame() {

        this.gameStarted = 1;

        console.log('01 - BARBU - startGame() | this.myPosition', this.myPosition);
        console.log('01 - BARBU - startGame() | this.gameStarted', this.gameStarted);

        console.log('01 - BARBU - startGame() | My Name = ', this.props.barbuser.name);
        console.log('01 - BARBU - startGame() | First to Play = ', this.ranking[0].name);

        this.contractor = this.isMaster;
        this.hasClicked = this.isMaster;

        this.hidePlayersCards = true;
        this.displayLoadingBasic = true;
        this.displayLoadingPosition = false;

        // TODO : GESTION DU JSON

        this.setState({ contractor: this.contractor });

        // IF IM CONTRACTOR, I SHUFFLE 1 DEAL NU DECK
        if(this.myPosition === this.gameStarted) {

            this.deck = new Deck();
            this.deck.shuffle();

            this.setState({

                handN : this.deck.deal(8),
                handS : this.deck.deal(8),
                handE : this.deck.deal(8),
                handW : this.deck.deal(8),
            });

            this.fullHandN = [...this.state.handN];
            this.fullHandS = [...this.state.handS];
            this.fullHandE = [...this.state.handE];
            this.fullHandW = [...this.state.handW];

            this.sendHands();
        }

        setTimeout(() => this.cleanBoardEnd(), 1500);

    };

    checkWhoClicked(index) {

        console.log('01 - BARBU - checkWhoClicked() - index : ', index);

        for (let i=0; i<index.length; i++) {

            if ( index[i] > -1 ) {

                switch (i) {

                    case 0 : this.hasClicked = "NORTH" ; break;
                    case 1 : this.hasClicked = "SOUTH" ; break;
                    case 2 : this.hasClicked = "EAST" ; break;
                    case 3 : this.hasClicked = "WEST" ; break;
                    default:
                        break;
                }
            }
        }
        console.log('01 - BARBU - checkWhoClicked() - this.hasClicked : ', this.hasClicked);
    }

    launchLoading() {
        console.log('O1 - BARBU - launchLoading()');

        this.displayLoadingBasic = (this.myPosition !== this.gameStarted) ;

        this.displayLoadingPosition = false;

        // IF IM CONTRACTOR, DISPLAY CHOICES.
        if (this.myPosition === this.gameStarted) {

            this.setState({
                panelVisible: true,
            });
        }
    }

    clearPosition() {

         for(let t=0; t<this.tempoPli.length; t++) {

              // console.log('O1 - BARBU - clearPosition(', this.tempoPli[t], ').');
              this.flipCardPosition(this.tempoPli[t]);
              this.setState(this.state);

          }

        this.tempoPli.pop();
        this.tempoPli.pop();
        this.tempoPli.pop();
        this.tempoPli.pop();


    };

    cleanBoardEnd() {
        //console.log('O1 - BARBU - cleanBoard()T.O : this.boardHand : ', this.boardHand);

        if (this.boardHand.length === 4) {

            this.boardHand.pop();
            this.boardHand.pop();
            this.boardHand.pop();
            this.boardHand.pop();

            this.tempoPli.pop();
            this.tempoPli.pop();
            this.tempoPli.pop();
            this.tempoPli.pop();

            this.cardN = "";
            this.cardS = "";
            this.cardE = "";
            this.cardW = "";
        }

        //this.displayLoadingBasic = true;

        this.isMaster = this.getCardinal(this.ranking[this.gameStarted-1].name);

        setTimeout(() => this.launchLoading(), 1500);

        console.log('O1 - BARBU - cleanBoard() || this.isMaster : ', this.isMaster);
        console.log('01 - BARBU - cleanBoard() || this.boardHand : ', this.boardHand);
        console.log('01 - BARBU - cleanBoard() || this.cardS : ', this.cardS);


    }

    calculateWinner() {
        console.log('O1 - BARBU - calculateWinner()');

        // let barbuWS = this.websocket;
        let barbuWS = SocketIO("http://localhost:"+this.props.port, { transports: ["websocket"] });

        let winner, winner2;
        let draw = false;
        
        // CHECK WINNER
        for (let h = 0; h < this.gamePoints.length - 1; h++) {

            if (this.gamePoints[h] > this.gamePoints[h + 1]) winner = h;
            else winner = h + 1;

        }

        // VERIFY DRAW
        for(let k=0; k < this.gamePoints.length; k++) {

            if(winner !== k && this.gamePoints[winner] === this.gamePoints[k]) {
                draw = true; winner2 = k;
            }
        }

        if(draw) {
            // Message Général délivré par JARVIS.
            barbuWS.emit("sendtxt", [this.getNamePosition(winner), ' & ', this.getNamePosition(winner2), ' REMPORTENT LA PARTIE !', "J@rvis"]);
            console.log('O1 - BARBU - calculateWinner() : DRAW | ', this.getNamePosition(winner), ' & ', this.getNamePosition(winner2), ' REMPORTENT LA PARTIE !!!');
            this.winner = this.getNamePosition(winner) + " & " + this.getNamePosition(winner2) ;

        } else {
            // Message Général délivré par JARVIS.
            barbuWS.emit("sendtxt", [this.getNamePosition(winner) + ' REMPORTE LA PARTIE !', "J@rvis"]);
            console.log('O1 - BARBU - calculateWinner() : ', this.getNamePosition(winner), ' REMPORTE LA PARTIE !!!');
            this.winner = this.getNamePosition(winner) ;
        }

        this.setState(this.state);
    }

    checkEndof28() {
        console.log('O1 - BARBU - checkEndof28()');

        // TODO : Afficher un panel END OF GAME dans PanelChoice.

        if(    this.gameStarted === 4 && this.lastContract
            && this.contractsS.length === 7 && this.contractsW.length === 7
            && this.contractsN.length === 7 && this.contractsE.length === 7) {

            console.log('O1 - BARBU - checkEndof28() : END OF GAME !');
            console.log('O1 - BARBU - checkEndof28() : joueur1 - ', this.getNamePosition(0), ' : ', this.gamePoints[0],' points.');
            console.log('O1 - BARBU - checkEndof28() : joueur2 - ', this.getNamePosition(1), ' : ', this.gamePoints[1],' points.');
            console.log('O1 - BARBU - checkEndof28() : joueur3 - ', this.getNamePosition(2), ' : ', this.gamePoints[2],' points.');
            console.log('O1 - BARBU - checkEndof28() : joueur4 - ', this.getNamePosition(3), ' : ', this.gamePoints[3],' points.');

            this.calculateWinner();

            this.partyIsOver = true;

            this.setState(this.state);
        }

    }

    checkEndof7(contractor) {

        console.log('O1 - BARBU - checkEndof7()');

        switch(contractor) {

            case "SOUTH"    : if(this.contractsS.length === 7 && this.gameStarted !== 4)
                                { this.contractor = this.isMaster = "WEST"; this.gameStarted++;
                                    console.log('O1 - BARBU - checkEndof7() : ', this.getNameByCardinal(this.isMaster), ' FAIT SES CONTRATS !');
                                } break;

            case "WEST"     : if(this.contractsW.length === 7 && this.gameStarted !== 4)
                                 { this.contractor = this.isMaster = "NORTH" ; this.gameStarted++;
                                     console.log('O1 - BARBU - checkEndof7() : ', this.getNameByCardinal(this.isMaster), ' FAIT SES CONTRATS !');
                                 } break;

            case "NORTH"    : if(this.contractsN.length === 7 && this.gameStarted !== 4)
                                { this.contractor = this.isMaster = "EAST"; this.gameStarted++;
                                    console.log('O1 - BARBU - checkEndof7() : ', this.getNameByCardinal(this.isMaster) ,' FAIT SES CONTRATS !');
                                } break;

            case "EAST"     : if(this.contractsE.length === 7 && this.gameStarted !== 4)
                                { this.contractor = this.isMaster = "SOUTH" ; this.gameStarted++;
                                    console.log('O1 - BARBU - checkEndof7() : ', this.getNameByCardinal(this.isMaster), ' FAIT SES CONTRATS !');
                                } break;

            default: break;
        }

    };

    checkEndOfContract = () => {

        if (this.nbClic === 32) {

            console.log('01 - BARBU - checkEndOfContract() ----- END OF ', this.currentChoice);

            this.inProgress = false;
            this.nbContracts++;

            this.checkEndof7(this.contractor);

            this.checkEndof28(this.contractor);

            this.nbClic = 0;

            this.plisS = [] ;
            this.plisW = [] ;
            this.plisN = [] ;
            this.plisE = [] ;

            if(this.currentChoice === "Domino") {
                this.boardDominoVisible = false;
            }

            this.displayLoadingBasic = true;
            this.hidePlayersCards = true;

            this.cleanBoardEnd();
            //setTimeout(() => this.cleanBoardEnd(), 1000);

            // IF IM CONTRACTOR, I SHUFFLE 1 DEAL NU DECK
            if(this.myPosition === this.gameStarted && !this.partyIsOver) {

                this.deck = new Deck();
                this.deck.shuffle();

                this.setState({
                    handN : this.deck.deal(8),
                    handS : this.deck.deal(8),
                    handE : this.deck.deal(8),
                    handW : this.deck.deal(8),
                });

                // PLAYERS CARDS
                // this.sendHands();
                setTimeout(() => this.sendHands(), 1500);
            }

            this.fullHandN = this.state.handN;
            this.fullHandS = this.state.handS;
            this.fullHandE = this.state.handE;
            this.fullHandW = this.state.handW;

            console.log('------------------------------------------------------------');
            console.log('01 - BARBU - checkEndOfContract() - hidePlayersCards = ', this.hidePlayersCards);
            console.log('01 - BARBU - checkEndOfContract() - displayLoadingBasic = ', this.displayLoadingBasic);
            console.log('01 - BARBU - checkEndOfContract() - boardDominoVisible = ', this.boardDominoVisible);
            console.log('------------------------------------------------------------');

            console.log('01 - BARBU - checkEndOfContract() - this.contractor : ', this.contractor);
            console.log('01 - BARBU - checkEndOfContract() - this.gameStarted : ', this.gameStarted);
            console.log('01 - BARBU - checkEndOfContract() - this.nbContracts : ', this.nbContracts);

            console.log('01 - BARBU - checkEndOfContract() - this.contractsN : ', this.contractsN);
            console.log('01 - BARBU - checkEndOfContract() - this.contractsS : ', this.contractsS);
            console.log('01 - BARBU - checkEndOfContract() - this.contractsE : ', this.contractsE);
            console.log('01 - BARBU - checkEndOfContract() - this.contractsW : ', this.contractsW);
            console.log('------------------------------------------------------------');

        }
    };

    clearPoints = () => {
        console.log('O1 - BARBU - clearPoints()');

        this.pointsN = this.pointsS = this.pointsE = this.pointsW = 0;

        this.heartsDone = false ; this.queensDone = false ;

    };

    handleRATA = () => {
        console.log('O1 - BARBU - handleRATA()');

        if(this.nbClic === 32) {

            this.handlePli();

            // QUI A FAIT LA RATA ?
                 if(this.pointsN === 185) { console.log('O1 - BARBU - handleRATA() - ', this.getNameByCardinal("NORTH"),' A FAIT LA RATA !'); }
            else if(this.pointsS === 185) { console.log('O1 - BARBU - handleRATA() - ', this.getNameByCardinal("SOUTH"),' A FAIT LA RATA !'); }
            else if(this.pointsE === 185) { console.log('O1 - BARBU - handleRATA() - ', this.getNameByCardinal("EAST"),' A FAIT LA RATA !'); }
            else if(this.pointsW === 185) { console.log('O1 - BARBU - handleRATA() - ', this.getNameByCardinal("WEST"),' A FAIT LA RATA !'); }
            else {
                // QUI A PRIS CHER ?
                this.handleBarbu();
                this.handleQueens();
                this.handleHearts();
                this.handleDernierPli();

                let total = this.pointsN + this.pointsS + this.pointsE + this.pointsW ;

                // Check SUM equals 185
                if( this.heartsDone || this.queensDone ) {
                    if( total === -145 ) {
                        console.log('O1 - BARBU - handleRATA() - TOTAL : ', total,' LE COMPTE EST BON !!!');
                    }
                    else { console.log('O1 - BARBU - handleRATA() - TOTAL : ', total,' LES COMPTES NE SONT PAS BONS !!!');}
                }
                else if( this.heartsDone && this.queensDone ) {
                    if( total === -105 ) {
                        console.log('O1 - BARBU - handleRATA() - TOTAL : ', total,' LE COMPTE EST BON !!!');
                    }
                    else { console.log('O1 - BARBU - handleRATA() - TOTAL : ', total,' LES COMPTES NE SONT PAS BONS !!!');}
                }
                else if ( total === -185 ) {
                    console.log('O1 - BARBU - handleRATA() - TOTAL : ', total,' LE COMPTE EST BON !!!');
                }
                else { console.log('O1 - BARBU - handleRATA() - TOTAL : ', total,' LES COMPTES NE SONT PAS BONS !!!');}
            }

        }

    };

    handleBarbu = () => {
        console.log('O1 - BARBU - handleBarbu()');

        for(let a=0; a<this.plisN.length; a++) {
            if( this.plisN[a] === 'kh') { this.pointsN += -40; this.nbClic = 32;
                console.log('O1 - BARBU - handleBarbu() - ', this.getNameByCardinal("NORTH"),' SE MANGE LE BARBU !');
            }
        }
        for(let b=0; b<this.plisS.length; b++) {
            if( this.plisS[b] === 'kh') { this.pointsS += -40; this.nbClic = 32;
                console.log('O1 - BARBU - handleBarbu() - ', this.getNameByCardinal("SOUTH"),' SE MANGE LE BARBU !');
            }
        }
        for(let c=0; c<this.plisE.length; c++) {
            if( this.plisE[c] === 'kh') { this.pointsE += -40; this.nbClic = 32;
                console.log('O1 - BARBU - handleBarbu() - ', this.getNameByCardinal("EAST"),' SE MANGE LE BARBU !');
            }
        }
        for(let d=0; d<this.plisW.length; d++) {
            if( this.plisW[d] === 'kh') { this.pointsW += -40; this.nbClic = 32;
                console.log('O1 - BARBU - handleBarbu() - ', this.getNameByCardinal("WEST"),' SE MANGE LE BARBU !');
            }
        }

    };

    checkDominoRank = (value) => {
        // console.log('O1 - BARBU - checkDominoRank()');

        switch(value) {

            case 0 : return 50;
            case 1 : return 25;
            case 2 : return 0;
            case 3 : return -25;

            default: break;
        }

    };

    handleDomino = () => {
        console.log('O1 - BARBU - handleDomino()');

        if ( this.ranksDomino.indexOf("NORTH") === -1 ) {

            if (this.ranksDomino.length < 3 && this.state.handN.length === 0) {
                //this.pointsN += this.checkDominoRank();
                this.ranksDomino.push("NORTH");
                console.log('O1 - BARBU - handleDomino() - ranksDomino : ', this.ranksDomino);

                if (this.ranksDomino.length === 3) this.handleDomino();
            }

            else if (this.ranksDomino.length === 3 ) {
                //this.pointsN = this.checkDominoRank();
                this.ranksDomino.push("NORTH");
                this.nbClic = 32;

                this.handSpides = []; this.handHearts = [];
                this.handClubs = []; this.handDiamonds = [];
                console.log('O1 - BARBU - handleDomino() - ', this.getNameByCardinal("NORTH"),' EST DERNIER DU DOMINO !');
            }
        }

        if ( this.ranksDomino.indexOf("SOUTH") === -1 ) {

            if (this.ranksDomino.length < 3 && this.state.handS.length === 0) {
                //this.pointsS += this.checkDominoRank();
                this.ranksDomino.push("SOUTH");
                console.log('O1 - BARBU - handleDomino() - ranksDomino : ', this.ranksDomino);

                if (this.ranksDomino.length === 3) this.handleDomino();
            }

            else if (this.ranksDomino.length === 3 ) {
                //this.pointsS = this.checkDominoRank();
                this.ranksDomino.push("SOUTH");
                this.nbClic = 32;

                this.handSpides = []; this.handHearts = [];
                this.handClubs = []; this.handDiamonds = [];
                console.log('O1 - BARBU - handleDomino() - JE SUIS DERNIER DU DOMINO !!!');
            }
        }

        if ( this.ranksDomino.indexOf("EAST") === -1 ) {

            if (this.ranksDomino.length < 3 && this.state.handE.length === 0) {
                //this.pointsE += this.checkDominoRank();
                this.ranksDomino.push("EAST");
                console.log('O1 - BARBU - handleDomino() - ranksDomino : ', this.ranksDomino);

                if (this.ranksDomino.length === 3) this.handleDomino();
            }

            else if (this.ranksDomino.length === 3 ) {
                //this.pointsE = this.checkDominoRank();
                this.ranksDomino.push("EAST");
                this.nbClic = 32;

                this.handSpides = []; this.handHearts = [];
                this.handClubs = []; this.handDiamonds = [];
                console.log('O1 - BARBU - handleDomino() - ', this.getNameByCardinal("EAST"),' EST DERNIER DU DOMINO !');
            }
        }

        if ( this.ranksDomino.indexOf("WEST") === -1 ) {

            if (this.ranksDomino.length < 3 && this.state.handW.length === 0) {
                //this.pointsW += this.checkDominoRank();
                this.ranksDomino.push("WEST");
                console.log('O1 - BARBU - handleDomino() - ranksDomino : ', this.ranksDomino);

                if (this.ranksDomino.length === 3) this.handleDomino();
            }

            else if (this.ranksDomino.length === 3) {
                //this.pointsW = this.checkDominoRank();
                this.ranksDomino.push("WEST");
                this.nbClic = 32;

                this.handSpides = []; this.handHearts = [];
                this.handClubs = []; this.handDiamonds = [];
                console.log('O1 - BARBU - handleDomino() - ', this.getNameByCardinal("WEST"),' EST DERNIER DU DOMINO !');
            }
        }

        /* ----------------------------------------------------------------- */

        if (this.ranksDomino.length === 4) {

            this.pointsN = this.checkDominoRank(this.ranksDomino.indexOf("NORTH"));
            this.pointsS = this.checkDominoRank(this.ranksDomino.indexOf("SOUTH"));
            this.pointsE = this.checkDominoRank(this.ranksDomino.indexOf("EAST"));
            this.pointsW = this.checkDominoRank(this.ranksDomino.indexOf("WEST"));

            this.ranksDomino = [] ;

        }
    };

    handleQueens = () => {
        console.log('O1 - BARBU - handleQueens()');

        let nbQueensN = 0 ;
        let nbQueensS = 0 ;
        let nbQueensE = 0 ;
        let nbQueensW = 0 ;

        for(let a=0; a<this.plisN.length; a++) {
            if( this.plisN[a].charAt(0) === 'q') { nbQueensN++; }
        }
        for(let b=0; b<this.plisS.length; b++) {
            if( this.plisS[b].charAt(0) === 'q') { nbQueensS++; }
        }
        for(let c=0; c<this.plisE.length; c++) {
            if( this.plisE[c].charAt(0) === 'q') { nbQueensE++; }
        }
        for(let d=0; d<this.plisW.length; d++) {
            if( this.plisW[d].charAt(0) === 'q') { nbQueensW++; }
        }

        if(nbQueensN === 4) { this.pointsN += 40; this.nbClic = 32; this.queensDone = true;
            console.log('O1 - BARBU - handleQueens() - ', this.getNameByCardinal("NORTH"),' A FAIT LES DAMES !');}
        else if(nbQueensS === 4) { this.pointsS += 40; this.nbClic = 32; this.queensDone = true;
            console.log('O1 - BARBU - handleQueens() - ', this.getNameByCardinal("SOUTH"),' A FAIT LES DAMES !');}
        else if(nbQueensE === 4) { this.pointsE += 40; this.nbClic = 32; this.queensDone = true;
            console.log('O1 - BARBU - handleQueens() - ', this.getNameByCardinal("EAST"),' A FAIT LES DAMES !');}
        else if(nbQueensW === 4) { this.pointsW += 40; this.nbClic = 32; this.queensDone = true;
            console.log('O1 - BARBU - handleQueens() - ', this.getNameByCardinal("WEST"),' A FAIT LES DAMES !');}
        else if(nbQueensN + nbQueensS + nbQueensE + nbQueensW === 4) {

            this.pointsN += nbQueensN * -10; console.log('O1 - BARBU - handleQueens() - ', nbQueensN, ' DAMES pour ', this.getNameByCardinal("NORTH"),' !');
            this.pointsS += nbQueensS * -10; console.log('O1 - BARBU - handleQueens() - ', nbQueensS, ' DAMES pour ', this.getNameByCardinal("SOUTH"),'!');
            this.pointsE += nbQueensE * -10; console.log('O1 - BARBU - handleQueens() - ', nbQueensE, ' DAMES pour ', this.getNameByCardinal("EAST"),'!');
            this.pointsW += nbQueensW * -10; console.log('O1 - BARBU - handleQueens() - ', nbQueensW, ' DAMES pour ', this.getNameByCardinal("WEST"),'!');
            this.nbClic = 32;
        }

    };

    handleHearts = () => {
        console.log('O1 - BARBU - handleHearts()');

        let nbHeartsN = 0 ;
        let nbHeartsS = 0 ;
        let nbHeartsE = 0 ;
        let nbHeartsW = 0 ;

        for(let a=0; a<this.plisN.length; a++) {
            if( this.plisN[a].charAt(1) === 'h') { nbHeartsN++; }
        }
        for(let b=0; b<this.plisS.length; b++) {
            if( this.plisS[b].charAt(1) === 'h') { nbHeartsS++; }
        }
        for(let c=0; c<this.plisE.length; c++) {
            if( this.plisE[c].charAt(1) === 'h') { nbHeartsE++; }
        }
        for(let d=0; d<this.plisW.length; d++) {
            if( this.plisW[d].charAt(1) === 'h') { nbHeartsW++; }
        }

        console.log('O1 - BARBU - handleHearts() - nbHeartsN : ', nbHeartsN);
        console.log('O1 - BARBU - handleHearts() - nbHeartsS : ', nbHeartsS);
        console.log('O1 - BARBU - handleHearts() - nbHeartsE : ', nbHeartsE);
        console.log('O1 - BARBU - handleHearts() - nbHeartsW : ', nbHeartsW);

        if(nbHeartsN === 8) {
            if(this.currentChoice === "RATA") { this.pointsN += 0; }
            else this.pointsN += 40;

            this.nbClic = 32; this.heartsDone = true;
            console.log('O1 - BARBU - handleHearts() - ', this.getNameByCardinal("NORTH"),' A FAIT LES ♥ !');}

            else if(nbHeartsS === 8) {
            if(this.currentChoice === "RATA") { this.pointsS += 0; }
            else this.pointsS += 40;

            this.nbClic = 32; this.heartsDone = true;
            console.log('O1 - BARBU - handleHearts() - ', this.getNameByCardinal("SOUTH"),' A FAIT LES ♥ !');}

        else if(nbHeartsE === 8) {
            if(this.currentChoice === "RATA") { this.pointsE += 0; }
            else this.pointsE += 40;

            this.nbClic = 32; this.heartsDone = true;
            console.log('O1 - BARBU - handleHearts() - ', this.getNameByCardinal("EAST"),' A FAIT LES ♥ !');}

        else if(nbHeartsW === 8) {
            if(this.currentChoice === "RATA") { this.pointsW += 0; }
            else this.pointsW += 40;

            this.nbClic = 32; this.heartsDone = true;
            console.log('O1 - BARBU - handleHearts() - ', this.getNameByCardinal("WEST"),' A FAIT LES ♥ !');}

        else if(nbHeartsN + nbHeartsS + nbHeartsE + nbHeartsW === 8) {

            this.pointsN += nbHeartsN * -5; console.log('O1 - BARBU - handleHearts() - ', nbHeartsN ,' ♥ pour ', this.getNameByCardinal("NORTH"),' !');
            this.pointsS += nbHeartsS * -5; console.log('O1 - BARBU - handleHearts() - ', nbHeartsS ,' ♥ pour ', this.getNameByCardinal("SOUTH"),' !');
            this.pointsE += nbHeartsE * -5; console.log('O1 - BARBU - handleHearts() - ', nbHeartsE ,' ♥ pour ', this.getNameByCardinal("EAST"),' !');
            this.pointsW += nbHeartsW * -5; console.log('O1 - BARBU - handleHearts() - ', nbHeartsW ,' ♥ pour ', this.getNameByCardinal("WEST"),' !');
            this.nbClic = 32;
        }
    };

    handlePli = () => {
        console.log('O1 - BARBU - handlePli()');

        console.log('01 - BARBU - handlePli() - this.plisN : ', this.plisN);
        console.log('01 - BARBU - handlePli() - this.plisS : ', this.plisS);
        console.log('01 - BARBU - handlePli() - this.plisE : ', this.plisE);
        console.log('01 - BARBU - handlePli() - this.plisW : ', this.plisW);

        if(this.nbClic === 32) {

            if(this.plisN.length === 32) {
                if(this.currentChoice === "RATA") { this.pointsN += 185 ; }
                else this.pointsN += 40 ; console.log('O1 - BARBU - handlePli() - ', this.getNameByCardinal("NORTH"),' FAIT LES PLIS !');
            }
            else if(this.plisS.length === 32) {
                if(this.currentChoice === "RATA") { this.pointsS += 185 ; }
                else this.pointsS += 40 ; console.log('O1 - BARBU - handlePli() - ', this.getNameByCardinal("SOUTH"),' FAIT LES PLIS !');
            }
            else if(this.plisE.length === 32) {
                if(this.currentChoice === "RATA") { this.pointsE += 185 ; }
                else this.pointsE += 40 ; console.log('O1 - BARBU - handlePli() - ', this.getNameByCardinal("EAST"),' FAIT LES PLIS !');
            }
            else if(this.plisW.length === 32) {
                if(this.currentChoice === "RATA") { this.pointsW += 185 ; }
                else this.pointsW += 40 ; console.log('O1 - BARBU - handlePli() - ', this.getNameByCardinal("WEST"),' FAIT LES PLIS !');
            }
            else {
                this.pointsN += (this.plisN.length / 4) * -5; console.log('O1 - BARBU - handlePli() - ', (this.plisN.length / 4),' plis pour ', this.getNameByCardinal("NORTH"),' !');
                this.pointsS += (this.plisS.length / 4) * -5; console.log('O1 - BARBU - handlePli() - ', (this.plisS.length / 4),' plis pour ', this.getNameByCardinal("SOUTH"),' !');
                this.pointsE += (this.plisE.length / 4) * -5; console.log('O1 - BARBU - handlePli() - ', (this.plisE.length / 4),' plis pour ', this.getNameByCardinal("EAST"),' !');
                this.pointsW += (this.plisW.length / 4) * -5; console.log('O1 - BARBU - handlePli() - ', (this.plisW.length / 4),' plis pour ', this.getNameByCardinal("WEST"),' !');
            }
        }
    };

    handleDernierPli = () => {
        console.log('O1 - BARBU - handleDernierPli()');

        if(this.nbClic === 32) {

            switch(this.isMaster) {

                case "NORTH" :  this.pointsN += -25; break;

                case "SOUTH" :  this.pointsS += -25; break;

                case "EAST" :   this.pointsE += -25; break;

                case "WEST" :   this.pointsW += -25; break;

                default: break;
            }

            console.log('O1 - BARBU - handleDernierPli() - ', this.getNameByCardinal(this.isMaster),' se mange le dernier pli !');
        }
    };

    addGamePoints = () => {
        console.log('O1 - BARBU - addGamePoints()');

        if(this.nbClic === 32) {

            this.gamePointsN += this.pointsN;
            this.gamePointsS += this.pointsS;
            this.gamePointsE += this.pointsE;
            this.gamePointsW += this.pointsW;

            let cardinalFirst = this.getCardinalByPos(1);

            let score = {};

            // console.log('O1 - BARBU - addGamePoints() | positionFirst : ', cardinalFirst);

            switch(cardinalFirst) {

                case "NORTH" :
                    this.gamePoints = [
                        this.gamePointsN,
                        this.gamePointsE,
                        this.gamePointsS,
                        this.gamePointsW];

                    score = {
                        contrat : this.currentChoice,
                        score1 : this.pointsN,
                        score2 : this.pointsE,
                        score3 : this.pointsS,
                        score4 : this.pointsW,
                    }; break;
                case "SOUTH" :
                    this.gamePoints = [
                        this.gamePointsS,
                        this.gamePointsW,
                        this.gamePointsN,
                        this.gamePointsE];

                    score = {
                        contrat : this.currentChoice,
                        score1 : this.pointsS,
                        score2 : this.pointsW,
                        score3 : this.pointsN,
                        score4 : this.pointsE,
                    }; break;
                case "EAST" :
                    this.gamePoints = [
                        this.gamePointsE,
                        this.gamePointsS,
                        this.gamePointsW,
                        this.gamePointsN];

                    score = {
                        contrat : this.currentChoice,
                        score1 : this.pointsE,
                        score2 : this.pointsS,
                        score3 : this.pointsW,
                        score4 : this.pointsN,
                    }; break;
                case "WEST" :
                    this.gamePoints = [
                        this.gamePointsW,
                        this.gamePointsN,
                        this.gamePointsE,
                        this.gamePointsS];

                    score = {
                        contrat : this.currentChoice,
                        score1 : this.pointsW,
                        score2 : this.pointsN,
                        score3 : this.pointsE,
                        score4 : this.pointsS,
                    }; break;

                default: break;
            }

            // SCORESHEET GESTION
            this.currentScore.push(score);

            if( this.nbContracts === 6  ||
                this.nbContracts === 13 ||
                this.nbContracts === 20 ||
                this.nbContracts === 27) {

                score = {
                    contrat : "-",
                    score1  : "-",
                    score2  : "-",
                    score3  : "-",
                    score4  : "-",
                };

                // SPLIT GESTION
                this.currentScore.push(score);
            }

            console.log('O1 - BARBU - addGamePoints() | currentScore : ', this.currentScore);
        }

        console.log('01 - BARBU - addGamePoints() - this.gamePoints : ', this.gamePoints);
    };

    handleContract = () => {

        // TODO : Vérifier le currentChoice & dispatch.
        console.log('O1 - BARBU || handleContract()');

        this.clearPoints();

        switch(this.currentChoice)
        {
            case "Dernier Pli"  : this.handleDernierPli();  break;
            case "Pli"          : this.handlePli();         break;
            case "Coeur"        : this.handleHearts();      break;
            case "Dames"        : this.handleQueens();      break;
            case "RATA"         : this.handleRATA();        break;
            case "Barbu"        : this.handleBarbu();       break;
            case "Domino"       : this.handleDomino();      break;
            default: break;
        }

        this.addGamePoints();
    };

    chacunSesPlis = () => {

        console.log('O1 - BARBU - chacunSesPlis() - this.isMaster : ', this.isMaster);
        console.log('O1 - BARBU - chacunSesPlis() - this.tempoPli : ', this.tempoPli);

        if(this.tempoPli.length === 4) {

            switch(this.isMaster) {

                case "NORTH" :
                    this.plisN.push(this.tempoPli[0]);
                    this.plisN.push(this.tempoPli[1]);
                    this.plisN.push(this.tempoPli[2]);
                    this.plisN.push(this.tempoPli[3]); break;

                case "SOUTH" :
                    this.plisS.push(this.tempoPli[0]);
                    this.plisS.push(this.tempoPli[1]);
                    this.plisS.push(this.tempoPli[2]);
                    this.plisS.push(this.tempoPli[3]); break;

                case "EAST" :
                    this.plisE.push(this.tempoPli[0]);
                    this.plisE.push(this.tempoPli[1]);
                    this.plisE.push(this.tempoPli[2]);
                    this.plisE.push(this.tempoPli[3]); break;

                case "WEST" :
                    this.plisW.push(this.tempoPli[0]);
                    this.plisW.push(this.tempoPli[1]);
                    this.plisW.push(this.tempoPli[2]);
                    this.plisW.push(this.tempoPli[3]); break;

                default: break;
            }
        }
    };

    hasColorAsked = (myHand, couleur) => {

        for(let v=0; v<myHand.length; v++) {

            if( myHand[v].charAt(1) === couleur ) {
                return true;
            }
        }
        return false;
    };

    checkColorPresence = (i, color) => {

        switch (i) {
            case 0 : return this.hasColorAsked(this.state.handN, color);
            case 1 : return this.hasColorAsked(this.state.handS, color);
            case 2 : return this.hasColorAsked(this.state.handE, color);
            case 3 : return this.hasColorAsked(this.state.handW, color);
            default: break;
        }

    };

    controlColorAsked = (indexActual, key) => {

        let colorPlayed = key.charAt(1);
        let colorAsked = this.cardStarted.charAt(1);

        if(this.boardHand.length > 0 && this.boardHand.length < 4) {

            if(colorPlayed !== colorAsked) {

                for (let e = 0; e < indexActual.length; e++) {

                    if (indexActual[e] > -1) {

                        return !this.checkColorPresence(e, colorAsked);
                    }
                }
            }
        }
        return true;
    };

    controlPlayerActive = () => {

        console.log('O1 - BARBU - controlPlayerActive() - isMaster : ', this.isMaster);
        console.log('O1 - BARBU - controlPlayerActive() - this.hasClicked : ', this.hasClicked);

        if( this.boardHand.length === 0 || this.boardHand.length === 4 ) {

            return this.hasClicked === this.isMaster ;
        }
        else if ( this.boardHand.length === 3 ) {

            switch (this.hasClicked) {

                case "NORTH" : return this.hasStarted === "EAST";
                case "SOUTH" : return this.hasStarted === "WEST";
                case "EAST"  : return this.hasStarted === "SOUTH";
                case "WEST"  : return this.hasStarted === "NORTH";
                default : break;
            }
        }
        else if ( this.boardHand.length === 2 ) {

            switch (this.hasClicked) {

                case "NORTH" : return this.hasStarted === "SOUTH";
                case "SOUTH" : return this.hasStarted === "NORTH";
                case "EAST"  : return this.hasStarted === "WEST";
                case "WEST"  : return this.hasStarted === "EAST";
                default : break;
            }
        }
        else if ( this.boardHand.length === 1 ) {

            switch (this.hasClicked) {

                case "NORTH" : return this.hasStarted === "WEST";
                case "SOUTH" : return this.hasStarted === "EAST";
                case "EAST"  : return this.hasStarted === "NORTH";
                case "WEST"  : return this.hasStarted === "SOUTH";
                default : break;
            }
        }
    };

    controlDominoHands = (e) => {
        console.log('O1 - BARBU - controlDominoHands() e : ', e);

        this.northBoude = this.southBoude = false ;
        this.eastBoude = this.westBoude = false ;

        switch(e){

            case 0 :
                // NORTH CONTROL EAST.
                if (this.state.handE.length !== 0) {
                    for (let k = 0; k < this.state.handE.length; k++) {
                        if (this.controlDominoCardPlayed(this.state.handE[k])) {
                            this.hasToPlayDomino = "EAST";
                            this.eastBoude = false;
                            break;
                        } else { this.eastBoude = true; }
                    }
                } else { this.eastBoude = true; }

                if ( this.eastBoude ) {
                    // EAST CONTROL SOUTH.
                    if (this.state.handS.length !== 0) {
                        for (let l = 0; l < this.state.handS.length; l++) {
                            if (this.controlDominoCardPlayed(this.state.handS[l])) {
                                this.hasToPlayDomino = "SOUTH";
                                this.southBoude = false;
                                break;
                            } else { this.southBoude = true; }
                        }
                    } else { this.southBoude = true; }

                    if ( this.southBoude ) {
                        // SOUTH CONTROL WEST.
                        if (this.state.handW.length !== 0) {
                            for (let m = 0; m < this.state.handW.length; m++) {
                                if (this.controlDominoCardPlayed(this.state.handW[m])) {
                                    this.hasToPlayDomino = "WEST";
                                    this.westBoude = false;
                                    break;
                                } else { this.westBoude = true; }
                            }
                        } else { this.westBoude = true; }
                    }
                } break;

            case 1 :
                // SOUTH CONTROL WEST.
                if (this.state.handW.length !== 0) {
                    for (let k = 0; k < this.state.handW.length; k++) {
                        if (this.controlDominoCardPlayed(this.state.handW[k])) {
                            this.hasToPlayDomino = "WEST";
                            this.westBoude = false;
                            break;
                        } else {
                            this.westBoude = true;
                        }
                    }
                } else { this.westBoude = true; }

                if ( this.westBoude ) {
                    // WEST CONTROL NORTH.
                    if (this.state.handN.length !== 0) {
                        for (let l = 0; l < this.state.handN.length; l++) {
                            if (this.controlDominoCardPlayed(this.state.handN[l])) {
                                this.hasToPlayDomino = "NORTH";
                                this.northBoude = false;
                                break;
                            } else {
                                this.northBoude = true;
                            }
                        }
                    } else { this.northBoude = true; }

                    if ( this.northBoude ) {
                        // NORTH CONTROL EAST.
                        if (this.state.handE.length !== 0) {
                            for (let m = 0; m < this.state.handE.length; m++) {
                                if (this.controlDominoCardPlayed(this.state.handE[m])) {
                                    this.hasToPlayDomino = "EAST";
                                    this.eastBoude = false;
                                    break;
                                } else {
                                    this.eastBoude = true;
                                }
                            }
                        } else { this.eastBoude = true; }
                    }
                } break ;

            case 2 :
                // EAST CONTROL SOUTH.
                if (this.state.handS.length !== 0){
                    for(let k=0; k<this.state.handS.length; k++) {
                        if( this.controlDominoCardPlayed(this.state.handS[k]) ) {
                            this.hasToPlayDomino = "SOUTH";
                            this.southBoude = false; break;
                        } else { this.southBoude = true; }
                    }
                }
                else {this.southBoude = true;}

                if ( this.southBoude ) {
                    // SOUTH CONTROL WEST.
                    if (this.state.handW.length !== 0) {
                        for (let l = 0; l < this.state.handW.length; l++) {
                            if (this.controlDominoCardPlayed(this.state.handW[l])) {
                                this.hasToPlayDomino = "WEST";
                                this.westBoude = false;
                                break;
                            } else {
                                this.westBoude = true;
                            }
                        }
                    } else { this.westBoude = true; }

                    if ( this.westBoude ) {
                        // WEST CONTROL NORTH.
                        if (this.state.handN.length !== 0) {
                            for (let m = 0; m < this.state.handN.length; m++) {

                                if (this.controlDominoCardPlayed(this.state.handN[m])) {
                                    this.hasToPlayDomino = "NORTH";
                                    this.northBoude = false;
                                    break;
                                } else {
                                    this.northBoude = true;
                                }
                            }
                        } else { this.northBoude = true; }
                    }
                } break;

            case 3 :
                // WEST CONTROL NORTH.
                if (this.state.handN.length !== 0) {
                    for (let k = 0; k < this.state.handN.length; k++) {
                        if (this.controlDominoCardPlayed(this.state.handN[k])) {
                            this.hasToPlayDomino = "NORTH";
                            this.northBoude = false;
                            break;
                        } else {
                            this.northBoude = true;
                        }
                    }
                } else { this.northBoude = true; }

                if (this.northBoude ) {
                    // NORTH CONTROL EAST.
                    if (this.state.handE.length !== 0) {
                        for (let l = 0; l < this.state.handE.length; l++) {
                            if (this.controlDominoCardPlayed(this.state.handE[l])) {
                                this.hasToPlayDomino = "EAST";
                                this.eastBoude = false;
                                break;

                            } else {
                                this.eastBoude = true;
                            }
                        }
                    } else { this.eastBoude = true; }

                    if ( this.eastBoude ) {
                        // EAST CONTROL SOUTH.
                        if (this.state.handS.length !== 0) {
                            for (let m = 0; m < this.state.handS.length; m++) {

                                if (this.controlDominoCardPlayed(this.state.handS[m])) {
                                    this.hasToPlayDomino = "SOUTH";
                                    this.southBoude = false;
                                    break;
                                } else { this.southBoude = true; }
                            }
                        } else { this.southBoude = true; }
                    }
                } break;

            default: break;
        }
        console.log('O1 - BARBU - controlDominoHands() this.northBoude : ', this.northBoude);
        console.log('O1 - BARBU - controlDominoHands() this.southBoude : ', this.southBoude);
        console.log('O1 - BARBU - controlDominoHands() this.eastBoude : ', this.eastBoude);
        console.log('O1 - BARBU - controlDominoHands() this.westBoude : ', this.westBoude);

        console.log('O1 - BARBU - controlDominoHands() this.hasToPlayDomino : ', this.hasToPlayDomino);

    };

    controlDominoPlayerActive = () => {
        // console.log('O1 - BARBU - controlDominoPlayerActive() |');

        return this.hasClicked === this.hasToPlayDomino ;
    };

    controlDominoCardPlayed = (card) => {
        // VERIFIE QUE LA CARTE EST JOUABLE.

        let dIndex ;

        if(card.charAt(0) === 'j') {

            switch(card.charAt(1)) {

                case 's' : return this.handSpides.length === 0 ;
                case 'h' : return this.handHearts.length === 0 ;
                case 'c' : return this.handClubs.length === 0 ;
                case 'd' : return this.handDiamonds.length === 0 ;

                default: break;
            }
        }
        else {

            if(card.charAt(0) === '1' || card.charAt(0) === 'k' || card.charAt(0) === 'q') {
                // Gestion des cartes 'A', 'K', 'Q'.
                dIndex = this.orderValue.indexOf(card.charAt(0)) - 1;
            }
            else {
                // Gestion des cartes '10', '9', '8', '7'.
                dIndex = this.orderValue.indexOf(card.charAt(0)) + 1;
            }

            let value           = this.orderValue[dIndex] ;
            let presenceCard    = value + card.charAt(1) ;

            switch(card.charAt(1)) {

                case 's' : return this.handSpides.indexOf(presenceCard) > -1 ;
                case 'h' : return this.handHearts.indexOf(presenceCard) > -1 ;
                case 'c' : return this.handClubs.indexOf(presenceCard) > -1 ;
                case 'd' : return this.handDiamonds.indexOf(presenceCard) > -1 ;

                default : break;
            }
        }
    };

    removeOneCard = (indexCurrent, card) => {
        console.log('O1 - BARBU - removeOne() Card : ', card);
        // console.log('O1 - BARBU - removeOne() indexCurrent : ', indexCurrent);

        // Remove Card & Check Who Started.
        for (let i=0; i<indexCurrent.length; i++) {

            if ( indexCurrent[i] > -1 ) {

                switch (i) {

                    case 0 :
                        this.cardN = card;
                        this.state.handN.splice(indexCurrent[0], 1);
                        if(this.boardHand.length === 1) {this.hasStarted="NORTH"; this.cardStarted=card;}

                        if(!this.state.positionPicked){ setTimeout(() => this.state.handN.splice(1, 0, card), 3000);  }

                        break;

                    case 1:
                        this.cardS = card;
                        this.state.handS.splice(indexCurrent[1], 1);
                        if(this.boardHand.length === 1) {this.hasStarted="SOUTH"; this.cardStarted=card;}

                        if(!this.state.positionPicked){ setTimeout(() => this.state.handS.splice(1, 0, card), 3000);  }


                        break;

                    case 2:
                        this.cardE = card;
                        this.state.handE.splice(indexCurrent[2], 1);
                        if(this.boardHand.length === 1) {this.hasStarted="EAST"; this.cardStarted=card;}

                        if(!this.state.positionPicked){ setTimeout(() => this.state.handE.splice(1, 0, card), 3000);  }

                        break;

                    case 3:
                        this.cardW = card;
                        this.state.handW.splice(indexCurrent[3], 1);
                        if(this.boardHand.length === 1) {this.hasStarted="WEST"; this.cardStarted=card;}

                        if(!this.state.positionPicked){ setTimeout(() => this.state.handW.splice(1, 0, card), 3000);  }

                        break;

                    default:
                        break;
                }
            }
        }

        // console.log('O1 - BARBU - removeOneCard() - colorAsked ', this.cardStarted.charAt(1));
        // console.log('O1 - BARBU - removeOneCard() - ', this.hasStarted, 'has Started.');
    };

    removeOneCardDomino = (indexCurrent, card) => {
        console.log('O1 - BARBU - removeOneCardDomino() card : ', card);

        // Remove Card from Hand
        for (let i=0; i<indexCurrent.length; i++) {

            if ( indexCurrent[i] > -1 ) {

                switch (i) {

                    case 0 :
                        this.state.handN.splice(indexCurrent[i], 1);
                        this.controlDominoHands(i); break;
                    case 1:
                        this.state.handS.splice(indexCurrent[i], 1);
                        this.controlDominoHands(i); break;
                    case 2:
                        this.state.handE.splice(indexCurrent[i], 1);
                        this.controlDominoHands(i); break;
                    case 3:
                        this.state.handW.splice(indexCurrent[i], 1);
                        this.controlDominoHands(i); break;

                    default:
                        break;
                }
            }
        }

        console.log('01 - BARBU - removeOneCardDomino() - this.state.handN.length : ', this.state.handN.length);
        console.log('01 - BARBU - removeOneCardDomino() - this.state.handS.length : ', this.state.handS.length);
        console.log('01 - BARBU - removeOneCardDomino() - this.state.handE.length : ', this.state.handE.length);
        console.log('01 - BARBU - removeOneCardDomino() - this.state.handW.length : ', this.state.handW.length);

    };

    fillBoard = (card) => {

        console.log('O1 - BARBU - FillBoard() card : ', card);
        // console.log('O1 - BARBU - FillBoard() this.tempoPli.length : ', this.tempoPli.length);

        let nuHand = this.boardHand;

        if (this.boardHand.length === 4){
            nuHand = [];

            this.cardN = "";
            this.cardS = "";
            this.cardE = "";
            this.cardW = "";

            console.log('O1 - BARBU - fillBoard() - this.tempoPli BEFORE POP : ', this.tempoPli);

            this.tempoPli.pop();
            this.tempoPli.pop();
            this.tempoPli.pop();
            this.tempoPli.pop();

            console.log('O1 - BARBU - fillBoard() - this.tempoPli POP : ', this.tempoPli);

            this.boardHand.pop();
            this.boardHand.pop();
            this.boardHand.pop();
            this.boardHand.pop();

            this.boardHand.push(card);
        }

        nuHand.push(card);
        this.tempoPli.push(card);

        this.setState({boardHand : nuHand});
        console.log('O1 - BARBU - FillBoard() this.tempoPli : ', this.tempoPli);

    };

    fillBoardDomino = (card) => {
        console.log('O1 - BARBU - fillBoardDomino() card : ', card);

        switch(card.charAt(1)) {

            case 's' :
                this.handSpides.push(card);
                this.setState({ handSpides: this.handSpides }); break;
            case 'h' :
                this.handHearts.push(card);
                this.setState({ handHearts: this.handHearts }); break;
            case 'c' :
                this.handClubs.push(card);
                this.setState({ handClubs: this.handClubs }); break;
            case 'd' :
                this.handDiamonds.push(card);
                this.setState({ handDiamonds: this.handDiamonds }); break;

            default : break;
        }


        // console.log('01 - BARBU - Render() - this.handSpides : ', this.handSpides);
        // console.log('01 - BARBU - Render() - this.handHearts : ', this.handHearts);
        // console.log('01 - BARBU - Render() - this.handClubs : ', this.handClubs);
        // console.log('01 - BARBU - Render() - this.handDiamonds : ', this.handDiamonds);

    };

    flipCardPosition = (key) => {
        // console.log('01 - BARBU - flipCardPosition() | key : ', key);

        if(this.tempoPli.indexOf(key) === -1) {
            this.flipped = key;
            this.flopped = "";
        } else {
            this.flipped = "";
            this.flopped = key;
        }

        if(this.tempoPli.length<4) {
            
            this.tempoPli.push(key);
        }

        this.setState(this.state);
    };

    sortPlayersPosition() {
        console.log('O1 - BARBU - sortPlayersPosition() tempoPli : ', this.tempoPli);

        let currentBoard = [...this.tempoPli];
        let high = "" ; let index = [];

        let v0 = currentBoard[0].charAt(0);
        let v1 = currentBoard[1].charAt(0);
        let v2 = currentBoard[2].charAt(0);
        let v3 = currentBoard[3].charAt(0);
        let listValues = [v0, v1, v2, v3];

        // RANKING 1ST POSITION.
        high = this.getHigher(listValues, currentBoard);
        this.rankPosition.push(high); this.isHigher = high;

        index = currentBoard.indexOf(high);
        currentBoard.splice(index, 1);
        listValues.splice(index, 1);

        // RANKING 2ND POSITION.
        high = this.getHigher(listValues, currentBoard);
        this.rankPosition.push(high);

        index = currentBoard.indexOf(high);
        currentBoard.splice(index, 1);
        listValues.splice(index, 1);

        // RANKING 3RD POSITION.
        high = this.getHigher(listValues, currentBoard);
        this.rankPosition.push(high);

        index = currentBoard.indexOf(high);
        currentBoard.splice(index, 1);
        listValues.splice(index, 1);

        // RANKING 4TH POSITION.
        high = this.getHigher(listValues, currentBoard);
        this.rankPosition.push(high);

        // console.log('O1 - BARBU - sortPlayersPosition() - Higher : ', this.isHigher);
        // console.log('O1 - BARBU - sortPlayersPosition() - rankPosition : ', this.rankPosition);

        // On range this.ranks

        let rank1 = {
            key : this.rankPosition[0],
            name : this.getNamePosition(0),
        };

        let rank2 = {
            key : this.rankPosition[1],
            name : this.getNamePosition(1),
        };

        let rank3 = {
            key : this.rankPosition[2],
            name : this.getNamePosition(2),
        };
        let rank4 = {
            key : this.rankPosition[3],
            name : this.getNamePosition(3),
        };

        this.ranking.push(rank1);
        this.ranking.push(rank2);
        this.ranking.push(rank3);
        this.ranking.push(rank4);

        console.log('O1 - BARBU - sortPlayersPosition() - ranking : ', this.ranking);
    }

    getHigher = (list, board) => {
        // console.log('O1 - BARBU - getHigher()', board);

        if(board.length > 1) {

            let higherRank = list[0] ;
            let higherCard = board[0] ;

            for (let x=1; x<=list.length; x++) {

                if (this.orderValue.indexOf(list[x]) >= this.orderValue.indexOf(higherRank)) {
                    higherRank = list[x];
                    higherCard = board[x];
                }
            }
            return higherCard;

        } else if (board.length === 1) {
            return board[0];
        }
        else return null ;

    };

    whoIsMaster() {

        if (this.boardHand.length === 4) {
        // TODO : Gérer l'ordonnancement.

        let currentBoard = this.boardHand;
        let colorAsked = this.cardStarted.charAt(1);

        let v0 = currentBoard[0].charAt(0);
        let v1 = currentBoard[1].charAt(0);
        let v2 = currentBoard[2].charAt(0);
        let v3 = currentBoard[3].charAt(0);
        let listValues = [v0, v1, v2, v3];

        let master = v0 ;

        let c0 = currentBoard[0].charAt(1);
        let c1 = currentBoard[1].charAt(1);
        let c2 = currentBoard[2].charAt(1);
        let c3 = currentBoard[3].charAt(1);
        let listColors = [c0, c1, c2, c3];

        for (let i=0; i<listValues.length; i++) {

            if(listColors[i] === colorAsked) {

                if (this.orderValue.indexOf(listValues[i]) > this.orderValue.indexOf(master)) {

                    master = listValues[i];

                    if (listColors[i+1] === colorAsked) {

                        if (this.orderValue.indexOf(listValues[i+1]) > this.orderValue.indexOf(listValues[i])) {
                            master = listValues[i+1];
                        }
                    }
                }
            }
        }

        let theMaster = master + colorAsked ;

        console.log('O1 - BARBU - whoIsMaster() - The Master : ', theMaster);
        //console.log('O1 - BARBU - whoIsMaster() - colorAsked : ', colorAsked);

        let indexM = [

            this.fullHandN.indexOf(theMaster),
            this.fullHandS.indexOf(theMaster),
            this.fullHandE.indexOf(theMaster),
            this.fullHandW.indexOf(theMaster),

        ];

        // TODO : WHY INDEXM IS EMPTY ?

        console.log('O1 - BARBU - whoIsMaster() - indexM : ', indexM);

        // Check Who is Master.
        for (let i=0; i<indexM.length; i++) {

            if (indexM[i] > -1) {

                switch (i) {

                    case 0 : this.isMaster = "NORTH"; console.log('O1 - BARBU - whoIsMaster() - NORTH'); break;
                    case 1 : this.isMaster = "SOUTH"; console.log('O1 - BARBU - whoIsMaster() - SOUTH'); break;
                    case 2 : this.isMaster = "EAST"; console.log('O1 - BARBU - whoIsMaster() - EAST'); break;
                    case 3 : this.isMaster = "WEST"; console.log('O1 - BARBU - whoIsMaster() - WEST'); break;

                    default:
                        console.log('O1 - BARBU - whoIsMaster() - ERROR404 - NO MASTER');
                        break;
                }
            }
        }

        console.log('O1 - BARBU - whoIsMaster() - isMaster : ', this.isMaster);

        //console.log('O1 - BARBU - whoIsMaster() - expression : ', this.orderValue.indexOf(master));
        //console.log('O1 - BARBU - whoIsMaster() - listValues : ', listValues);
        //console.log('O1 - BARBU - whoIsMaster() - listColors : ', listColors);
        }
    }

    onClickHand = (key) => {
        console.log('O1 - BARBU - onClickHand() : ', key);

        let indexC = [
            this.state.handN.indexOf(key),
            this.state.handS.indexOf(key),
            this.state.handE.indexOf(key),
            this.state.handW.indexOf(key),
        ];

        if(this.state.positionPicked && this.inProgress) {

            this.checkWhoClicked(indexC);
            //console.log('01 - BARBU - onClickHand() - this.hasClicked : ', this.hasClicked);
            if(this.hasClicked === "SOUTH") { this.click(key); }
        }

        if(!this.state.positionPicked) {

            console.log('01 - BARBU - onClickHand() - Condition => this.ranks = ', this.ranks);
            console.log('01 - BARBU - onClickHand() - Condition => this.props.barbuser.name = ', this.props.barbuser.name);
            console.log('01 - BARBU - onClickHand() - Condition => this.checkNameInRanks(this.props.barbuser.name) = ', this.checkNameInRanks(this.props.barbuser.name));

            if(!this.checkNameInRanks(this.props.barbuser.name)) {
                // WEBSOCKET CAST
                this.click(key);
                this.setPosition(key);
            }
            else {
                console.log('01 - BARBU - onClickHand() - ALERT YAC ! ');

                alert("YOU ALREADY CLICKED !")
            }
        }
        else if(!this.boardDominoVisible) {

            console.log('01 - BARBU - onClickHand() - Condition => !panelVisible = ', !this.state.panelVisible );
            console.log('01 - BARBU - onClickHand() - Condition => controlPlayerActive = ', this.controlPlayerActive() );
            console.log('01 - BARBU - onClickHand() - Condition => controlColorAsked = ', this.controlColorAsked(indexC, key) );

            if(!this.state.panelVisible && this.controlPlayerActive() && this.controlColorAsked(indexC, key)) {
                // TODO : DEFINE & LIMIT COLOR ASKED IN NEXT HANDS

                // REMPLIR LE BOARD.
                this.fillBoard(key);

                // DECREMENTER LA MAIN.
                this.removeOneCard(indexC, key);

                // QUI EST MAITRE.
                this.whoIsMaster();

                // QUI DOIT JOUER.
                this.whichArrow();

                // STOCKER LES PLIS.
                this.chacunSesPlis();

                this.nbClic++;

                console.log('01 - BARBU - onClickHand() - this.nbClic : ', this.nbClic);
            }
            else if(this.nbContracts >= 0 && this.hasClicked === "SOUTH") {
                console.log('01 - BARBU - onClickHand() - alert MOLI : ');

                alert('|| MOLI ||');
            }

        } else {

            //console.log('01 - BARBU - onClickHand() - Domino - this.nbClic : ', this.nbClic);
            console.log('01 - BARBU - onClickHand() -=> !panelVisible = ', !this.state.panelVisible );
            console.log('01 - BARBU - onClickHand() -=> controlDominoPlayerActive = ', this.controlDominoPlayerActive() );
            console.log('01 - BARBU - onClickHand() -=> controlDominoCardPlayed = ', this.controlDominoCardPlayed(key) );

            if( !this.state.panelVisible && this.controlDominoPlayerActive()
                && this.controlDominoCardPlayed(key)) {

                // REMPLIR LE BOARD DU DOMINO.
                this.fillBoardDomino(key);

                // DECREMENTER LA MAIN.
                this.removeOneCardDomino(indexC, key);

                // GESTION DE ARROW.
                this.whichArrow();

                this.nbClic++;

                //console.log('01 - BARBU - onClickHand() Domino - this.nbClic : ', this.nbClic);
            }
            else if (this.hasClicked === "SOUTH") { alert('|| DOMINOPE ||'); }
        }

        if(this.state.positionPicked) {

            this.handleContract();

            // Inside : checkEndof7 & checkEndof28
            this.checkEndOfContract();
        }
    };

    checkContractChoice = (key, contractor) => {

        this.currentChoice = key;
        this.inProgress = true;

        switch (contractor) {
            case "NORTH"    : this.contractsN.push(key); break;
            case "SOUTH"    : this.contractsS.push(key); break;
            case "EAST"     : this.contractsE.push(key); break;
            case "WEST"     : this.contractsW.push(key); break;
            default: break;
        }

        this.lastContract = (this.contractsN.length === 7) ;
        this.lastContract = (this.contractsS.length === 7) ;
        this.lastContract = (this.contractsE.length === 7) ;
        this.lastContract = (this.contractsW.length === 7) ;

    };

    onClickBoard = (key) => {
        console.log('01 - BARBU - onClickBoard() - this.isMaster : ', this.isMaster);

        this.hasClicked = this.isMaster;

        this.checkContractChoice(key, this.isMaster);

        if(key === "Domino") {
            this.hasToPlayDomino = this.isMaster ;
            this.boardDominoVisible = true ;

            switch(this.isMaster) {

                case "NORTH" : this.controlDominoHands(3); break;
                case "SOUTH" : this.controlDominoHands(2); break;
                case "EAST"  : this.controlDominoHands(0); break;
                case "WEST"  : this.controlDominoHands(1); break;

                default : break;
            }

        }

        this.whichArrow();

        if(this.myPosition === this.gameStarted) {
            // WEBSOCKET CAST
            this.click(key);
        }

        this.setState({ panelVisible: false });
        // this.hidePlayersCards = false;

        // console.log('01 - BARBU - Render() - this.allContracts : ', this.allContracts);
        console.log('01 - BARBU - onClickBoard() - CurrentChoice : ', this.currentChoice);
    };

    onClickReplay() {
        
        if(this.partyIsOver) {

            this.displayLoadingPlayers = true;
            this.partyIsOver = false;
        } 

        this.setState(this.state);
        
        // console.log('0101 - BARBU - onClickReplay() - displayLoadingPlayers : ', this.displayLoadingPlayers);
        // console.log('0101 - BARBU - onClickReplay() - partyIsOver : ', this.partyIsOver);
        console.log('0101 - BARBU - onClickReplay()');

    }

    render() {

        console.log("0001 - BARBU - THIS.PROPS.WEBSOCKET : ", this.props.websocket);

        if(this.nbClic === 32) {

            console.log('01 - BARBU - Render() - this.isMaster : ', this.isMaster);
            console.log('01 - BARBU - Render() - this.hasClicked : ', this.hasClicked);
            console.log('O1 - BARBU - Render() - this.hasToPlayDomino : ', this.hasToPlayDomino);

            console.log('01 - BARBU - Render() - this.boardHand : ', this.boardHand);
            console.log('O1 - BARBU - Render() - this.tempoPli : ', this.tempoPli);
            console.log('O1 - BARBU - Render() - this.nbClic : ', this.nbClic);

            console.log('01 - BARBU - sendHands() - this.state.handN : ', this.state.handN);
            console.log('01 - BARBU - sendHands() - this.state.handS : ', this.state.handS);
            console.log('01 - BARBU - sendHands() - this.state.handE : ', this.state.handE);
            console.log('01 - BARBU - sendHands() - this.state.handW : ', this.state.handW);

            console.log('01 - BARBU - Render() - this.plisN : ', this.plisN);
            console.log('01 - BARBU - Render() - this.plisS : ', this.plisS);
            console.log('01 - BARBU - Render() - this.plisE : ', this.plisE);
            console.log('01 - BARBU - Render() - this.plisW : ', this.plisW);

            console.log('01 - BARBU - Render() - this.pointsN : ', this.pointsN);
            console.log('01 - BARBU - Render() - this.pointsS : ', this.pointsS);
            console.log('01 - BARBU - Render() - this.pointsE : ', this.pointsE);
            console.log('01 - BARBU - Render() - this.pointsW : ', this.pointsW);

            console.log('01 - BARBU - Render() - this.gamePointsN : ', this.gamePointsN);
            console.log('01 - BARBU - Render() - this.gamePointsS : ', this.gamePointsS);
            console.log('01 - BARBU - Render() - this.gamePointsE : ', this.gamePointsE);
            console.log('01 - BARBU - Render() - this.gamePointsW : ', this.gamePointsW);

            console.log('01 - BARBU - Render() - this.state.positionPicked : ', this.state.positionPicked);
            console.log('01 - BARBU - Render() - this.state.allContracts : ', this.state.allContracts);
            console.log('01 - BARBU - Render() - this.state.contractor : ', this.state.contractor);

            // console.log('01 - BARBU - Render() - this.state.contractsN : ', this.state.contractsN);
            // console.log('01 - BARBU - Render() - this.state.contractsS : ', this.state.contractsS);
            // console.log('01 - BARBU - Render() - this.state.contractsE : ', this.state.contractsE);
            // console.log('01 - BARBU - Render() - this.state.contractsW : ', this.state.contractsW);

        }

        return (

        <div className="whole">

            <div className="game">

                <nav className="navbar navbar-expand-md navbar-dark bg-dark">

                    <a className="navbar-brand" href="https://github.com/aldofwi/barbuzar">
                    <img
                        src={gitLogo}
                        alt="logo"
                        width={30}
                        height={30}
                        />
                    </a>
           
                    <div className="collapse navbar-collapse" id="navbarColor02">

                        
                        <button type="submit" className="btn btn-dark btn-sm" onClick={() => this.setModalRIsOpen(true)}>Rules</button>

                            <Modal
                                centered
                                size="sm"
                                animation={true}
                                aria-labelledby="contained-modal-title-vcenter"
                                shouldFocusAfterRender={true}
                                shouldCloseOnOverlayClick={true}
                                shouldCloseOnEsc={true}
                                isOpen={this.state.modalRIsOpen}
                                style={customStylesR}
                                ariaHideApp={false}>

                                <Rules />

                                <div align="center">
                                    <button className="btn btn-dark" onClick={() => this.setModalRIsOpen(false)}>Fermer</button>
                                </div>

                            </Modal>

                        <button type="submit" className="btn btn-dark btn-sm" onClick={() => this.setModalSCIsOpen(true)}>ScoreSheet</button>

                            <Modal
                                centered
                                size="sm"
                                animation={true}
                                aria-labelledby="contained-modal-title-vcenter"
                                isOpen={this.state.modalSCIsOpen}
                                style={customStylesS}
                                ariaHideApp={false}>

                                <ScoreSheet
                                    names={this.playersName}
                                    scores={this.currentScore}
                                    totals={this.gamePoints}
                                />

                                <br></br>

                                <div align="center">
                                    <button className="btn btn-dark" onClick={() => this.setModalSCIsOpen(false)}>Fermer</button>
                                </div>

                            </Modal>

                            {
                                this.displayLoadingPlayers ?
                                <button 
                                        type="button" 
                                        className="btn btn-danger btn-sm ml-auto" 
                                        data-toggle="tooltip" 
                                        data-placement="right" 
                                        title={"Connecting People "+this.state.nbPeopleConnected+"/4"}>
                                        {this.getBadgeConnected(this.state.nbPeopleConnected)} 
                                    </button> 
                                    :
                                    <button 
                                        type="button" 
                                        className="btn btn-danger btn-sm ml-auto" 
                                        data-toggle="tooltip" 
                                        data-placement="right" 
                                        title={this.inProgress ? this.currentChoice : "Incoming"}>
                                        {this.getBadgeCC(this.currentChoice)} 
                                    </button> 
                            }

                    </div>
                </nav>

        {
            this.state.nbPeopleConnected !== 4 && this.displayLoadingPlayers
            ?
                // Switch between Loading & PanelVictory.
                <Loading
                    nameofclass={"Card-table"}
                    width={100}
                    height={100}
                    message={" Welcome"}
                    name={this.props.barbuser.name}
                    style={this.props.style}
                />
                : 
                !this.displayLoadingPlayers && this.partyIsOver
                    ?
                    <PanelVictory
                        names={this.playersName}
                        totals={this.gamePoints}
                        style={this.props.style}
                        winner={this.winner}
                        onClickReplayies={this.onClickReplay.bind(this)}
                    />
                :
            <div className='Card-table' style={this.props.style}>

                <div id='top'
                     style={this.boardPosition ? this.styles.eightHand(this.cardSize).hand1 :
                         this.styles.eightHand(this.cardSize).handN}>

                <HandBarbu
                        handId={'handN'}
                        layout={"spread"}
                        cardSize={this.cardSize}
                        hide={this.hidePlayersCards}
                        position={this.state.positionPicked}
                        cards={this.state.handN}
                        flipCard={this.flipped}
                        flopCard={this.flopped}
                        onClickHandies={!this.state.positionPicked ? this.onClickHand.bind(this) : null}
                    />

                <PanelDisplay
                    nameofclass={this.contractor === "NORTH" ? "contractorNameN" : "playerNameN"}
                    content={this.getNameByCardinal("NORTH")}
                />

                </div>

                <div id='right'
                     style={this.boardPosition ? this.styles.eightHand(this.cardSize).hand3 :
                         this.styles.eightHand(this.cardSize).handE}>

                    <HandBarbu
                        handId={'handE'}
                        layout={"spread"}
                        cardSize={this.cardSize}
                        hide={this.hidePlayersCards}
                        position={this.state.positionPicked}
                        cards={this.state.handE}
                        flipCard={this.flipped}
                        flopCard={this.flopped}
                        onClickHandies={!this.state.positionPicked ? this.onClickHand.bind(this) : null}
                    />

                    <PanelDisplay
                        nameofclass={this.contractor === "EAST" ? "contractorNameE" : "playerNameE"}
                        content={this.getNameByCardinal("EAST")}
                    />

                </div>

                <div id='left'
                     style={this.boardPosition ? this.styles.eightHand(this.cardSize).hand4 :
                         this.styles.eightHand(this.cardSize).handW}>

                    <HandBarbu
                        handId={'handW'}
                        layout={"spread"}
                        cardSize={this.cardSize}
                        hide={this.hidePlayersCards}
                        position={this.state.positionPicked}
                        cards={this.state.handW}
                        flipCard={this.flipped}
                        flopCard={this.flopped}
                        onClickHandies={!this.state.positionPicked ? this.onClickHand.bind(this) : null}
                    />

                    <PanelDisplay
                        nameofclass={this.contractor === "WEST" ? "contractorNameW" : "playerNameW"}
                        content={this.getNameByCardinal("WEST")}
                    />

                </div>

                <div id='bottom'
                     style={this.boardPosition ? this.styles.eightHand(this.cardSize).hand2 :
                         this.styles.eightHand(this.cardSize).handS}>

                    <HandBarbu
                        key={ this.id }
                        handId={'handS'}
                        layout={"spread"}
                        cardSize={this.boardPosition ? this.cardSize : this.cardSize * 1.5}
                        hide={!this.state.positionPicked}
                        position={this.state.positionPicked}
                        cards={this.state.handS}
                        flipCard={this.flipped}
                        flopCard={this.flopped}
                        onClickHandies={this.onClickHand.bind(this)}
                    />

                    <PanelDisplay
                        nameofclass={this.contractor === "SOUTH" ? "contractorNameS" : "playerNameS"}
                        content={this.getNameByCardinal("SOUTH")}
                    />

                </div>

                {
                    this.displayLoadingBasic
                        ?
                        <Loading
                        nameofclass={"App"}
                        width={100}
                        height={100}
                        message={"Waiting for Contractor"}
                        />
                        : this.state.panelVisible
                    ?
                <PanelChoice
                    points={this.allPoints}
                    panelVis={this.state.panelVisible}
                    posPicked={this.state.positionPicked}
                    contractor={this.contractor}
                    username={this.props.barbuser.name}
                    contracts={this.allContracts}
                    lastContract={this.lastContract}
                    gameContracts={this.gameContracts}
                    onClickHandies={this.onClickBoard.bind(this)}
                /> :
                        <Arrow
                            nameofclass={this.arrow}
                            width={100}
                            height={100}
                        />
                }

                {
                    this.boardDominoVisible
                    ?
                <BoardDomino
                    layout={"spread"}
                    cardSize={this.cardSize}
                    handSpides={this.handSpides}
                    handHearts={this.handHearts}
                    handClubs={this.handClubs}
                    handDiamonds={this.handDiamonds}
                    style={this.styles.eightHand(this.cardSize).boardDomino}
                    hands={[this.state.loadDominoCards.toJS()]}
                /> : null
                }

                {
                    this.displayLoadingPosition
                    ?
                        <Loading
                            nameofclass={"LoadPosition"}
                            width={100}
                            height={100}
                            message={" Pick Your Position "}
                        />
                        : null
                }

                {
                    !this.displayLoadingBasic
                        ?
                <Board
                    cardBoardN={this.cardN}
                    cardBoardS={this.cardS}
                    cardBoardE={this.cardE}
                    cardBoardW={this.cardW}
                    width={75}
                    cardSize={this.cardSize+10}
                    style={this.styles.eightHand(this.cardSize).board}
                    hands={[this.state.loadCards.toJS()]}
                />
                        : null
                }

            </div>

        }

         </div>

        <div className="chat">

            <Chat
                barbuser={this.props.barbuser.name}
                port={this.props.port}
            />

        </div>



    </div>


        )
    }
}

export default Barbu;