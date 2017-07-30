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