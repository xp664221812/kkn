let express = require('express');
let router = express.Router();
let randomstring = require("randomstring");
const empty = require('is-empty');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.get('/l', function (req, res, next) {
    console.log('1111111111111111111111111111')
    res.render('check', {});
});


router.post('/api/post', function (req, res, next) {
    let msgid = randomstring.generate(20);
    console.log("random============", msgid);
    console.log("body===========", req.body);
    if (!empty(req)) {
        res.json({msgid: msgid, TTL: 3000})
    }
    // res.render('index', { title: 'Express' });
});

router.get('/api/get', function (req, res, next) {
    let msgid = randomstring.generate(20)
    console.log("random============", msgid);
    console.log("body===========", req.body);
    if (!empty(req)) {
        res.json({msgid: msgid, TTL: 3000})
    }
    // res.render('index', { title: 'Express' });
});


module.exports = router;
