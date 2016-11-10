'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var taskSchema = new mongoose.Schema({
	taskAssignedBy		:{ type: String }, 
    taskAssignedTo		:{ type: String },
	taskSummary		    :{ type: String },
	taskDetails		    :{ type: String },
    assignedDate		:{ type: Date },
	dueDate			    :{ type: Date },
    status			    :{type: String, default: 'Open'}   
});

module.exports = mongoose.model('tasks', taskSchema);