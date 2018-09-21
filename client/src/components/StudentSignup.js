import React, { Component, Fragment } from 'react';
import { Grid, Segment, Form, Button, Responsive, Header } from 'semantic-ui-react';
import { addAttendee } from '../queries/queries';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import QRCode from 'qrcode';

import { Form as FForm, Field as FField } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import DateField from './DateField'
import TextField from './TextField'

class StudentSignup extends Component {

	constructor(props) {
		super(props);
		this.CustomForm = this.CustomForm.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		
		this.state = {  qrcode: null, extraResumeRows: 0, loading: false };
	}

	/** 
	 * ADD GQL query here
	 */
	async handleSubmit(values) {
		this.setState({ loading: true });

		await this.props.addAttendee({
			variables: {...values},
			fetchPolicy: 'no-cache'
		}).catch(err => {
			console.log({err});
		}).then(({data}) => {
			if (data && data.addAttendee) {
				const {id} = data.addAttendee;
				
				const url = window.location.protocol + '//' + window.location.host + '/candidate/' + id + '/add';
				
				const opts = {
					errorCorrectionLevel: 'M',
					type: 'image/jpeg',
					renderOpts: {
						quality: 1
					}
				}
				// gen qr code
				QRCode.toDataURL(url, opts, (err, url) => {
					if (!err) {
						this.setState({qrcode: url});
					}
				});
			}
		});
	}

	/** 
	 * returns false if email is invalid
	 * @param email the email to validate
	 */
	validateEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	/** 
	 * returns false if the phone # is invalid
	 * @param phone the phone # to validate
	 */
	validatePhone(phone) {
		var re = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
		return re.test(String(phone).toLowerCase());
	}

	/** 
	 * returns error object for react-final-form
	 * @param values the values of the form to validate
	 */
	validate = values => {

		const errors = { identity: {}, education: {}, experience: [null] }

		// Identity
		if (values.identity) {
			if (!values.identity.firstName) {
				errors.identity.firstName = 'Required'
			}
			if (!values.identity.lastName) {
				errors.identity.lastName = 'Required'
			}
			if (!this.validateEmail(values.identity.email)) {
				errors.identity.email = 'Required'
			}
			if (!this.validatePhone(values.identity.phone)) {
				errors.identity.phone = 'Required'
			}
		}

		// Education
		if (values.education) {
			if (!values.education.school) {
				errors.education.school = 'Required'
			}
			if (!values.education.major) {
				errors.education.major = 'Required'
			}
			if (!(values.education.gpa <= 4 && values.education.gpa >= 0)) {
				errors.education.gpa = 'Required'
			}
			if (!values.education.gradMonth) {
				errors.education.gradMonth = 'Required'
			}
			if (!values.education.gradYear) {
				errors.education.gradYear = 'Required'
			}
		}

		// Experience
		if (values.experience) {
			for (let i = 0; i < values.experience.length; i++) {
				if (!values.experience[i]) {
					errors.experience[i] = { link: 'Required' }
				}
				console.log();
			}
		}

		return errors
	}

	/** 
	 * main form
	 * @param props the props of the form
	 */
	CustomForm = (props) => (
		<Grid.Column width={props.width} styles={{paddingTop:"5rem"}}>
			<Header as='h3' textAlign='center' dividing>
    			Create your QResume
  			</Header>
			<FForm
				validate={this.validate}
				initialValues={{ identity: {}, education: {}, experience: [] }}
				mutators={{
					...arrayMutators
				}}
				onSubmit={this.handleSubmit}
				render={({ handleSubmit, form: { mutators: { push, pop } }, submitting, pristine, values }) => (
					<Form loading={this.state.loading} onSubmit={handleSubmit}>
						<Segment>
							<Form.Group widths={2}>
								<FField
									name="identity.firstName"
									component={TextField}
									label="Last Name"
									placeholder="John"
								/>
								<FField
									name="identity.lastName"
									component={TextField}
									label="Last Name"
									placeholder="Doe"
								/>
							</Form.Group>
							<FField
								name="identity.email"
								component={TextField}
								label="Email"
								placeholder="address@email.com"
							/>
							<FField
								name="identity.phone"
								component={TextField}
								label="Phone #"
								placeholder="555-555-5555"
							/>
						</Segment>

						<Segment>
							<FField
								name="education.school"
								component={TextField}
								label="School"
								placeholder="University of College"
							/>
							<Form.Group widths={2}>
								<FField
									name="education.major"
									component={TextField}
									label="Major"
									placeholder="Undeclared"
								/>
								<FField
									name="education.gpa"
									component={TextField}
									label="GPA"
									placeholder="4.0"
								/>
							</Form.Group>
							<Form.Group widths={2}>
								<FField
									name="education.gradMonth"
									component={DateField}
									label="Graduation Semester"
									placeholder="Semester"
									type="month"
								/>
								<FField
									name="education.gradYear"
									component={DateField}
									label="Class"
									placeholder="Year"
									type="year"
								/>

							</Form.Group>
						</Segment>

						<Segment>

							<Button fluid basic onClick={() => push('experience', undefined)}>Add Link</Button>
							<Button fluid basic onClick={() => pop('experience')} style={{ marginTop: "1rem" }}>Remove Link</Button>

							<FieldArray name="experience">
								{({ fields }) =>
									fields.map((name, index) => (

										<div key={name}>
											<FField
												name={`${name}.link`}
												initialValues={{ link: null }}
												component={TextField}
												placeholder="www.myresume.com"
												style={{ marginTop: "1rem" }}
											/>
										</div>
									))}
							</FieldArray>
						</Segment>

						<Segment>
							<Button fluid color="green" onClick={handleSubmit} disabled={submitting || pristine}>Submit</Button>
						</Segment>
					</Form>


				)}
			/>
		</Grid.Column>
	);

	// Render out
	render() {
		if (!this.state.qrcode) {
			return (
				<Grid centered>
					<Grid.Row centered style={{marginTop: '2vh'}}>
						<Responsive as={this.CustomForm} width={8} minWidth={1151} />
						<Responsive as={this.CustomForm} width={12} minWidth={651} maxWidth={1150} />
						<Responsive as={this.CustomForm} width={16} maxWidth={650} />
					</Grid.Row>
				</Grid>
			);
		}

		return (
			<Grid centered>
				<Grid.Row centered>
					<Grid.Column width={4} />
						<Segment centered>
							<Grid.Column centered width={8}>
								<img alt='qr code' style={{ minHeight: '300px' }} src={this.state.qrcode} />
							</Grid.Column>
						</Segment>
					<Grid.Column width={4} />
				</Grid.Row>
			</Grid>
		);
	}
}

export default withRouter(compose(graphql(addAttendee, { name: 'addAttendee' }))(StudentSignup));