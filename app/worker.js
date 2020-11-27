const {PubSub} = require('@google-cloud/pubsub');
const request = require('request');
const ZipStream = require('zip-stream'); 
const photoModel = require('./photo_model');
const { Storage } = require('@google-cloud/storage');
const { STATUS } = require('./worker-status');
const env = require('../project-id-9307823999230114798-b3157dde6a00');
var sha1 = require('sha1');

// Instantiates a client
const pubsub = new PubSub({
  projectId: env['project_id'],
  credentials: env
});

const timeout = 500;

function listenForMessages() {
  // References an existing subscription
  const subscription = pubsub.subscription("loris");

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = async message => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    
    let storage = new Storage({
      projectId: env['project_id'],
      credentials: env
    });
    let tags = message.data.toString();  

    const photos = await photoModel.getFlickrPhotos(tags, '');
    
    // Create zip
    var zip = new ZipStream() 
    
    const filename ="lolo.zip"; 

    // Create bucket
    const file = storage
      .bucket("dmii2bucket")
      .file('public/users/' + filename);

    const stream = file.createWriteStream(
      {
        metadata: {
          contentType: zip.mimetype,
        cacheControl: 'private' 
        },
      resumable: false
      }
    );

    zip.pipe(stream);

    var queue = photos.map((v, index) => {
      return {
        title: "img-" + index + ".jpg", 
        media: v.media.m
      }
    });  

    function addNextFile() {
        var elem = queue.shift()
        console.log(elem.title);
        var stream = request(elem.media)
        zip.entry(stream, { name: elem.title }, err => { 
            if(err)
                throw err;
            console.log(queue.length);
            if(queue.length > 0) { 
              console.log("NEXT FILE", queue);
              addNextFile()
            }  
            else {
              console.log("FINALISE");
              zip.finalize();
              final(); 
            } 
        })
    }

    addNextFile();

    let final = () => { 
      new Promise ((resolve, reject) => {
        stream.on('error', (err) => {
          reject(err);
        });
        stream.on('finish', () => {
          resolve('Ok'); 
          file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
          }).then(signed => {
            console.log(signed);
          });
        });
        stream.end(zip.buffer); 
      }); 
      // process.exit(0);
  
      // "Ack" (acknowledge receipt of) the message
      message.ack();
    } 
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
  }, timeout * 1000);
}

listenForMessages();
  
 