import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import { checkIn} from '../queries/queries';

class CheckIn extends Component {
    render() {
        this.props.checkIn({
            variables: {
                attendeeId: this.props.match.params.id
            }
        }).catch(err => {
            console.log(err);
        }).then(({data}) => {
            if (data && data.checkIn && data.checkIn.id) {
                const url = '/candidate/' + data.checkIn.id;
                this.props.history.push(url);
            }
        });
        return '';
    }
}

export default withRouter(compose(graphql(checkIn, {name: 'checkIn'}))(CheckIn));