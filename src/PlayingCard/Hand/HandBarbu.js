import React, { Component} from 'react';
import './Hand.css';
import PlayingCard from '../PlayingCard';
//import ReactDOM from 'react-dom';

class HandBarbu extends Component {

    constructor(props) {
        super(props);
        console.assert(Array.isArray(this.props.cards), 'Hands must have cards, even as an empty array');

        this.state = {
            cards : this.props.cards,
            hide : this.props.hide,
            handId : this.props.handId,
            cardSize : this.props.cardSize,
            elevated : this.props.elevated,
            layout : this.props.layout,
            flipCard : this.props.flipCard,
            flopCard : this.props.flopCard,
            position : this.props.position,
        };
        this.deadCards = {};
        this.flippedCards = {};
        this.handLength = this.props.cards.length;
        // console.log('02 - HANDBARBU - constructor | this.props.flipCard : ', this.props.flipCard);
    }

    componentDidUpdate = () => {
        // console.log('02 - HANDBARBU - componentDidUpdate() - this.props.flipCard : ', this.props.flipCard);

        if(this.props.flipCard !== "") { this.flipCard(this.props.flipCard); }

        //if(this.props.flopCard !== "") { this.flopCard(this.props.flopCard); }

    };

    elevateOne(card){

    }
    resetStack(){
        //console.log('02 - HANDBARBU - Reseting STACKING');

        this.over = 50;
    }
    resetSpread(){
        //console.log('02 - HANDBARBU - Reseting SPREADING');

        this.initialOver = 110 * (this.handLength - 1);
        this.over = this.initialOver / 2;
        this.below = this.initialOver + 62;

    }
    resetFanning(){
        //console.log('02 - HANDBARBU - Reseting FANNING');

        this.curl = Math.pow(this.handLength, 1.30) * 10; //curl of cards in hand
        this.deg = this.props.cards.length > 1 ? -this.handLength * 15 : 0;
        this.degs = this.deg / 2;
        this.initialDown = this.handLength * 7;
        this.down = this.initialDown / 2;
        this.initialOver = this.curl;
        this.over = this.initialOver / 2;
    }

    spreadStyle(num, card){
        //console.log('02 - HANDBARBU - spreadStyle() this.below :', this.below);

        // GESTION DU CONTRAT 'DOMINO'.
     if( this.props.handId === 'handSpides' || this.props.handId === 'handHearts' ||
         this.props.handId === 'handClubs' || this.props.handId === 'handDiamonds') {

         if( card.charAt(0) === 't' || card.charAt(0) === '9' ||
             card.charAt(0) === '8' || card.charAt(0) === '7' ) {

             // ORIGINAL CODE
             if(num > 0){
                 this.below -= this.initialOver / (this.handLength - 1);
             }
             return {
                 'zIndex' : num,
                 'transform' : `translateX(${(50 + this.below * 1)}%)`
             };


         } else {
             // ORIGINAL CODE : AKQJ
             if(num > 0){
                 this.over -= this.initialOver / (this.handLength - 1);
             }
             return {
                 'zIndex' : num,
                 'transform' : `translateX(${(-50 + this.over * -1)}%)`
             };
         }


        } else {
            // ORIGINAL CODE
            if(num > 0){
                this.over -= this.initialOver / (this.handLength - 1);
            }
            return {
                'zIndex' : num,
                'transform' : `translateX(${(-50 + this.over * -1)}%)`
            };
        }
    }
    fanStyle(num) {
        console.log("02 - HANDBARBU - handLength : ", this.handLength);
        console.log("02 - HANDBARBU - num : ", num);

        let overHalf = num > (this.handLength - 1) / 2;
        if (false && process.env.NODE_ENV !== "production") {
            console.log('02 - HANDBARBU - degs : ', this.degs);
            console.log('02 - HANDBARBU - over : ', this.over);
            console.log('02 - HANDBARBU - down : ', (this.overHalf ? -this.down : this.down));
            console.log('02 - HANDBARBU - num : ', num)
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
            'spacing' : '25%',
            'transform' : `translateX(${(this.over * -5)}%)`
        }
    }

    isCardDead(id) {

        // console.log('02 - HANDBARBU - card ', id, ' is dead: ', this.deadCards[id] ? this.deadCards[id].dead : false)
        return this.deadCards[id] ? this.deadCards[id].dead : false;
    }

