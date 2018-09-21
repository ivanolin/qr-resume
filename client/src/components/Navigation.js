import React, { Component, Fragment } from 'react';
import { Menu, Dropdown, Divider, Responsive, Button, Loader, Message } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import { getIdentity } from '../queries/queries';
import * as auth from '../auth';

const CustomQuery = (props) => {
	if (auth.getToken()) {
		return (
			<Query query={getIdentity} fetchPolicy={'cache-and-network'}>
				{({ client, loading, data, error }) => {
					if (loading) {
						return (
							<Menu.Item position='right'><Loader active inline size='small' /></Menu.Item>
						)
					}

					if (error && error.graphQLErrors && error.graphQLErrors[0]) {
						const [{ code }] = error.graphQLErrors[0];
						if (code === 'UNAUTHENTICATED') {
							return (
								<Fragment>
									<Menu.Item><Link to='/student/signup'>Student Signup</Link></Menu.Item>
									<Menu.Menu position='right'>
										<Menu.Item><Link to='/login'><Button primary>Login</Button></Link></Menu.Item>
										<Menu.Item><Link to='/register'><Button>Register</Button></Link></Menu.Item>
									</Menu.Menu>
								</Fragment>
							);
						}

						return (
							<Menu.Item position='right'>
								<Message error>Server Error</Message>
							</Menu.Item>
						);
					}

					if (data) {
						if (data.getIdentity) {	
							const identity = data.getIdentity;
							return (
								<Fragment>
									<Menu.Item name='dashboard'>
										<Link to='/dashboard'>
											<Button fluid basic color="green">Dashboard</Button>
										</Link>
									</Menu.Item>
									<Menu.Item name='dashboard'>
										<Link to='/scan' style={{ textDecoration: 'none' }}>
											<Button fluid basic color="green">Scan</Button>
										</Link>
									</Menu.Item>
									<Menu.Menu position='right'>
										<Dropdown text={identity} item>
											<Dropdown.Menu>

												<Dropdown.Item onClick={() => {
													localStorage.removeItem('token');
													client.resetStore();
													props.history.push('/login');
												}}>Logout</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									</Menu.Menu>
								</Fragment>
							);
						}
					}

					return '';
				}}
			</Query>
		)
	}
	return (
		<Fragment>
			<Menu.Menu position='right'>
				<Menu.Item><Link to='/student/signup'><Button basic fluid color="green">Attendee Registration</Button></Link></Menu.Item>
				<Menu.Item><Link to='/login'><Button fluid color="green">Booth Portal</Button></Link></Menu.Item>
			</Menu.Menu>
		</Fragment>
	);
}

const MenuOptions = ({ history }) => (
	<Fragment>
		<CustomQuery history={history}></CustomQuery>
	</Fragment>
);

export default class Navigation extends Component {
	render() {
		return (
			<Fragment>
				<Menu secondary>
					<Link to='/' style={{ textDecoration: 'none' }}><Menu.Item><b style={{ fontSize: '27px' }}>QResume</b></Menu.Item></Link>
					<Responsive as={withRouter(MenuOptions)} />
				</Menu>
				<Divider />
			</Fragment>
		);
	}
}