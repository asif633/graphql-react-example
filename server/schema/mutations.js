
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;
const mongoose = require('mongoose');
const Project = mongoose.model('project');
const Task = mongoose.model('task');
const ProjectType = require('./project_type');
const TaskType = require('./task_type');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addProject: {
      type: ProjectType,
      args: {
        title: { type: GraphQLString }
      },
      resolve(parentValue, { title }) {
        return (new Project({ title })).save();
      }
    },
    addTaskToProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLString },
        start: { type: GraphQLString },
        end: { type: GraphQLString },
        projectId: { type: GraphQLID }
      },
      resolve(parentValue, { name, start, end, projectId }) {
        return Project.addTask(projectId, name, start, end);
      }
    },
    deleteProject: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, { id }) {
        return Project.remove({ _id: id });
      }
    }
  }
});

module.exports = mutation;