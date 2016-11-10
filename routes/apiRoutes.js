var express 					= require('express');
var router 						= express.Router();
var constants					= require('../scripts/constants');
var apps 						= require(constants.paths.controllers + '/api/application');
var auth 						= require(constants.paths.controllers + '/api/auth');
var users 						= require(constants.paths.controllers + '/api/users');
var tasks                       = require(constants.paths.controllers + '/api/tasks');


router.post('/api/v1/login', auth.login);
router.get('/api/v1/app/info', apps.info);

/*
* Routes that can be accessed only by authenticated & authorized users
*/
router.get('/api/v1/secure/admin/users', users.getAll);
router.get('/api/v1/secure/admin/users/:id', users.getOneById);
router.post('/api/v1/secure/admin/users/', users.create);
router.put('/api/v1/secure/admin/users/:id', users.updateById);
router.delete('/api/v1/secure/admin/users/:id', users.deleteById);
router.get('/api/v1/secure/admin/users/email/:email', users.getByEmail);
router.get('/api/v1/secure/admin/users/findAll/data', users.getAllUsers);
router.get('/api/v1/secure/admin/users/find/find', users.getWithQuery);

// List of service routes for tasks
router.get('/api/v1/secure/tasks', tasks.getAll);
router.get('/api/v1/secure/tasks/:id', tasks.getOneById);
router.post('/api/v1/secure/task/', tasks.create);

module.exports = router;
