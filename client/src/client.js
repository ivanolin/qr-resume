import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

import * as auth from './auth';

/**
 * Create new Apoolo Client
 */
const httpLink = createHttpLink({
	uri: 'http://localhost:4000'
});

/**
 * Set authorization header if token exists in storage
 */
const authLink = setContext((_, { headers }) => {
	// get authentication token from local storage
	const token = auth.getToken();
	if (token) {
		// return the appropriate headers
		return {
			headers: {
				...headers,
				authorization: token ? `Bearer ${token}` : '',
			}
		}
	}
});

/**
 * Redirect to the login page if unauthenticated
 */
const unauthLink = onError((errobj) => {
	const { graphQLErrors } = errobj;
	console.log({errobj});
	if (graphQLErrors) {
		const [error] = graphQLErrors;
		if (error && error.code === 'UNAUTHENTICATED') {
			localStorage.removeItem('token');
			if (document.location.pathname !== '/login')
				document.location = '/login';
			return;
		}
	}
});

/**
 * Create new client with middle and after ware
 */
export default new ApolloClient({
	link: from([unauthLink, authLink, httpLink]),
	cache: new InMemoryCache()
});