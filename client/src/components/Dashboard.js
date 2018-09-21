import React, { Component, Fragment } from 'react';
import { Grid, Input, Card, Table, Loader, Menu, Icon } from 'semantic-ui-react';
import { Line, HorizontalBar } from 'react-chartjs-2';
import { Query } from 'react-apollo';
import { getCandidates, getMajorData, getGPAData } from '../queries/queries';
import DataRow from './DataRow';
import DataHeader from './DataHeader';
import ChartData from './ChartData';

/**
 * Root component of application
 */
export default class Dashboard extends Component {

	constructor(props) {
		super(props);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.setFilter = this.setFilter.bind(this);
		this.setSkip = this.setSkip.bind(this);
		this.state = {
			filter: null,
			searchFilter: null,
			direction: -1,
			chunk: 10,
			skip: 0
		}
	}

	handleKeyDown(event) {
		const ENTER_KEY = 13;

		if (event.keyCode === ENTER_KEY) {
			this.setState({ filter: this.state.searchFilter });
		}
	}

	handleChange(event) {
		this.setState({ searchFilter: event.target.value });
	}

	setFilter(filter) {

		//New filter
		if (this.state.filter !== filter) {
			//Set descending
			this.setState({
				filter: filter,
				direction: -1
			});
		}

		//Change direction
		else {
			//Change to ascending
			if (this.state.direction === -1) {
				this.setState({
					direction: 1
				});
			}
			//Remove current filter
			else {
				this.setState({
					filter: null,
					direction: -1
				});
			}
		}
	}

	setSearchFilter(filter) {
		this.setState({
			filter: filter,
			direction: null
		});
	}

	setSkip(direction, total) {
		let skipCheck = (this.state.skip + direction) * this.state.chunk;
		if (skipCheck > total) {
			this.setState({
				skip: 0
			});
		}
		else if (this.state.skip + direction < 0)
		{
			this.setState({
				skip: parseInt(total/this.state.chunk)
			});
		}
		else {
			this.setState({
				skip: this.state.skip + direction
			});
		}
	}

	render() {
		return (
			<Fragment>
				<Grid centered>
					<Grid.Row centered columns={2}>
						<Grid.Column width={8}>
							<Card centered fluid>
								<Query query={getMajorData} fetchPolicy={'network-only'}>
									{({ loading, data }) => {
										if (loading)
											return (
												<Card.Content style={{ margin: '1rem' }}>
													<Card.Header>Major Breakdown</Card.Header>
													<Loader active size='large'></Loader>
												</Card.Content>
											);

										if (data && data.getMajorData) {
											return (
												<Card.Content>
													<Card.Header>Major Breakdown</Card.Header>
													<HorizontalBar data={ChartData.majorChartData(data.getMajorData)} options={ChartData.majorChartOptions} />
												</Card.Content>
											);
										}

										return '';
									}}
								</Query>
							</Card>
						</Grid.Column>
						<Grid.Column width={8}>
							<Card centered fluid>
								<Query query={getGPAData} fetchPolicy={'network-only'}>
									{({ loading, data }) => {
										if (loading)
											return (
												<Card.Content style={{ margin: '1rem' }}>
													<Card.Header>GPA Breakdown</Card.Header>
													<Loader active size='large' ></Loader>
												</Card.Content>
											);

										if (data && data.getGPAData) {
											return (
												<Card.Content>
													<Card.Header>GPA Breakdown</Card.Header>
													<Line data={ChartData.gpaChartData(data.getGPAData)} options={ChartData.gpaChartOptions} />
												</Card.Content>
											);
										}

										return '';
									}}
								</Query>
							</Card>
						</Grid.Column>
					</Grid.Row>

					<Grid.Row>
						<Grid.Column width={16}>
							<Input size='large' fluid icon="search" placeholder="Search..."
								onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
						</Grid.Column>
					</Grid.Row>

					<Grid.Row>
						<Grid.Column width={16}>
							<Query query={getCandidates}
								variables={{
									filter: this.state.filter,
									direction: this.state.direction,
									count: this.state.chunk,
									skip: this.state.skip * this.state.chunk
								}}
								fetchPolicy={'network-only'}>
								{({ loading, data }) => {
									if (loading)
										return <Loader active size='large' style={{ marginTop: '4rem' }}>Loading candidates...</Loader>;

									if (data) {
										console.log(data);
										return (
											<Table size='large' selectable sortable padded>
												<Table.Header>
													<Table.Row>
														<DataHeader filter="$firstName" direction={this.state.direction} currentFilter={this.state.filter} setFilter={this.setFilter}>First Name</DataHeader>
														<DataHeader filter="$lastName" direction={this.state.direction} currentFilter={this.state.filter} setFilter={this.setFilter}>Last Name</DataHeader>
														<DataHeader filter="$school" direction={this.state.direction} currentFilter={this.state.filter} setFilter={this.setFilter}>School</DataHeader>
														<DataHeader filter="$major" direction={this.state.direction} currentFilter={this.state.filter} setFilter={this.setFilter}>Major</DataHeader>
														<DataHeader filter="$class" direction={this.state.direction} currentFilter={this.state.filter} setFilter={this.setFilter}>Class</DataHeader>
														<DataHeader filter="$gpa" direction={this.state.direction} currentFilter={this.state.filter} setFilter={this.setFilter}>GPA</DataHeader>
														<Table.HeaderCell>Status</Table.HeaderCell>
													</Table.Row>
												</Table.Header>
												<Table.Body>
													{data.getCandidates.candidates.map((candidate) => (
														<DataRow key={candidate._id} candidate={candidate} />
													))}
												</Table.Body>
												<Table.Footer>
													<Table.Row>
														<Table.HeaderCell colSpan='7'>
															<Menu floated='right' pagination>
																<Menu.Item as='a' icon onClick={() => { this.setSkip(-1, data.getCandidates.total) }}>
																	<Icon name='chevron left' />
																</Menu.Item>
																<Menu.Item>{this.state.skip + 1}</Menu.Item>
																<Menu.Item as='a' icon onClick={() => { this.setSkip(1, data.getCandidates.total) }}>
																	<Icon name='chevron right' />
																</Menu.Item>
															</Menu>
														</Table.HeaderCell>
													</Table.Row>
												</Table.Footer>
											</Table>
										);
									}

									return '';
								}}
							</Query>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Fragment>
		);
	}
}
