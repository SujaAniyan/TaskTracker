'use strict';

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

var taskSchema = new mongoose.Schema({
	taskAssignedBy		:{ type: String }, 
    taskAssignedTo		:{ type: String },
	taskTitle		    :{ type: String },
	taskDetails		    :{ type: String },
    priority            :{type: String, default: 'Medium'},   
    assignedDate		:{ type: Date },
	dueDate			    :{ type: Date },
    status			    :{ type: String, default: 'Open' },
    attachments         :{ type: String }
});

module.exports = mongoose.model('tasks', taskSchema);