import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';

export default class Browser extends Component {
    render() {
        return (
            <div className="browser browser-container">
                <div className="browser-row">
                    <div className="browser-column browser-left">
                        <span className="browser-dot" style={{"background": "#ED594A"}}></span>
                        <span className="browser-dot" style={{"background": "#FDD800"}}></span>
                        <span className="browser-dot" style={{"background": "#5AC05A"}}></span>
                    </div>
                    <div className="browser-column browser-middle">
                        <div className='browser'>&nbsp;</div>
                    </div>
                    <div className="browser-column browser-right">
                        <div style={{"float": "right"}}>
                            <span className="browser-bar"></span>
                            <span className="browser-bar"></span>
                            <span className="browser-bar"></span>
                        </div>
                    </div>
                </div>

                <div className="browser-content">
                    <Image size='massive' centered src='/splash.png' />
                </div>
            </div>
        );
    }
}