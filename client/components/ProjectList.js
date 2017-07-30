import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';

class ProjectList extends Component {
    renderProjects(){
        return this.props.data.projects.map(proj => {
            return (
                <li key={proj.id} className="collection-item">
                    {proj.title}
                </li>
            )
        })
    }
    render() {
        if(this.props.data.loading) { return <div>Loading ... </div>; }
        return (
            <div>
            <ul className="collection">
                {this.renderProjects()}
            </ul>
            <Link to="/project/new" className="btn-floating btn-large red right">
                <i className="material-icons">add</i>
            </Link>
            </div>
        );
    }
}

const query = gql`
    {
        projects{
            id
            title
        }
    }
`;

export default graphql(query)(ProjectList);