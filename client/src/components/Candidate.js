import React, { Component } from 'react';
import { Grid, Card, Header, Button, Dimmer, Loader, Message, List } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import { getCandidate } from '../queries/queries';

export default class Candidate extends Component {
	render() {
		return (
			<Grid centered>
				<Grid.Row centered>
					<Grid.Column width={12}>

						<Query query={getCandidate} variables={{ id: this.props.match.params.id }}>
							{({ data, loading, error }) => {
								if (loading) {
									return (
										<Dimmer active inverted style={{ marginTop: '5rem' }}>
											<Loader size='huge' inverted>Loading Candidate Information...</Loader>
										</Dimmer>
									);
								}

								if (error && error.graphQLErrors) {
									const [{ message }] = error.graphQLErrors;
									return (
										<Message error>{message}</Message>
									);
								}

								if (data && data.getCandidate) {
									const { identity, education } = data.getCandidate;
									return (
										<Card centered fluid>
											<Card.Content extra>
												<Card.Header textAlign="center">
													Candidate Details
												</Card.Header>
											</Card.Content>
											<Card.Content>


												<List size="huge">
													<List.Item>
														<List.Icon name='male' />
														<List.Content>{identity.firstName} {identity.lastName}</List.Content>
													</List.Item>
													<List.Item>
														<List.Icon name='mail' />
														<List.Content>
															<a href='{identity.email}'>{identity.email}</a>
														</List.Content>
													</List.Item>
													<List.Item>
														<List.Icon name='phone' />
														<List.Content>
															{identity.phone}
														</List.Content>
													</List.Item>


													<List.Item>
														<List.Icon name='graduation cap' />
														<List.Content>{education.school}</List.Content>
													</List.Item>
													<List.Item>
														<List.Icon name='graduation cap' />
														<List.Content>Majoring in {education.major}</List.Content>
													</List.Item>
													<List.Item>
														<List.Icon name='graduation cap' />
														<List.Content>{education.gpa} GPA</List.Content>
													</List.Item>
													<List.Item>
														<List.Icon name='graduation cap' />
														<List.Content>Class of {education.gradMonth} {education.gradYear}</List.Content>
													</List.Item>



													<List.Item>
														<List.Icon name='linkify' />
														<List.Content>
															<a href='/dashboard'>www.linkedin.com</a>
														</List.Content>
													</List.Item>
												</List>



											</Card.Content>
											<Card.Content extra>
													<a href='/dashboard'><Button basic color='green'>Interested</Button></a>
													<a href='/dashboard'><Button basic color='grey' floated="right">Not Interested</Button></a>
											</Card.Content>
										</Card>
									)
								}
								return '';
							}}
						</Query>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)
	}
}