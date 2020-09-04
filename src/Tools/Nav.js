import React from 'react';
import '../index.css';
import ReactDOM from "react-dom";

function Nav() {

    return (
        <nav>
            <h3>BB</h3>
            <ul className="nav-links">
                <li>ScoreSheet</li>
            </ul>
        </nav>
    );
}

// ========================================

ReactDOM.render(<Nav />, document.getElementById("root"));

// ========================================

export default Nav;