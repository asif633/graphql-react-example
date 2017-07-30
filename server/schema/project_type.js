const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;
const TaskType = require('./task_type');
const Project = mongoose.model('project');

const ProjectType = new GraphQLObjectType({
  name:  'ProjectType',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parentValue) {
        return Project.findtasks(parentValue.id);
      }
    }
  })
});

module.exports = ProjectType;