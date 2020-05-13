const express = require('express'); 

// database access using knex
const db = require('../data/dbConfig'); 

const router = express.Router(); 

router.get('/', (req,res) => {

    // get list of accounts from database
    // select * from accounts 
    db.select('*').from('accounts')
    .then(account => {
        res.status(200).json({ data: account }); 
    })
    .catch(err => {
        console.log('err', err); 
        res.status(500).json({ message:err.message }); 
    })
})

router.get('/:id', (req,res) => {
    db('accounts')
        .where({ id: req.params.id })
        .first()
        .then(account => {
            if(account) {
                res.status(404).json({ data: account })
            }
            else {
                res.status(404).json({ message: 'No account by that ID' })
            }
        })
        .catch( err => {
            console.log(err); 
            res.status(500).json({ message: err.message })
        })
})

router.post('/', (req,res) => {
    const post = req.body; 
    if(isValidPost(post)) {
        db('accounts')
        .insert(post,'id')
        .then( ids => {
            res.status(201).json({ data: ids })
        })
    }
    else {
        res.status(404).json({message: "please insert valid post with name and budget please"})
    }
})

router.put('/:id/', (req,res) => {

    const changes = req.body; 
    if(isValidPost(changes)) {
        db('accounts')
        .where({ id: req.params.id })
        .update(changes)
        .then( count => {
            if (count > 0) {
                res.status(201).json({ data: count }); 
            }
            else {
                res.status(404).json({ message: "record not found by that ID"}); 
            }
        })
        .catch(err => {
            console.log('the err', err); 
            res.status(500).json({ message: err.message })
        })
    }
    else {
        res.status(404).json({ message: "Please insert appropriate changes field"})
    }
    
}); 

router.delete('/:id', (req,res) => {
    db('accounts')
        .where({ id: req.params.id })
        .del()
        .then( count => {
            if (count > 0) {
                res.status(201).json({ data: count }); 
            }
            else {
                res.status(404).json({ message: "record not found by that ID"}); 
            }
        })
        .catch(err => {
            console.log('the err', err); 
            res.status(500).json({ message: err.message })
        })
})

function isValidPost (post) {
    return Boolean(post.name && post.budget); 
}

module.exports = router; 