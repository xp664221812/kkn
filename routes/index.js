let express = require('express');
let router = express.Router();
let randomstring = require("randomstring");
const empty = require('is-empty');
let User = require('../models/users');
let View = require('../models/views');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.get('/l', function (req, res, next) {
    View.findOne({'id': 1}, function (err, data) {
        if (err) {
            throw err
        } else {
            console.log('view========', data);
            if (empty(data)) {
                console.log('empty--------------');
                View.create({id: 1, views: 0}, function (err, data) {
                    if (err) {
                        throw err
                    } else {
                        console.log('succeed==================', data);
                        let conditions = {id: 1};
                        let update = {$set: {views: data.views + 1}};

                        View.update(conditions, update, function (error) {

                            if (error) {

                            } else {
                                console.log('Update success!');
                            }
                        });
                    }
                });
            } else {
                console.log('not empty--------------');
                let conditions = {id: 1};
                let update = {$set: {views: data.views + 1}};

                View.update(conditions, update, function (error, result) {
                    if (error) {

                    } else {
                        console.log('Update success! result==', result);
                    }

                });
            }
        }
    });


    res.render('check', {});
});


router.post('/api/post', function (req, res, next) {
    let msgid = randomstring.generate(20);
    let body = req.body;
    if (!empty(body)) {
        let current = new Date().getTime();
        let msg = body.msg;
        let nonce = body.nonce;
        let read = body.read;
        let ttl = body.ttl;
        let postData = {
            msgid: msgid,
            msg: msg,
            nonce: nonce,
            read: read,
            ttl: ttl,
            time: current
        };

        User.create(postData, function (err, data) {
            if (err) {
                throw err
            } else {
                console.log('succeed==================', data);
                res.json({msgid: msgid})

            }
        });
    }
});

router.get('/api/get/:msgid', function (req, res, next) {
    console.log("body================", req.param('msgid'));
    let msgid = req.param('msgid');

    User.findOne({msgid: msgid}, function (err, data) {
        if (err) {

        } else {
            console.log('data=================', data);
            res.json({msg: data.msg, nonce: data.nonce, read: data.read})
        }
    })


    // res.render('index', { title: 'Express' });
});


module.exports = router;
