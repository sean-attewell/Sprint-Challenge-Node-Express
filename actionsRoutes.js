const express = require('express');
const routes = express.Router();
const Actions = require('./data/helpers/actionModel');

routes.use(express.json());

routes.get('/', (req, res) => {
    Actions.get()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({ error: "The actions information could not be retrieved." })
        });
})

routes.get('/:id', async (req, res) => {
    try {
        const action = await Actions.get(req.params.id);
        res.status(200).json(action);
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: `The action with ID ${req.params.id} does not exist.` });
    }
});

routes.post('/', async (req, res) => {
    if (!req.body.project_id || !req.body.description || !req.body.notes) {
        res.status(400).json({ errorMessage: "Please provide project_id, description and notes for the action." });
    } else {
    try {
        const action = await Actions.insert(req.body);
        res.status(201).json(action);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "There was an error while saving the action to the database" });
    }
}});

routes.put('/:id', async (req, res) => {
    const { id } = req.params;
    if (!req.body.description || !req.body.notes) {
        res.status(400).json({ errorMessage: "Please provide description and notes for the action." });
    } else {
    try {
        const newAction = await Actions.update(id, req.body);
        if (newAction) {
            res.status(200).json(newAction);
        } else {
            res.status(404).json({ message: `The action with ID ${id} does not exist.` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The action information could not be modified." });
    }
}});

routes.delete('/:id', async (req, res) => {
    try {
        const numberDeleted = await Actions.remove(req.params.id);
        if (numberDeleted > 0) {
            res.status(200).json({ message: `Action ${req.params.id} has been deleted.` });
        } else {
            res.status(404).json({ message: `The action with ID ${req.params.id} does not exist.` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The action could not be removed" });
    }
});

module.exports = routes;