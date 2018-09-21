import React, { Component } from 'react';
import { Grid, Card, Form, Header, Input, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { graphql, compose, ApolloConsumer } from 'react-apollo';
import { boothSignup } from '../queries/queries';
import { Redirect } from 'react-router-dom';
import * as auth from '../auth';

class BoothRegister extends Component {
	constructor(props) {
		super(props);
		this.handleFormInputChange = this.handleFormInputChange.bind(this);
		this.register = this.register.bind(this);
		this.state = {
			username: '',
			password: '',
			company: '',
			success: false,
			error: false,
			loading: false
		}
	}

	/**
	 * Handle form input change
	 * @param {Event} e 
	 */
	handleFormInputChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	/**
	 * Attempt to regsiter a new booth and retrieve JWT and login
	 */
	async register() {
		// Set loading state
		this.setState({loading: true});

		// Attemp registration
		await this.props.boothSignup({
			mutation: boothSignup,
			variables: {
				username: this.state.username,
				password: this.state.password,
				company: this.state.company
			}
		}).then(({data}) => {
			// Extract token
			const {token} = data.boothSignup;

			// Check if token is null or empty
			if (!token)
				return this.setState({password: '', error: {message: 'An error occured during registration.'}, loading: false});

			// Set token to local storage
			auth.setToken(token);
			this.setState({success: true});
		}).catch(err => {
			// Get and set error state
            const [{message}] = err.graphQLErrors;
            return this.setState({password: '', error: {message}, loading: false});
		});

		
	}

	/**
	 * Render the component
	 */
	render() {
		// Redirect if login successful or token exists in storage
		if (this.state.success || auth.getToken()) {
			return <Redirect to='/dashboard' />
		}
			
		return (
			<ApolloConsumer>
				{client => (
				<Grid centered>
					<Grid.Row centered>
						<Grid.Column width={8}>
							<Card centered fluid style={{ marginTop: '12rem' }}>
								<Card.Content>
									<Card.Header textAlign="center" style={{ padding: '1rem 0 1rem 0' }}>
										<Header as='h1'>Company Booth Register</Header>
									</Card.Header>
									<Card.Content>
										<Form error={this.state.error ? true : false} 
											loading={this.state.loading} 
											className='attached' 
											style={{ marginBottom: '1rem' }} 
											onSubmit={this.register}
										>
											<Form.Field>
												<label>Username/Email</label>
												<Input name="username" size='large' placeholder="john@example.com" onChange={this.handleFormInputChange}/>
											</Form.Field>
											<Form.Field>
												<label>Password</label>
												<Input name="password" value={this.state.password} size='large' placeholder="*********" type='password' onChange={this.handleFormInputChange}/>
											</Form.Field>
											<Form.Field>
												<label>Company</label>
												<Input name="company" size='large' placeholder="American Express" type='text' onChange={this.handleFormInputChange}/>
											</Form.Field>
											{ this.state.error ? <Message error header="Registration Error" content={this.state.error.message} /> : ''}
											<Form.Button size='big' fluid color="green">Submit</Form.Button>
										</Form>
										<Message attached='bottom'>
											<Icon name='help' />
											Need to sign in?&nbsp;&nbsp;<Link to='/login'>Login now here</Link>&nbsp;instead.
										</Message>
									</Card.Content>
								</Card.Content>
							</Card>
						</Grid.Column>
					</Grid.Row>
				</Grid>
				)}
			</ApolloConsumer>
		);
	}
}

export default compose(graphql(boothSignup, {name: 'boothSignup'}))(BoothRegister);