const express = require("express");
const router = express.Router();
const { Animal } = require("../models");

//Challenge 2 Bronze
router.post("/create", async (req, res) => {
    let {name, legNumber, predator} = req.body.animal;
    // let {id} = re.user;  Why don't we need this?
    let animalEntry = {
        name,
        legNumber,
        predator
    }
    try {
        const newAnimal = await Animal.create(animalEntry);
        res.status(201).json({
            message: "Item successfully created",
            name: newAnimal
        })
    
    } catch (err) {
        res.status(500).json({
            message: "Failed to create item"
        })
    }
})

//Get all animals Challenge 2 Bronze
router.get("/", async (req, res) => {
    try {
        const animals = await Animal.findAll();
        res.status(201).json(animals);
    } catch (err) {
        res.status(500).json({error: err});
    }
})
//Challenge 2 Silver Delete item
router.delete("/delete/:id", async (req, res) => {
    const animalId = req.params.id;

    try {
        const query = {
            where: {
                id: animalId
            }
        }
        await Animal.destroy(query);
        res.status(201).json({message: "Item has been deleted"});
    } catch (err) {
        res.status(500).json({error: err});
    }
})

//Challenge 2 Gold
router.put("/update/:animalId", async (req, res) => {
    const {name, legNumber, predator} = req.body.animal;
    const animalId = req.params.animalId;

    const query = {
        where: {
            id: animalId
        }
    }

    const updatedAnimal = {
        name: name,
        legNumber: legNumber,
        predator: predator
    }

    try {
        const update = await Animal.update(updatedAnimal, query);
        res.status(200).json(update, {message: "Item has been updated"});
    } catch (err) {
        res.status(500).json({error: err});
    }
})



module.exports = router;
