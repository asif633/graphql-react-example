import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Link, hashHistory } from 'react-router';
import TaskCreate from './TaskCreate';
import TaskList from './TaskList';

class ProjectDetail extends Component{
    render(){
        const { project } = this.props.data;
        if(!project){
            return <div> Loading ... </div>;
        }
        return (
            <div>
                <Link to="/">Back</Link>
                <h3> {project.title} </h3>
                <TaskList tasks={project.tasks}/>
                <TaskCreate projectId={this.props.params.id}/>
            </div>
        );
    }
}

const query = gql`
    query getProject($id: ID!){
        project(id: $id){
            id
            title
            tasks{
                id
                name
            }
        }
    }
`
export default graphql(query, {
    options: (props) => { return { variables: { id: props.params.id }}}
})(ProjectDetail);