    isCardFlipped(id) {
        // console.log('02 - HANDBARBU - isCardFlipped() - card ', id, ' is flipped: ', this.flippedCards[id] ? this.flippedCards[id].flipped : false);

        return this.flippedCards[id] ? this.flippedCards[id].flipped : false;
    }

    flipCard(id) {
        // console.log('02 - HANDBARBU - FLIPCARD() - card ', id);

        if(!this.isCardFlipped(id)) {

            this.flippedCards[id] = { flipped : true };
            this.setState(this.state);
        }

    }

    flopCard(id) {
        // console.log( '02 - HANDBARBU - FLOPCARD(', id, ')' );

        this.flippedCards[id] = { flipped : false };
        this.setState(this.state);

    }

    removeCard(id, style) {

        if(!this.isCardDead(id)) {
            this.deadCards[id] = {
                dead : true,
                style : style //should it keep track of its own style?
            };

            // console.log('02 - HANDBARBU - removeCard - this.deadCards : ', this.deadCards);
            if(this.handLength) {
                this.handLength--;
            }
            this.setState(this.state);
            // let cards = this.state.cards;
            // cards.splice(cards.indexOf(id), 1);
            // this.setState({
            //     cards : cards,
            //     cardSize : this.state.cardSize,
            //     elevated : this.state.elevated,
            //     layout: this.state.layout
            // })
        }

    }

    onDragStop(key) {
        console.log(this);
        // console.log('style: ', )
        console.log('02 - HANDBARBU - ONDRAGSTOP - reviving: ', key);

        // this.refs[key].state.draggableDivStyle = {"transitionDuration": "0.25s"}
        let cardToSpliceInto = this.state.cards[this.indexToInsertInto(key) + 1];
        this.refs[key].state.position = {x : this.refs[key].getBindingClientRect().x, y : this.refs[key].getBindingClientRect().y}
        console.log('02 - HANDBARBU - ONDRAGSTOP - card to splice into: ', cardToSpliceInto);
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
            console.log('02 - HANDBARBU - indexToInsertInto - xCard ', this.state.cards[i], ' : ', this.refs[key].getBindingClientRect().x)
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

        if(this.state.layout === 'fan'){

            this.resetFanning();
            this.styleType = this.fanStyle;
        }
        else if(this.state.layout === 'spread'){

            this.resetSpread();
            this.styleType = this.spreadStyle;

        }
        else if(this.state.layout === 'stack'){

            this.resetStack();
            this.styleType = this.stackStyle;
        }

        const { onClickHandies } = this.props;

        // console.log('02 - HANDBARBU - render() - this.props.cardSize : ', this.props.cardSize);
        // console.log('02 - HANDBARBU - render() - this.flippedCards : ', this.flippedCards);
        // console.log('02 - HANDBARBU - render() - this.isCardFlipped(', this.props.flipCard, ') : ', this.isCardFlipped(this.props.flipCard));
        // console.log('02 - HANDBARBU - render() - this.isCardFlipped(', this.props.flopCard, ') : ', this.isCardFlipped(this.props.flopCard));

        // console.log('02 - HANDBARBU - Render() - this.props.style : ', this.props.style);
        // console.log('02 - HANDBARBU - Render() state.cards: ', this.state.cards);
        // console.log('02 - HANDBARBU - Render() state.layout: ', this.state.layout);
        // console.log('02 - HANDBARBU - Render() refs', this.refs);

        return (
            <div
                className={'Hand hhand active-hand'}
                style={{ 'height': this.state.layout === 'stack' ? this.state.cardSize : this.state.cardSize * 2}} >
                {
                    this.props.cards.map((card) => {

                        return (
                            <PlayingCard
                                onDragStart={this.onDragStart.bind(this)}
                                onDragStop={this.onDragStop.bind(this)}
                                onDrag={this.onDrag.bind(this)}
                                removeCard={this.removeCard.bind(this)}
                                flopCard={this.flopCard.bind(this)}
                                flipCard={this.flipCard.bind(this)}
                                ref={card}
                                height={ this.props.cardSize }
                                card={ card }
                                style={this.isCardDead(card) ? this.deadCards[card].style : this.styleType(index++, card)} //just give it the current index, PlayingCard.js will fix that
                                flipped={this.isCardFlipped(card) && !this.props.position ? this.styleType(0, card) : this.props.hide}
                                elevateOnClick={50}
                                zIndex={index}
                                key={card}

                                onClickCard={() => onClickHandies(card)}
                            />
                        )
                    })
                }
            </div>
        )
    }
}

export default HandBarbu;
