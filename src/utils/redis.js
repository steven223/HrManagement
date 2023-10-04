const redis = require('redis');

const publisher = redis.createClient();
const subscriber = redis.createClient();

// Check if the client is connected
if (publisher.connected) {
  console.log('Redis client is connected');
} else {
  console.log('Redis client is not connected');
}

subscriber.on('message', (channel, message) => {
  console.log(`Received message on channel "${channel}": ${message}`);
  // Handle the message as needed (e.g., emit events to clients)
});

publisher.on('error', (err) => {
  console.error('Redis Publisher Error:', err);
});

module.exports = {
  publishProductEvent: (message) => {
    if (publisher.connected) {
      publisher.publish('productEvents', message);
    } else {
      console.log('Redis publisher is not connected. Message not published.');
    }
    
  }
};