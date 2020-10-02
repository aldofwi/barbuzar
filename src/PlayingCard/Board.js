import React, { Component} from 'react';
import './Board.css';
//import Hand from "./Hand/Hand";
import PlayingCard from "./PlayingCard";

class Board extends Component {
  constructor(props) {
      super(props);

      this.state = {

          cardBoardN: props.cardBoardN,
          cardBoardS: props.cardBoardS,
          cardBoardE: props.cardBoardE,
          cardBoardW: props.cardBoardW,
          hands: props.hands,
          cardSize: props.cardSize,
          width: this.props.width ? this.props.width : 100,
          style: this.props.style ? this.props.style : {'width': this.state.width + '%'}
      };

      this.deadCards = {};

      this.styles = {
          fourCard: function () {
              return {
                  cardE: {

                      'position': 'absolute',
                      'transform': 'translateY(-200%) translateX(-280%) rotate(180deg)'

                  },
                  cardW: {

                      'position': 'absolute',
                      'transform': 'translateY(-220%) translateX(-520%) rotate(180deg)'

                  },
                  cardN: {

                      'position': 'absolute',
                      'transform': 'translateY(-250%) translateX(-400%) rotate(180deg)'

                  },
                  cardS: {

                      'position': 'absolute',
                      'transform': 'translateY(-130%) translateX(-400%) rotate(180deg)'
                  }
              }
          }
      }
  }

/*
    componentDidUpdate(props) {
        // console.log('03 - BOARD - componentDidUpdate - got board some props: ', props);

        this.setState({
            hands : props.hands,
            cardBoardS: this.props.cardBoardS,
            cardSize : props.cardSize,
            width: props.width ? props.width : 100,
            style: props.style ? props.style : {'width': this.state.width + '%'}
        })
    }
*/

    spreadStyle(num){

        //console.log("03HAND - SPREADSTYLE() -this.over = ", this.over);
        //console.log("03HAND - SPREADSTYLE() -this.initialover = ", this.initialOver);

        if(num > 0){
            this.over -= this.initialOver / (this.handLength - 1);
        }
        return {
            'zIndex' : num,
            'transform' : `translateX(${(-50 + this.over * -1)}%)`
        }
    }

    isCardDead(id) {
        //console.log('card is dead: ', this.deadCards[id] ? this.deadCards[id].dead : false)
        return this.deadCards[id] ? this.deadCards[id].dead : false;
    }

    removeCard(id, style) {

        if(!this.isCardDead(id)) {
            this.deadCards[id] = {
                dead : true,
                style : style //should it keep track of its own style?
            };

            console.log('O3 - HANDS - removeCard() - this.deadCards', this.deadCards[id]);

            // if(this.handLength) { this.handLength--; }

            this.setState(this.state);
            /*let cards = this.state.cards;
            cards.splice(cards.indexOf(id), 1);
             this.setState({
                 cards : cards,
                 cardSize : this.state.cardSize,
                 elevated : this.state.elevated,
                 layout: this.state.layout
            })*/
        }
    }

  render() {
      let index=0;

      // console.log("03 - BOARD - hand[0]: ", this.props.hands[0].hand);

      return (
      <div className="Board" style={this.state.style}>

          <div id='left' style={ this.styles.fourCard(this.cardSize).cardW }>

              <PlayingCard
                  height={this.props.cardSize}
                  width={"auto"}
                  card={this.props.cardBoardW}
                  ref={this.props.cardBoardW}
                  style={this.isCardDead(this.props.cardBoardW) ? this.deadCards[this.props.cardBoardW].style : this.spreadStyle(index++)} //just give it the current index, PlayingCard.js will fix that
                  flipped={this.state.flipped}
                  elevateOnClick={50}
                  zIndex={index}
                  rank={this.state.rank}
              />

          </div>

          <div id='right' style={ this.styles.fourCard(this.cardSize).cardE }>

              <PlayingCard
                  height={this.props.cardSize}
                  width={"auto"}
                  card={this.props.cardBoardE}
                  ref={this.props.cardBoardE}
                  style={this.isCardDead(this.props.cardBoardE) ? this.deadCards[this.props.cardBoardE].style : this.spreadStyle(index++)} //just give it the current index, PlayingCard.js will fix that
                  flipped={this.state.flipped}
                  elevateOnClick={50}
                  zIndex={index}
                  rank={this.state.rank}
              />

          </div>

          <div id='top' style={ this.styles.fourCard(this.cardSize).cardN }>

              <PlayingCard
                  height={this.props.cardSize}
                  width={"auto"}
                  card={this.props.cardBoardN}
                  ref={this.props.cardBoardN}
                  style={this.isCardDead(this.props.cardBoardN) ? this.deadCards[this.props.cardBoardN].style : this.spreadStyle(index++)} //just give it the current index, PlayingCard.js will fix that
                  flipped={this.state.flipped}
                  elevateOnClick={50}
                  zIndex={index}
                  rank={this.state.rank}
              />

          </div>

          <div id='bottom' style={ this.styles.fourCard(this.cardSize).cardS }>

              <PlayingCard
                  height={this.props.cardSize}
                  width={"auto"}
                  card={this.props.cardBoardS}
                  ref={this.props.cardBoardS}
                  style={this.isCardDead(this.props.cardBoardS) ? this.deadCards[this.props.cardBoardS].style : this.spreadStyle(index++)} //just give it the current index, PlayingCard.js will fix that
                  flipped={this.state.flipped}
                  elevateOnClick={50}
                  zIndex={index}
                  rank={this.state.rank}
              />

          </div>

      </div>
    );
  }
}

export default Board;