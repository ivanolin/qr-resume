import React, { Component, Fragment } from 'react';
import { Grid, Header, Icon } from 'semantic-ui-react';
import Browser from './Browser';

export default class Landing extends Component {
	render() {
		return (
			<Fragment >
				<Browser/>
				<Header size='huge' textAlign='center'>Get the candidates you want. Without the hassle.</Header>
				<Grid>
					<Grid.Row centered>
						<Grid.Column width={5} textAlign='center' style={{padding: '3rem'}}>
							<Header as='h2' icon style={{fontSize: '25px'}}>
								<Icon name='users' style={{color: '#999999'}}/>
								No paper? No problem.
								<Header.Subheader style={{marginTop: '1rem', fontSize: '17px'}}>Candidates input their information into our system, so everything is digital and easily searchable</Header.Subheader>
							</Header>
						</Grid.Column>
						<Grid.Column width={5} textAlign='center' style={{padding: '3rem'}}>
							<Header as='h2' icon style={{fontSize: '25px'}}>
								<Icon name='qrcode' style={{color: '#999999'}}/>
								World class speed.
								<Header.Subheader style={{marginTop: '1rem', fontSize: '17px'}}>A QR code is generated for each candidate, which the recruiter then scans to get candidate information.</Header.Subheader>
							</Header>
						</Grid.Column>
						<Grid.Column width={5} textAlign='center' style={{padding: '3rem'}}>
							<Header as='h2' icon style={{fontSize: '25px'}}>
								<Icon name='dashboard' style={{color: '#999999'}}/>
								Advanced Filtering
								<Header.Subheader style={{marginTop: '1rem', fontSize: '17px'}}>No more sifting through paper resumes. Use advanced filtering to get the top candidates you want.</Header.Subheader>
							</Header>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column>
							
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Fragment>
    );
	}
}