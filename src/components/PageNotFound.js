
import React, { Component } from 'react';
import './PageNotFound.css';

class PageNotFound extends Component {
  render() {
    return (
        <div className="site">
            <div className="sketch">
                <div className="bee-sketch red"></div>
                <div className="bee-sketch blue"></div>
            </div>

            <h1>404:<small>Page Not Found</small></h1>
        </div>
    );
  }
}

export default PageNotFound;
