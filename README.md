## GraphQL with Express, MongoDB, React Apollo

### Server Side
We have two models at start Project has multiple Tasks

```
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: { type: String },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'task'
  }]
});

ProjectSchema.statics.addTask = function(id, name, start, end) {
  const Task = mongoose.model('task');

  return this.findById(id)
    .then(project => {
      const task = new Task({ name, start, end, project })
      project.tasks.push(task)
      return Promise.all([task.save(), project.save()])
        .then(([task, project]) => project);
    });
}

ProjectSchema.statics.findtasks = function(id) {
  return this.findById(id)
    .populate('tasks')
    .then(Project => Project.tasks);
}

mongoose.model('project', ProjectSchema);
```

and Task

```
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    name: { type: String },
    start: { type: String },
    end: { type: String },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    }
});

mongoose.model('task', TaskSchema);
```

Next TaskType

```
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
```

and ProjectType

```
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
```

Next we have RootQueryType

```
const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;
const ProjectType = require('./project_type');
const TaskType = require('./task_type');
const Task = mongoose.model('task');
const Project = mongoose.model('project');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    projects: {
      type: new GraphQLList(ProjectType),
      resolve() {
        return Project.find({});
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Project.findById(id);
      }
    },
    task: {
      type: TaskType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parnetValue, { id }) {
        return Task.findById(id);
      }
    }
  })
});

module.exports = RootQuery;
```

and Mutations

```

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
```

ApolloProvider wraps React and ApolloStore is the slient side store which connects to
GraphQL server. ApolloProvider connects with ApolloStore.

### Client Side

To fetch list of projects

```
import gql from 'graphql-tag';

export default gql`
    {
        projects{
            id
            title
        }
    }
`
```

Render projects

```
    renderProjects(){
        return this.props.data.projects.map(({ title, id }) => {
            return (
                <li key={id} className="collection-item">
                    <Link to={`/project/${id}`}>{title}</Link>
                    <i className="material-icons right" onClick={() => this.onProjectDelete(id)}>delete</i>
                </li>
            )
        })
    }
```

Delete Mutation

```
const mutation = gql`
    mutation DeleteProject($id: ID){
        deleteProject(id: $id){
            id
        }
    }
`
```

Use of `mutate` method

```
    onProjectDelete(id){
        this.props.mutate({
            variables: { id }
        })
        .then(() => this.props.data.refetch());
    }
```

Use

```
        this.props.mutate({
            variables: {
                title: this.state.title
            },
            refetchQueries: [{ query }]
        }).then(() => hashHistory.push('/'));
```

when the refetch is happening on other component.

We can use `dataIdFromObject: o => o.id` which also works to refetch data in other component.
```
const client = new ApolloClient({
    dataIdFromObject: o => o.id
});
```


