import React, { Component } from 'react';
import { Grid, Card, Form, Header, Input, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import { boothLogin } from '../queries/queries';
import { Redirect } from 'react-router-dom';
import * as auth from '../auth';

class BoothLogin extends Component {
	constructor(props) {
		super(props);
        this.handleFormInputChange = this.handleFormInputChange.bind(this);
        this.login = this.login.bind(this);
		this.state = {
			username: '',
			password: '',
			success: false,
			error: null,
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
     * Attempt login and retrieval of JWT
     */
    async login() {
        // Set loading state
        this.setState({loading: true});

        // Attempt login
        await this.props.boothLogin({
            variables: {
                username: this.state.username,
                password: this.state.password,
            }
        }).then(({data}) => {
            // Extract token
            const {token} = data.boothLogin;

            // Check if token is null or empty
            if (!token)
                return this.setState({password: '', error: {message: 'An error occured during login.'}, loading: false});

            // Set token to local storage and redirect
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
            <Grid centered>
                <Grid.Row centered>
                    <Grid.Column width={8}>
                        <Card centered fluid style={{ marginTop: '12rem' }}>
                            <Card.Content>
                                <Card.Header textAlign="center" style={{ padding: '1rem 0 1rem 0' }}>
                                    <Header as='h1'>Company Booth Login</Header>
                                </Card.Header>
                                <Card.Content>
                                    <Form error={this.state.error ? true : false} loading={this.state.loading} className='attached' style={{ marginBottom: '1rem' }} onSubmit={this.login}>
                                        <Form.Field>
                                            <label>Username/Email</label>
                                            <Input name="username" size='large' placeholder="john@example.com" onChange={this.handleFormInputChange}/>
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Password</label>
                                            <Input name="password" value={this.state.password} size='large' placeholder="*********" type='password' onChange={this.handleFormInputChange}/>
                                        </Form.Field>
                                        { this.state.error ? <Message error header='Login Error' content={this.state.error.message} /> : ''}
                                        <Form.Button size='big' fluid color="green">Submit</Form.Button>
                                    </Form>
                                    <Message attached='bottom'>
                                        <Icon name='help' />
                                        Not signed up?&nbsp;&nbsp;<Link to='/register'>Signup now here</Link>&nbsp;instead.
                                    </Message>
                                </Card.Content>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
		);
	}
}

export default compose(graphql(boothLogin, {name: 'boothLogin'}))(BoothLogin);