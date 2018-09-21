const database = require('./mongoController');
const faker = require('faker');

//Prototype records
const dummyBooth = {
	identity: {
		username: "user",
		password: "pass",
		company: "company"
	},
}

const dummyAttendee = {
	identity: {
		firstName: "John",
		lastName: "Boy",
		email: "123@xd.com",
		phone: "333-333-2222",
	},
	education: {
		school: "N/A",
		major: "Computers",
		gpa: 2.0,
		gradYear: 2021,
		gradMonth: 12,
	},
	experience: {
		links: ["www.internet.com"]
	},
	scans: []
}

//Run pop test
populateDB(process.env.BID);

/**
 * populates the DB with attendees
 * populates a single booth with checkIns
 * @param boothID the booth to populate
 * @param num the number of attendees to add
 */
function populateDB(boothID, num = 1000) {
	try {
		console.log("BID = "+boothID);
		database.connect(async () => {

			if (boothID == "drop") {
				await database.db().collection("attendees").drop();
				console.log("Dropped all attendees.");
			}
			else {
				await populateAttendees(num);
				if(boothID)
					await populateCheckIns(num/10, num, boothID);
			}

			database.disconnect();
		});
	}
	catch (err) {
		console.log("ERROR WHILE POPULATING: " + err);
	}
}

/**
 * populates the DB with booths
 * @param num the number of booths to add
 */
function populateBooths(num) {
	for (let i = 0; i < num; i++) {
		let newBooth = {
			identity: {
				username: faker.fake("{{internet.email}}"),
				password: faker.fake("{{internet.password}}"),
				company: faker.fake("{{company.companyName}}")
			},
		}

		database.boothSignup(newBooth)
	}
}

/**
 * populates the DB with attendees
 * @param num the number of attendees to add
 */
async function populateAttendees(num) {

	let majors = [];
	let schools = [];

	//Generate major name
	for (let i = 0; i < 10; i++) {
		//Generate major name and capitalize
		majors[i] = faker.fake("{{company.bsNoun}}");
		majors[i] = majors[i].charAt(0).toUpperCase() + majors[i].substr(1);
	}

	//Generate school names
	for (let i = 0; i < 10; i++) {
		//Generate school name and capitalized
		schools[i] = faker.fake("{{company.bsBuzz}}");
		schools[i] = schools[i].charAt(0).toUpperCase() + schools[i].substr(1);

		//Append prefix/sufflix
		let rand = Math.random();
		if(rand < 0.25)
			schools[i] = schools[i] + ' University';
		else if(rand < 0.5)
			schools[i] = schools[i] + ' College';
		else if(rand < 0.75)
			schools[i] =  'University of ' + schools[i];
		else
			schools[i] = 'School of ' + schools[i];
	}

	//Generate random attendees and register to DB
	for (let i = 0; i < num; i++) {

		let firstName = faker.fake("{{name.firstName}}");
		let lastName = faker.fake("{{name.lastName}}");

		let email =
			faker.fake("{{hacker.adjective}}")
			+ (Math.random() > 0.5 ? firstName : lastName)
			+"@"+ faker.fake("{{company.bsNoun}}") + ".com";

		let newAttendee = {
			identity: {
				firstName: firstName,
				lastName: lastName,
				email: email,
				phone: faker.fake("{{phone.phoneNumber}}"),
			},
			education: {
				school: schools[Math.floor(Math.random()*schools.length)],
				major: majors[Math.floor(Math.random()*majors.length)],
				gpa: Math.floor(generateGPA() * 100) / 100,
				gradYear: Math.random() > 0.5 ? 2020 : 2021,
				gradMonth: Math.random() > 0.5 ? "Summer" : "Fall",
			},
			experience: {
				links: [faker.fake("{{internet.url}}")]
			},
			scans: []
		}

		console.log(firstName + " " + lastName + "is attending!");

		//Register to DB
		await database.addAttendee(newAttendee);
	}

	return true;
}

/**
 * generates GPAs on a 'curve'
 */
function generateGPA() {
	let seed = Math.random();

	if (seed < 0.2) {
		return 1 + Math.random();
	}

	else if (seed < 0.7) {
		return 2 + Math.random();
	}

	else {
		return 3 + Math.random();
	}
}

/**
 * gets a random attendee ID
 * @param count the number of attendees in the db
 */
async function getRandomAttendeeID(count)
{
  let ret = database.db().collection("attendees").find().limit(-1).skip(Math.random()*count).next();
  return ret;
}

/**
 * gets a random attendee ID
 * @param num the number of checkIns to add
 * @param count the number of attendees in the db
 * @param boothID the booth to populate
 */
async function populateCheckIns(num, count, boothID) {
	for (let i = 0; i < num; i++) {
		let test = await getRandomAttendeeID(count);
		database.checkIn(test._id, boothID)

		console.log("["+test._id + "] checked into your booth!");
	}

	return true;
}
