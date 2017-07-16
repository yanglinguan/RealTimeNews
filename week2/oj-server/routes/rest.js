const express=require('express');
const router=express.Router();

const bodyParser=require('body-parser')
const jsonParser = bodyParser.json();

const problemService=require("../services/problemService")

router.get('/problems', function(req, res) {
    problemService.getProblems()
    .then(p => res.json(p))
}); 

router.get('/problems/:id', function(req, res) {
    const id = req.params.id;
    problemService.getProblems(+id)
    .then(p => res.json(p))
}); 

router.post('/problems', jsonParser, function(req, res) {
    problemService.addProblem(req.body)
    .then(function(p) {
        res.json(p);
    }, function(error) {
        res.status(400).send("Problem name already exists")
    })
    
})



module.exports = router;