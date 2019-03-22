const express = require('express');
const projectsRoutes = require('./projectsRoutes')
const actionsRoutes = require('./actionsRoutes')

const server = express();

server.use('/api/projects', projectsRoutes);
server.use('/api/actions', actionsRoutes);

module.exports = server;
