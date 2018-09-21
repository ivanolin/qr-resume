import React, { Component } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class DataRow extends Component {
	constructor(props) {
		super(props);
        this.viewDetails = this.viewDetails.bind(this);
        this.setOutFocus = this.setOutFocus.bind(this);
        this.setInFocus = this.setInFocus.bind(this);
        this.state = {
            rowStyle: {
                cursor: 'default'
            }
        }
	}

	viewDetails() {
        console.log(this.props.candidate);
		this.props.history.push('/candidate/' + this.props.candidate._id);
    }
    
    setInFocus() {
        this.setState({
            rowStyle: {
                cursor: 'pointer'
            }
        });
    }

    setOutFocus() {
        this.setState({
            rowStyle: {
                cursor: 'default'
            }
        });
    }

	render() {
		const {candidate} = this.props;
		return (
			<Table.Row
                style={this.state.rowStyle} 
                onMouseEnter={this.setInFocus} 
                onMouseLeave={this.setOutFocus}
                onClick={this.viewDetails}
            >
				<Table.Cell>{candidate.identity.firstName}</Table.Cell>
				<Table.Cell>{candidate.identity.lastName}</Table.Cell>
				<Table.Cell>{candidate.education.school}</Table.Cell>
				<Table.Cell>{candidate.education.major}</Table.Cell>
                <Table.Cell>{candidate.education.gradYear}</Table.Cell>
				<Table.Cell>{candidate.education.gpa}</Table.Cell>
                <Table.Cell positive><Icon name='checkmark' />Interested</Table.Cell>
			</Table.Row>
		);
	}
}

export default withRouter(DataRow);