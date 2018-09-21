const MongoClient = require('mongodb').MongoClient;
const Mongo = require('mongodb');
const auth = require('./auth');
const { AuthenticationError, ApolloError} = require('apollo-server');

/**
 * DB Configuration Options
 */
const url = "mongodb://localhost:27017/";
const dbName = process.env.DB_NAME || "testDB";

const state = {
  db: null
}

/*** 
 * Wrapper for mongo database connection
 * @param {Function} done callback after db connects
 */
exports.connect = (done) => {
  if (state.db) return done();

  MongoClient.connect(url, { useNewUrlParser: true} ,function (err, db) {
    if (err) throw err;
    state.db = db;
    done();
  });
}

exports.disconnect = () => {
  if(state.db)
  {
    state.db.close();
  }
}

/**
 * Get database instance from state
 */
const db = () => {
  return state.db.db(dbName);
}
exports.db = db;

/** 
 * Adds an attendee document to the attendees collection
 * @param {Object} attendee the document 
 */
exports.addAttendee = (attendee) => {
  return new Promise((resolve, reject) => {
    db().collection("attendees").insertOne(attendee, (err, res) => {
      if (err) {
        console.log('addAttendee Error:', err);
        reject(new ApolloError('An error occured during signup'));
      }

      if (!res) {
        console.log('addAttendee Error: No document returned');
        reject(new ApolloError('An error occured during signup'));
      }

      resolve({id: res.insertedId});
    });
  });
}

/**
 * Adds a booth account document to the booths collection
 * @param booth the document
 */
exports.boothSignup = (booth) => {
  return new Promise((resolve, reject) => {
    db().collection("booths").insertOne(booth, (err, res) => {
      if (err) {
        console.log('boothSignup Error: ', err);
        reject(new ApolloError('An error occured during signup')); 
      }

      if (!res) {
        console.log('boothSignup Error: No document returned');
        reject(new ApolloError('An error occured during signup'));
      }

      const token = auth.signNewTokenWithId(res.insertedId);
      resolve({token});
    });
  });
}

/**
 * Removes a specified booth
 * @param {String} boothID to select doc
 */
exports.deleteBooth = (boothID) => {
  let delQuery = { "_id": new Mongo.ObjectID(boothID) };

  db().collection("booths").deleteOne(delQuery, (err, obj) => {
    if (err) throw err;
  });
}

/**
 * Get the necessary credentials to authenticate a booth/user.
 * @param {String} username
 * @param {String} password
 */
exports.boothLogin = ({username, password}) => {
  return new Promise((resolve, reject) => {
    db().collection('booths').findOne({'identity.username' : { $eq: username }}, (err, res) => {
      // Check for error
      if (err) {
        console.log('boothLogin Error:', err);
        reject(new ApolloError('An error occurred during login. Try again later.'));
      }

      // Check if passwords match
      if (res && auth.checkAuth(password, res.identity.password)) {
        // Generate new token
        const token = auth.signNewTokenWithId(res._id);
        // Return the token
        resolve({token});
      }

      reject(new AuthenticationError('Username or password is incorrect.'));
    });
  });
}

/**
 * Gets the identity of a specified booth
 * @param {String} id The id of the asset
 */
exports.getIdentity = (id) => {
  return new Promise((resolve, reject) => {
    // Get the identity by ID. The ID is retrieved from the JWT
    try {
      db().collection('booths').findOne({_id: Mongo.ObjectId(id)}, (err, res) => {
        if (err) {
          console.log('getIdentity Error:', err);
          reject(new ApolloError('An error occured.'));
        }
  
        if (!res) {
          console.log('getIdentity Error: No result');
          reject(new ApolloError('An error occured.'));
        }
  
        resolve(res);
      });
    } catch (err) {
      console.log('getIdentity Error:', err);
      reject(new ApolloError('An error occured.'));
    }
  });
}

/** 
 * Adds the booth ID to the attendee's scans
 * @param {String} attendeeID the attendee's ID to lookup
 * @param {String} boothID the booth ID to add
 */
exports.checkIn = (attendeeID, boothID) => {
  return new Promise((resolve, reject) => {
    let upQuery = {"_id" : Mongo.ObjectID(attendeeID)};
    let newScan = {$push: {scans:{boothID: boothID}}};

    try {
      db().collection("attendees").updateOne(upQuery, newScan, function(err, res) {
        if (err) {
          console.log('checkIn Error:', err);
          reject(new ApolloError('An error occured'));
        }

        if (!res) {
          console.log('checkIn Error: No result');
          reject(new ApolloError('An error occured.'));
        }

        resolve({id: attendeeID});
      });
    } catch (err) {
      console.log('checkIn Error:', err);
      reject(new ApolloError('An error occured'));
    }
  });
}

