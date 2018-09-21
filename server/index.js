const { GraphQLServer } = require('graphql-yoga');
const database = require('./mongoController');
const jwt = require('jsonwebtoken');
const { AuthenticationError} = require('apollo-server');
const { formatError } = require('graphql');

/**
 * Import GQL Resolvers
 */
const resolvers = require('./resolvers');

/**
 * Create authentication middleware for GraphQL resolvers
 */
const authMiddleware = async (resolve, parent, args, ctx, info) => {
  const authHeader = ctx.request.get('Authorization');
  if (authHeader) {
    try {
      const permit = jwt.verify(authHeader.replace('Bearer ', ''), '1');
      if (permit) return resolve();
    } catch (err) {
      console.log('Auth Middleware Error:', err.message);
      return new AuthenticationError('Unauthenticated');
    }
    
  }
  return new AuthenticationError('Unauthenticated');
}

/**
 * Set resolver permissions and middleware here
 */
const permissions = {
  Mutation: {
    deleteBooth: authMiddleware,
  },
  Query: {
    getIdentity: authMiddleware,
    getMajorData: authMiddleware,
    getGPAData: authMiddleware,
    getCandidates: authMiddleware,
    getCandidate: authMiddleware
  }
}

/**
 * Server Initialization and configuration
 */
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: req => ({ ...req }),
  middlewares: [permissions],
});

/**
 * Connect to database and start GQL server
 */
try {
  database.connect(() => {
    console.log('Database Connected');
    server.start(({port}) => console.log(`Server is running on http://localhost:${port}`))
  });
} catch (err) {
  console.log(err);
}


