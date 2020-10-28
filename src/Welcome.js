import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Gameplay from './Gameplay';


class Welcome extends Component {

    constructor(props){
        super(props);

        this.nameSubmit = false;
    }

    componentDidMount() {
        console.log('O1 - WELCOME - componentDidMount()');
    }

    handleChange = event=> {
        console.log('O1 - WELCOME - handleChange() - event name : ', event.target.value);
        this.setState({username: event.target.value})
    };

    handleSubmit() {
        console.log('O1 - WELCOME - handleSubmit() - username : ', this.state.username);

        this.preventDefault();
        this.barbuser.name = this.state.username;
        this.nameSubmit = true;
    };

    render() {

        return (

            <div>
            {
                !this.nameSubmit ?

                <div className="welcome">
                    <form className="form-inline" onSubmit={this.handleSubmit}>
                        <div className="nameform">
                            
                            <input type="text" className="form-control" placeholder="Username" onChange={this.handleChange} id="nameValue" required />
                            <button type="submit" className="btn btn-danger">Play</button>
                        </div>
                    </form>
                </div>
                :
                <Gameplay username={this.barbuser.name} />
            }
            </div>
        )
    }
}

// ========================================

ReactDOM.render(<Welcome />, document.getElementById("root"));

// ========================================

export default Welcome;
