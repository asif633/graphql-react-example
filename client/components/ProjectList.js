import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Link } from 'react-router';
import query from '../queries/fetchProjects';

class ProjectList extends Component {
    onProjectDelete(id){
        this.props.mutate({
            variables: { id }
        })
        .then(() => this.props.data.refetch());
    }
    renderProjects(){
        return this.props.data.projects.map(({ title, id }) => {
            return (
                <li key={id} className="collection-item">
                    {title}
                    <i className="material-icons right" onClick={() => this.onProjectDelete(id)}>delete</i>
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

// const query = gql`
//     {
//         projects{
//             id
//             title
//         }
//     }
// `;

const mutation = gql`
    mutation DeleteProject($id: ID){
        deleteProject(id: $id){
            id
        }
    }
`

export default graphql(mutation)(graphql(query)(ProjectList));