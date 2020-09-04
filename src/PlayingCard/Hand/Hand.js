import React, { Component} from 'react';
import './Hand.css';
import PlayingCard from '../PlayingCard';

class Hand extends Component {

    constructor(props) {
        super(props);
        console.assert(Array.isArray(this.props.cards), 'Hands must have cards, even as an empty array');

        this.state = {
            rank : this.props.rank,
          flipped : this.props.flipped,
          cards : this.props.cards,
          cardSize : this.props.cardSize,
          handSize : this.props.handSize,
          elevated : this.props.elevated,
          layout: this.props.layout,
        };
        this.deadCards = {};
        this.handLength = this.props.cards.length;
    }

    componentWillReceiveProps(props) {
        // console.log("03 - HAND - componentWillReceiveProps()");

        this.setState({
            rank : props.rank,
            flipped : props.flipped,
            cards : props.cards,
            cardSize : props.cardSize,
            handSize : this.props.handSize,
            elevated : props.elevated,
            layout: props.layout,
        });
        this.handLength = this.state.cards.length;
    }

    resetStack(){
        this.over = 50;
    }

    resetSpread(){
        this.initialOver = 110 * (this.handLength - 1);
        this.over = this.initialOver / 2;
    }

    resetFanning(){
        //console.log("03HAND - RESETFANNING()");
        this.curl = Math.pow(this.handLength, 1.30) * 10; //curl of cards in hand
        this.deg = this.props.cards.length > 1 ? -this.handLength * 15 : 0;
        this.degs = this.deg / 2;
        this.initialDown = this.handLength * 7;
        this.down = this.initialDown / 2;
        this.initialOver = this.curl;
        this.over = this.initialOver / 2;
    }

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

    fanStyle(num) {
        //console.log("handlength", this.handLength);
        //console.log("num", num);

        let overHalf = num > (this.handLength - 1) / 2;
        if (false && process.env.NODE_ENV !== "production") {
            console.log('degs', this.degs);
            console.log('over', this.over);
            console.log('down', (this.over ? -this.down : this.down));
            console.log('num: ', num)
        }
        if (num > 0) {
            this.degs -= this.deg / (this.handLength - 1);
            this.down -= this.initialDown / (this.handLength - 1);
            this.over -= this.initialOver / (this.handLength - 1);
        }
        return {
            'zIndex' : num,
            'transform': `translateY(${(overHalf ? -this.down : this.down)}%) 
            translateX(${(-50 + this.over * -1)}%) 
            rotate(${this.degs}deg)` }
    }

