const express = require('express');
const routes = express.Router();
const Projects = require('./data/helpers/projectModel');
const Actions = require('./data/helpers/actionModel');

routes.use(express.json());

routes.get('/', (req, res) => {
    Projects.get()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({ error: "The projects information could not be retrieved." })
        });
})

routes.get('/:id', async (req, res) => {
    try {
        const project = await Projects.get(req.params.id);
        res.status(200).json(project);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "The project with the specified ID does not exist." });
    }
});

routes.post('/', async (req, res) => {
    if (!req.body.name || !req.body.description) {
        res.status(400).json({ errorMessage: "Please provide name and description for the project." });
    } else {
    try {
        const project = await Projects.insert(req.body);
        res.status(201).json(project);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "There was an error while saving the project to the database" });
    }
}});

routes.put('/:id', async (req, res) => {
    const { id } = req.params;
    if (!req.body.name || !req.body.description) {
        res.status(400).json({ errorMessage: "Please provide name and description for the project." });
    } else {
    try {
        const newProject = await Projects.update(id, req.body);
        if (newProject) {
            res.status(200).json(newProject);
        } else {
            res.status(404).json({ message: `The project with ID ${id} does not exist.` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The project information could not be modified." });
    }
}});

routes.get('/:id/actionsforproject', async (req, res) => {
    try {
        const actions = await Projects.getProjectActions(req.params.id)

        if (actions.length > 0) {
            res.status(200).json(actions);
        } else {
            res.status(404).json({ message: `The project with ID ${req.params.id} does not exist, or has no actions.` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The project\'s action information could not be retrieved." });
    }
});

routes.delete('/:id', async (req, res) => {
    // need to delete the actions first
    const actions = await Projects.getProjectActions(req.params.id)
    await actions.forEach( async (action) => {
        await Actions.remove(action.id)
    });

    try {
        const numberDeleted = await Projects.remove(req.params.id);
        if (numberDeleted > 0) {
            res.status(200).json({ message: `Project ${req.params.id} has been deleted.` });
        } else {
            res.status(404).json({ message: `The project with ID ${req.params.id} does not exist.` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The project could not be removed" });
    }
});

module.exports = routes;