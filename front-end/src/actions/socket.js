import io from 'socket.io-client';
const socket = io('https://localhost:7777');
console.dir(socket);

socket.on('connect', function(){
    console.log('connected ont he front end in socket.js');
});
// socket.on('event', function(data){});
// socket.on('disconnect', function(){});

socket.on('testDataReceived', d => console.log('res from serv', d));
socket.on('first50', data => console.log('first50 from server', data));
socket.on('allNewVideos', data => console.log('allNewVideos from server', data));
socket.on('pleasePrint', d => console.log('From backend \n', d));
export default socket;
