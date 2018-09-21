import React, { Component } from 'react';
import { Grid, Card, Form, Header, Input } from 'semantic-ui-react';
// import graphql from 'graphql-anywhere';

export default class Account extends Component {
	constructor(props) {
		super(props);
		this.submit = this.submit.bind(this);
		this.state = {
			loading: false
		}
	}

	submit() {
		this.setState({ loading: true });
	}

	render() {
		return (
			<Grid centered>
				<Grid.Row centered>
					<Grid.Column width={8}>
						<Card centered fluid style={{ marginTop: '12rem' }}>
							<Card.Content>
								<Card.Header textAlign="center" style={{ padding: '1rem 0 1rem 0' }}>
									<Header as='h1'>Account Details</Header>
								</Card.Header>
								<Card.Content>
									<Form className='attached' style={{ marginBottom: '1rem' }} onSubmit={this.submit}>
										<Form.Field>
											<label>Username/Email</label>
											<Input name="username" size='large' placeholder="john@example.com" />
										</Form.Field>
										<Form.Field>
											<label>Compamny</label>
											<Input name="company" size='large' placeholder="American Express" />
										</Form.Field>
										{/* { this.state.error ? <Message error header='Login Error' content={this.state.error.message} /> : ''} */}
										<Form.Button size='big' primary loading={this.state.loading}>Save</Form.Button>
									</Form>
								</Card.Content>
							</Card.Content>
						</Card>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)
	}
}

//export default compose(graphql(accountDetails))(Account);