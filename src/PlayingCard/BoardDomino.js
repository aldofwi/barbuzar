import React, { Component } from 'react' ;
import HandBarbu from "./Hand/HandBarbu" ;
import "./Board.css" ;

class BoardDomino extends Component {

    constructor(props) {
        super(props);

        this.state = {

            layout : props.layout,
            cardSize : props.cardSize,
            hands : props.hands,

            handSpides : props.handSpides,
            handHearts : props.handHearts,
            handClubs : props.handClubs,
            handDiamonds : props.handDiamonds
        };

        this.styles = {
            fourHand: function () {
                return {
                    handSpides: {
                        'position'  : 'absolute',
                        'width'     : props.cardSize + 'px',
                        'transform' : 'translateY(-180%) translateX(-180%) rotate(180deg)'
                    },
                    handHearts: {
                        'position': 'absolute',
                        'width'     : props.cardSize + 'px',
                        'transform': 'translateY(-120%) translateX(-180%) rotate(180deg)'
                    },
                    handClubs: {
                        'position': 'absolute',
                        'width'     : props.cardSize + 'px',
                        'transform': 'translateY(-60%) translateX(-180%) rotate(180deg)'
                    },
                    handDiamonds: {
                        'position': 'absolute',
                        'width'     : props.cardSize + 'px',
                        'transform': 'translateY(0%) translateX(-180%) rotate(180deg)'
                    }
                }
            }
        }

    }

    render() {

        // console.log('01 - BoardDomino - Render() - this.props.handSpides : ', this.props.handSpides);
        // console.log('01 - BoardDomino - Render() - this.props.handHearts : ', this.props.handHearts);
        // console.log('01 - BoardDomino - Render() - this.props.handClubs : ', this.props.handClubs);
        // console.log('01 - BoardDomino - Render() - this.props.handDiamonds : ', this.props.handDiamonds);


        return(

            <div className="BoardDomino" style={this.props.style}>

                <div id='spides' style={ this.styles.fourHand(this.props.cardSize).handSpides }>

                    <HandBarbu
                        handId={'handSpides'}
                        layout={this.props.layout}
                        cards={this.props.handSpides}
                        cardSize={this.props.cardSize}/>
                </div>

                <div id='hearts' style={ this.styles.fourHand(this.props.cardSize).handHearts }>

                    <HandBarbu
                        handId={'handHearts'}
                        layout={this.props.layout}
                        cards={this.props.handHearts}
                        cardSize={this.props.cardSize}/>

                </div>

                <div id='clubs' style={ this.styles.fourHand(this.props.cardSize).handClubs }>

                    <HandBarbu
                        handId={'handClubs'}
                        layout={this.props.layout}
                        cards={this.props.handClubs}
                        cardSize={this.props.cardSize}/>

                </div>

                <div id='diamonds' style={ this.styles.fourHand(this.props.cardSize).handDiamonds }>

                    <HandBarbu
                        handId={'handDiamonds'}
                        layout={this.props.layout}
                        cards={this.props.handDiamonds}
                        cardSize={this.props.cardSize}/>

                </div>

            </div>

        );

    }

}

export default BoardDomino;