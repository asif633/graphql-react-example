const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLInt, GraphQLString } = graphql;
const Task = mongoose.model('task');

const TaskType = new GraphQLObjectType({
  name:  'TaskType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    start: { type: GraphQLString },
    end: { type: GraphQLString },
    project: {
      type: require('./project_type'),
      resolve(parentValue) {
        return Task.findById(parentValue).populate('project')
          .then(Task => {
            console.log(Task)
            return Task.project
          });
      }
    }
  })
});

module.exports = TaskType;