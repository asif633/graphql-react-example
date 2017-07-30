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