/** 
 * Aggregates the scans for a booth into a collection
 * @param {String} boothID the booth to aggregate for
 * @param {String} filter the search term or $filter to use
 * @param {Number} direction the direction to sort
 * @param {Number} count how many candidates to get
 * @param {Number} skip the number of entries to skip
*/
exports.getCandidates = async (boothID, filter = null, direction = -1, count = 10, skip = 0) => {
  //Limit to booth
  let pipeline = [{$match: {"scans": {"$elemMatch" : {boothID: boothID} }}}]

  //Apply filter
  switch(filter)
  {
    case "$firstName":
      pipeline.push({$sort: {"identity.firstName": direction}})
      break;
    
    case "$lastName":
      pipeline.push({$sort: {"identity.lastName": direction}})
      break;

    case "$school":
      pipeline.push({$sort: {"education.school": direction}})
      break;
    
    case "$major":
      pipeline.push({$sort: {"education.major": direction}})
      break;

    case "$class":
      pipeline.push({$sort: {"education.gradYear": direction}})
      break;

    case "$gpa":
      pipeline.push({$sort: {"education.gpa": direction}})
      break;
    
    case "":
    case null:
      break;

    //Search case
    default:
      //Create and search text index
      await db().collection("attendees").createIndex(
        {
          'identity.firstName': 'text', 
          'identity.lastName': 'text',
          'education.school': 'text',
          'education.major': 'text'

        });
      pipeline.splice(0, 0,  { $match: { $text: { $search: filter } } });
      break;
  }

  //Return chunk of 10 offset by skip
  pipeline.push({$skip: skip});
  pipeline.push({$limit: count});

  //Run query
  return db().collection("attendees").aggregate(pipeline).toArray();
}

/**
 * Returns the total number of checkIns for pagination
 * @param {String} boothID the booth to total
 */
exports.getCandidateTotal = async (boothID) => {
  return db().collection("attendees").aggregate([
    {$match: {"scans": {"$elemMatch" : {boothID: boothID} }}},
    {$count: "total"},
  ]).toArray();
}

/**
 * Agregates and counts the types of majors checked
 * in to a specific booth
 * @param {String} boothID the booth to get major data for
 */
exports.getMajorData = async (boothID) => {
  return db().collection("attendees").aggregate([
    {$match: {"scans": {"$elemMatch" : {boothID: boothID} }}},
    {$group : {
      _id :  "$education.major",
      count: { $sum: 1 }
      }
    },
    {$sort: {count: -1}},
    {$limit: 5},
  ]).toArray();
}

/**
 * Counts the total number of majors registered 
 * @param {Array} majors the list of majors to count
 */
exports.getGlobalMajorData = (majors) => {
  return db().collection("attendees").aggregate([
    {$match: {"education.major": {"$in" : majors }}},
    {$group : {
      _id :  "$education.major",
      count: { $sum: 1 }
      }
    },
  ]).toArray();
}

/**
 * Get GPA data for specific booth
 * @param {String} boothID 
 */
exports.getGPAData = (boothID) => {
  return db().collection("attendees").aggregate([
    {$match: {"scans": {"$elemMatch" : {boothID: boothID} }}},
    {$group : {
      _id :  {$divide:[{$floor:{$multiply:["$education.gpa", 10]}}, 10]},
      count: { $sum: 1 }
      }
    },
    {$sort: {_id: -1}},
  ]).toArray();
}

/**
 * Get global GPA data
 */
exports.getGlobalGPAData = () => {
  return db().collection("attendees").aggregate([
    {$group : {
      _id :  {$divide:[{$floor:{$multiply:["$education.gpa", 10]}}, 10]},
      count: { $sum: 1 }
      },
    },
    {$sort: {_id: -1}},
  ]).toArray();
}

/**
 * Get a specific candidate by ID
 * @param {String} param0 
 */
exports.getCandidate = ({id}) => {
  return new Promise((resolve, reject) => {
    try {
      db().collection('attendees').findOne({_id: Mongo.ObjectId(id)}, (err, res) => {
        if (err) {
          console.log('getCandidate Error:', err);
          reject(new ApolloError('An error occured getting the candidate.'));
        }
  
        if (!res) {
          console.log('getCandidate Error: Document not found.');
          reject(new ApolloError('The requested candidate could not found.'));
        }
  
        resolve(res);
      });
    } catch (err) {
      console.log('getCandidate Error:', err);
      reject(new ApolloError('The requested candidate could not be found.'));
    }
  });
}