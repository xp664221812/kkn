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
    console.log('post=========', req.body);
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
            if (empty(data)) {
                res.json({msg: undefined})
            } else if (data.ttl === 0) {
                User.remove({msgid: msgid}, function (err) {
                    if (err) {
                        res.json({msg: undefined})
                    } else {
                        res.json({msg: data.msg, nonce: data.nonce, read: 0})

                    }
                })
            } else if (data.ttl === 1) {
                if ((new Date().getTime() - data.time) > 1000 * 60 * 60 * 24) {
                    console.log('消息超时，将被删除。。。。。');
                    //超过24小时
                    User.remove({msgid: msgid}, function (err) {
                        res.json({msg: undefined})
                    })
                } else {
                    let conditions = {msgid: msgid};
                    let update = {$set: {read: data.read - 1}};
                    View.update(conditions, update, function (error) {
                        if (error) {
                        } else {
                            console.log('Update success! result==', result);
                            res.json({msg: data.msg, nonce: data.nonce, read: data.read - 1})
                        }

                    });
                }

            }

        }
    })


    // res.render('index', { title: 'Express' });
});


module.exports = router;
