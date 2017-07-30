import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import ProjectList from './components/ProjectList';

const client = new ApolloClient({});

const Root = () => {
    return (
        <ApolloProvider client={client}>
            <ProjectList/>
        </ApolloProvider>);
};

ReactDOM.render(
    <Root/>,
    document.querySelector('#root')
);