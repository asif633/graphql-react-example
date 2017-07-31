import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class TaskCreate extends Component {
    constructor(props) {
        super(props);
        this.state = { name: '', start: '', end: '' };
    }
    onSubmit(event) {
        event.preventDefault();
        this.props.mutate({
            variables: {
                name: this.state.name,
                start: this.state.start,
                end: this.state.end,
                projectId: this.props.projectId},
        });
        this.setState({
            name: '',
            start: '',
            end: ''
        });
    }
    render() {
        return (
            <form>
                <label>Add a Task</label>
                <input value={this.state.name} onChange={event => this.setState({ name: event.target.value })} />
                <label>Add a Start Date</label>
                <input value={this.state.start} onChange={event => this.setState({ start: event.target.value })} />
                <label>Add a End Date</label>
                <input value={this.state.end} onChange={event => this.setState({ end: event.target.value })} />
                <button className="btn-large" type="submit" onClick={this.onSubmit.bind(this)}>Submit Data</button>
            </form>
        );
    }
}

const mutation = gql`
    mutation AddTaskToProject($name: String, $start: String, $end: String, $projectId: ID){
        addTaskToProject(
            name: $name
            start: $start
            end: $end
            projectId: $projectId
        ){
            id
            tasks{
                id
                name
            }
        }
    }
`
export default graphql(mutation)(TaskCreate);