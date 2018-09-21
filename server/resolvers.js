const database = require('./mongoController');
const auth = require('./auth');
const validator = require('validator');
const { AuthenticationError, ApolloError, UserInputError} = require('apollo-server');

/**
 * GraphQL Resolvers
 */
module.exports = {
    Query: {
        getIdentity: async (_, __, ctx) => {
            // Get booth id from auth header
            const boothId = auth.getBoothIdFromRequest(ctx);

            // Check if boothId is empty and get identity details from DB
            if (boothId) {
                const result = await database.getIdentity(boothId);
                return result.identity.company;
            } 

            return null;
        },

        getMajorData: async (_, __, ctx) => {
            let data = {};
            data.booth = [];
            data.global = [];

            boothData = await database.getMajorData(auth.getBoothIdFromRequest(ctx));

            let top5Majors = [];
            boothData.map((elem)=>{
                top5Majors.push(elem._id);
                data.booth.push({major: elem._id, count: elem.count});
            });

            let globalDataUnsorted = await database.getGlobalMajorData(top5Majors);
            globalDataUnsorted.map((elem)=>{
                for(let i = 0; i < data.booth.length; i++)
                {
                    if(data.booth[i].major == elem._id)
                    {
                        data.global[i] = {major: elem._id, count: elem.count};
                    }
                }
            });

            return data;
        },

        getGPAData : async (_, __, ctx) => {
            let data = {};
            data.booth = [];
            data.global = [];

            let boothData = await database.getGPAData(auth.getBoothIdFromRequest(ctx));
            let globalData = await database.getGlobalGPAData();

            boothData.map((elem)=>{
                data.booth.push({bucket: elem._id, count: elem.count});
            });

            globalData.map((elem)=>{
                data.global.push({bucket: elem._id, count: elem.count});
            });

            return data;
        },
        
        getCandidates: async (_, args, ctx) => {

            // Pull candidates w/ pagination and filters
            let candidates = await database.getCandidates(
                auth.getBoothIdFromRequest(ctx), 
                args.filter, 
                args.direction, 
                args.count, 
                args.skip);
            
            // Pull candidate total
            let total = await database.getCandidateTotal(auth.getBoothIdFromRequest(ctx));
            if(total[0])
                total = total[0].total;
            else   
                total = 0;

            return{
                total: total,
                candidates: candidates
            }
        },

        getCandidate: async (_, args) => {
            return await database.getCandidate(args);
        }
    },
    Mutation: {
        boothLogin: async (_, args) => {
            /** 
             * Input Validation
             */
            if (!validator.isEmail(args.username))
                return new UserInputError('Valid email address required.');
            
            if (validator.isEmpty(args.password))
                return new UserInputError('Password is required.');

            /**
             * Attempt Login
             */
            return await database.boothLogin(args);
        },

        boothSignup: async (_, args) => {
            /** 
             * Input Validation
             */
            if (!validator.isEmail(args.username))
                return new UserInputError('Valid email address required.');
            
            if (validator.isEmpty(args.password))
                return new UserInputError('Password is required.');

            if(validator.isEmpty(args.company))
                return new UserInputError('Valid company name required.')

            /**
             * Attempt register
             */
            return await database.boothSignup({
                identity: {
                    username: args.username,
                    password: auth.generateHashedPassword(args.password),
                    company: validator.escape(args.company)
                }
            });
        },

        deleteBooth: (_, args) => {
            //Remove from database
            database.deleteBooth(args.boothID);

            return "Deleted " + args.boothID;
        },

        addAttendee: async (_, args) => {
            //Add to database
            return await database.addAttendee({
                identity: args.identity,
                education: args.education,
                experience: args.experience,
            });
        },

        checkIn: async (_, args, ctx) => {
            return await database.checkIn(args.attendeeId, auth.getBoothIdFromRequest(ctx));
        }
    },
}