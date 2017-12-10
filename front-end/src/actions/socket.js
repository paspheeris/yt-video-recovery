import io from 'socket.io-client';
const socket = io('https://localhost:7777');
console.dir(socket);

socket.on('connect', function(){
    console.log('connected ont he front end in socket.js');
});
socket.on('event', function(data){});
socket.on('disconnect', function(){});

export default socket;
