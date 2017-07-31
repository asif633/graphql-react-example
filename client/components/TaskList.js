import React, { Component } from 'react';

class TaskList extends Component{
    renderTasks(){
        return this.props.tasks.map( ({ id, name }) => {
            return (
                <li className="collection-item" key={id}>
                    {name}
                </li>
            );
        })
    }
    render(){
        return (
            <ul className="collection">
                {this.renderTasks()}
            </ul>
        );
    }
}

export default TaskList;