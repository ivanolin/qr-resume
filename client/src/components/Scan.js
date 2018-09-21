import React, { Component } from 'react';
import { Grid, Button, Card, Dimmer, Loader, Message } from 'semantic-ui-react';
import QrCode from 'qrcode-reader';
import { withRouter } from 'react-router-dom';
import { compose, graphql } from 'react-apollo';
import { checkIn } from '../queries/queries';

class Scan extends Component {
    constructor(props) {
        super(props);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.state = {
            loading: false,
            error: null
        }
    }

    handleFileChange(e) {
        this.setState({
            loading: true
        });
        
        /**
         * Instantiate the QrCode library and FileReader for image
         * scanning.
         */
        const reader = new FileReader();
        const qr = new QrCode();

        /**
         * Set the method to fire when QR scanning is done
         * @param {Object} err 
         * @param {Object} value 
         */
        qr.callback = async (err, value) => {
            if (err) {
                console.error('Cannot detect QR Code', err);
                this.setState({
                    error: 'Could not detect QR Code. Try Again.',
                    loading: false
                });
                return;
            }
            console.log('QR Code found: ', value.result);
            if (value.result.includes('http://')) {
                const url = value.result.replace(window.location.protocol + '//' + window.location.host, '');
                this.props.history.push(url);
            }
        }

        /**
         * Listen for the load event when an image is selected
         */
        reader.addEventListener('load', () => {
            /**
             * Scan the selected image
             */
            qr.decode(reader.result);
        }, false);

        /**
         * Check if file exists and read the file as a DataURI
         */
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    render() {
        return (
            <Grid centered>
                <Dimmer active={this.state.loading}>
                    <Loader size='large'>Scanning Code...</Loader>
                </Dimmer>
                <Grid.Row centered style={{marginTop: '30vh'}}>
                    <Grid.Column width={10} textAlign='center'>
                        {this.state.error ? <Message size='huge' compact error header={'Could not detect code.'} /> : ''}
                        <Card centered>
                            <Card.Content>
                                <Button as='label' fluid color="green" size='huge' htmlFor='image_input'>
                                    Scan a new code
                                </Button>
                                <input type='file' id='image_input' style={{display: 'none'}} onChange={this.handleFileChange}/>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}
export default withRouter(compose(graphql(checkIn, {name: 'checkIn'}))(Scan));