    stackStyle(num){
        if(num > 0){
            this.over -= 20 / this.handLength
        }
        return {
            'zIndex' : num,
            'transform' : `translateX(${(this.over * -1)}%)`
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

            if(this.handLength) { this.handLength--; }

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

    onDragStop(key) {
        console.log(this);
        // console.log('style: ', )
        // console.log('reviving: ', key);

        // this.refs[key].state.draggableDivStyle = {"transitionDuration": "0.25s"}
        let cardToSpliceInto = this.state.cards[this.indexToInsertInto(key) + 1];
        this.refs[key].state.position = {x : this.refs[key].getBindingClientRect().x, y : this.refs[key].getBindingClientRect().y}

        console.log('card to splice into: ', cardToSpliceInto);
        this.state.cards.splice(this.state.cards.indexOf(key), 1);
        this.state.cards.splice(this.indexToInsertInto(key), 0, key);

        if(this.deadCards[key]) {
            this.deadCards[key].dead = false;
            this.handLength++;
            this.setState(this.state);
        }

    }

    onDrag(key) {
        // console.log("draggin: ");
        // // add a dup card into the hand?
        // let newIndexToSpliceInto = this.state.cards[this.indexToInsertInto(key) + 1]
        // if(this.previousIndexToSpliceInto !== newIndexToSpliceInto) {
        //     this.previousIndexToSpliceInto = newIndexToSpliceInto
        //     this.state.cards.splice(this.previousIndexToSpliceInto, 1);
        //     this.state.cards.splice(this.previousIndexToSpliceInto, 0, key);
        //     this.setState(this.state);
        // }
    }

    onDragStart(key) {
        this.removeCard(key, this.refs[key].state.style);
    }

    indexToInsertInto(key) {
        let indexToInsertInto = 0;
        let xPositionOfKey = this.refs[key].getBindingClientRect().x;
        for(let i = 0; i < this.state.cards.length; i++) {
            if(this.state.cards[i] === key) {
                continue;
            }
            console.log('xCard ', this.state.cards[i], ' : ', this.refs[key].getBindingClientRect().x)
            if(xPositionOfKey < this.refs[this.state.cards[i]].getBindingClientRect().x) {
                return indexToInsertInto;
            } else {
                indexToInsertInto++;
            }
        }
        return indexToInsertInto;
    }

    render() {
        let index = 0;

        this.resetSpread();
        this.styleType = this.spreadStyle;

        // const { handleClickCard } = this.props;

        // console.log("03 - HAND - RENDER() - layout : ", this.state.layout);
        // console.log("03 - HAND - RENDER() this.state - ", this.state);
        // console.log("03 - HAND - RENDER() this.props - ", this.props);

        return (

            <div className={'Hand'} style={{
              'height': this.state.layout === 'stack' ?
                  this.state.cardSize : this.state.cardSize * 2,
              'width': "auto" }} >
            {
                this.state.cards.map((card, key) => {

                    return (
                        <PlayingCard
                            //onFlip={this.onClickHand.bind(card)}

                            onDragStart={this.onDragStart.bind(this)}
                            onDragStop={this.onDragStop.bind(this)}
                            onDrag={this.onDrag.bind(this)}
                            removeCard={this.removeCard.bind(this)}
                            height={this.state.cardSize}
                            width={"auto"}
                            card={card}
                            ref={card}
                            style={this.isCardDead(card) ? this.deadCards[card].style : this.styleType(index++)} //just give it the current index, PlayingCard.js will fix that
                            flipped={this.state.flipped}
                            elevateOnClick={50}
                            zIndex={index}
                            key={key}
                            rank={this.state.rank}

                            //onClickCard={this.onClickHand.bind(this)}
                            //onClickCard={() => handleClickCard(card)}
                        />
                    )
                })
            }
          </div>
        )
    }
}
export default Hand;


/*

        //if (index > -1) {  }
        //this.setState({ handS: handCurrent });
        //listIndex = listIndex.filter(item => item > -1);
        //console.log('O1 - BARBU - removeOne() index : ', index);
        //console.log('O1 - BARBU - removeOne() handCurrent : ', handCurrent);
        // this.state[hand].pop()
        // this.setState({[hand] : this.state[hand]});

        ONCLICK
        if (key.hand === 'handS') {
            console.log("01 - BARBU - ONCLICK() - loadingCards: ", key.card);
            //don't change state
            //this.socket.emit('loadCards', key.card);
        }

        if (key.hand === 'draw') {
            console.log("01 - BARBU - ONCLICK() - drawing");
            //this.socket.emit('draw');
        }

        if (key.hand === 'loadCards') {
            console.log("01 - BARBU - ONCLICK() - drawing from loadCards");
            //this.socket.emit('drawFromDiscard');
        }

        //     }, function(){
        //         console.log(this.state.handS);
        //     })
        // }
        // if (key.hand === 'loadCards') {
        //     console.log(this.state.loadCards);
        //     let index = this.state.loadCards.hand.indexOf(key.card);
        //     this.setState({
        //         handS: this.state.get('handS').push(key.card) && this.state.handS,
        //         loadCards : {
        //             hand : this.state.loadCards.hand.splice(index, 1) && this.state.loadCards.hand,
        //             handId : "loadCards",
        //             hide : false
        //
        //         }
        //     }, function(){
        //         console.log(this.state.handS);
        //     })
        // }

        /*
        //this.onClickHand = this.onClickHand.bind(this);
        //this.fillBoard = this.fillBoard.bind(this);
        //this.socket = io(process.env.REACT_APP_SOCKET_SERVER);//openSocket('http://localhost:8000');

        this.socket.on('state', newState => {
         */

// var loadCards = {...this.state.loadCards};
// var draw = {...this.state.draw};
// loadCards.hand = newState.loadCards;
// draw.hand = newState.draw;
// console.log("loadCards: ", loadCards.hand);
// console.log("draw: ", draw.hand);
// this.state.loadCards.hand.push(newState.loadCards[0]); //have to do this stupid stuff, should just use immutable
// this.state.draw.hand.push(newState.draw[0]);
// console.log('got players: ', newState.players);
// console.log('got state: ', newState);
/*
           const newStateFull = {
              handN : newState.players.opponentState0 && newState.players.opponentState0.primaryHand || [], //change this to an array of opponents
               handNW : newState.players.opponentState1 && newState.players.opponentState1.primaryHand || [], //change this to an array of opponents
               handNE : newState.players.opponentState2 && newState.players.opponentState2.primaryHand || [],
               handE : newState.players.opponentState3 && newState.players.opponentState3.primaryHand || [],
               handSE : newState.players.opponentState4 && newState.players.opponentState4.primaryHand || [],
               handSW : newState.players.opponentState5 && newState.players.opponentState5.primaryHand || [],
               handW : newState.players.opponentState6 && newState.players.opponentState6.primaryHand || [],
               handS : newState.players.playerState.primaryHand || [],

               loadCards : this.state.loadCards.set("hand", newState.loadCards),
               draw : this.state.draw.set("hand", newState.draw)
           };

           console.log("newState: ", JSON.stringify(newStateFull));
           this.setState(newStateFull);
       });
*/
// this.cardSize = props.cardSize
// this.deck = new Deck();
