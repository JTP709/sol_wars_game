import io from 'socket.io-client';

console.log('socket.js')
const socket = io('http://localhost:9000');

socket.on('playerHasJoined', () => { 
  console.log('player has joined in socket file');
});

export default socket;