import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import App from './components/App';
import ProjectCreate from './components/ProjectCreate';
import ProjectDetail from './components/ProjectDetail';
import ProjectList from './components/ProjectList';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import './style/style.css';

const client = new ApolloClient({
    dataIdFromObject: o => o.id
});

const Root = () => {
    return (
        <ApolloProvider client={client}>
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={ProjectList}/>
                    <Route path="project/new" component={ProjectCreate} />
                    <Route path="project/:id" component={ProjectDetail} />
                </Route>
            </Router>
        </ApolloProvider>);
};

ReactDOM.render(
    <Root/>,
    document.querySelector('#root')
);