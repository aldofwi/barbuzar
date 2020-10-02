import React, { Component } from 'react';

import './PlayingCard.css';

import PlayingCardsList from './PlayingCardsList';



class PlayingCard extends Component {

    constructor(props){
        super(props);

        this.state = {
            flipped : props.flipped || props.card === 'hide',
            card : props.card,
            height : props.height,
            flippable : props.flippable,
            elevated : props.elevated,
            style : this.props.style,
            position : {x : 0, y : 0},
            draggableDivStyle : {"zIndex":this.props.zIndex}
        }

    }

    // DO NOT WORK : componentDidUpdate = () => {
    // DO NOT WORK : componentDidMount = () => {
    // DO NOT WORK : componentDidCatch = () => {

    UNSAFE_componentWillReceiveProps = (props) => {

        this.setState({
            flipped : props.flipped,
            card : props.card,
            height : props.height,
            flippable : props.flippable,
            elevated : props.elevated,
            style : props.style,
            position : {x : 0, y : 0}
        })
    };

    elevate(percent){
        console.log(this.state);
        if(this.state.elevated) percent = -percent;
        let style = this.state.style;
        let translateY = style.transform.match(/translateY\((.*?)\)/); //pull out translateY
        if(translateY){
            let newTranslateY = Number(translateY[1].slice(0, -1)) - percent; //add 50%
            style.transform = style.transform.replace(/translateY(.*)/, `translateY(${newTranslateY}%)`)
        }else{
            style.transform += `\ntranslateY(${-percent}%)`
        }
        this.setState({style : style,
            elevated : !this.state.elevated})
    }

    onDragStart(e) {
        this.setState({draggableDivStyle: {"zIndex":"999", "position" : "fixed"}});

        e.preventDefault(); //fixes desktop drag image issue

        console.log('style: ', this.state.style);
        if(this.state.style && this.state.style.transform) {
            if(this.state.style.transform.indexOf('rotate') !== -1) {
                console.log('derotating');
                //let transform = this.state.style.transform.slice(0, -1); //copy it
                //this.state.style.transform = transform.replace(/rotate(.*)/, 'rotate(0)');
                this.setState(this.state);
            }
            console.log('************ transforming');
            // let newStyle = {transform :  this.state.style.transform.replace(/rotate(.*)/, 'rotate(0)')};
            this.props.removeCard(this.state.card, this.state.style);
        }
        this.props.onDragStart(this.state.card);
        console.log('start');
    }

    onDrag() {
        this.props.onDrag(this.state.card);
    }

    onDragStop() {
        //if within range of a hand that accepts cards, then drop there
        //else return to current hand
        // console.log('************** drag stop style: ', this.refs['1h'].state.x);

        // setTimeout(function() {
        //     this.state.draggableDivStyle = //{"transitionDuration": "0.25s",
        //         {}
        // }, 100)
        // this.state.draggableDivStyle = {"transitionDuration": "1s"}
        this.setState({ draggableDivStyle: {"zIndex":this.props.zIndex, "position" : "fixed"}});

        this.props.onDragStop(this.state.card);

    }

    getBindingClientRect() {
        // return ReactDOM.findDOMNode(this.refs[this.state.card]).getBoundingClientRect()
    }

    render() {

        // TODO : rajouter le BACK OF CARDS
        PlayingCardsList.flipped = require('./CardImages/b.svg');
        // console.log("04 - PLAYINGCARDS - RENDER() this.state. - ", this.state);
        // console.log("04 - PLAYINGCARDS - RENDER() PlayingCardsList = ", PlayingCardsList);

        const { onClickCard } = this.props;

          return (
                  <div className="hand hhand" style={this.state.draggableDivStyle}>

                    <img
                      ref={this.state.card}
                      style={this.state.style}
                      height={this.state.height}
                      className='Playing-card'
                      src={this.state.flipped === true ? PlayingCardsList.flipped : PlayingCardsList[this.state.card]}
                      alt={this.state.flipped === true ? 'HiddenCard' : PlayingCardsList[this.state.card]}

                      onClick={() => onClickCard(this)}
                      // onClick={this.onClick.bind(this)}
                    />

                  </div>
            );
    }
}

// ========================================

// ReactDOM.render(<PlayingCard />, document.getElementById("root"));

// ========================================

export default PlayingCard;