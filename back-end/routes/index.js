var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const {server} = require('.././bin/www');
var io = require('socket.io')(server);
var cors = require('cors');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
const tempToken = `ya29.Gl0cBZ_FePpLi7v_UtAgYi0T9zKsCkLMjtwR-wyPtFz_EwbF1zPs-FabliqOT4l9ZT7S7ABfib0wXE15O939l-8Ep2zDQ-wsGg_sdzgfqisSd41dpV83IwmmL99En5E`;
// router.get('/home', function(req, res, next) {
//     res.sendFile('index');
// });
router.get('/test', function(req, res, next) {
    fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PLrkcX2uLOH-ivyYR9PYi_gG4Gwzk26R75&access_token=${tempToken}`)
    
        .then(data => data.json())
        .then(data => {
            // console.log(data);
            res.json(data);
        })
        .catch(error => console.log(error));
    // res.json()
});
router.get('/validateToken', function(req, res, next) {
    fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${tempToken}`)
        .then(data => data.json())
        .then(data => {
            // console.log(data);
            res.json(data);
        })
        .catch(error => console.log(error));
});
var corsOptions = {
    origin: 'https://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
};
// router.get('/socket.io', cors(corsOptions), function(req, res, next) {
//     console.log('a socket req or something?');
// });
io.on('connection', function(socket){
    console.log('a user connected');
});

module.exports = router;
