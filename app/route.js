const formValidator = require('./form_validator');
const photoModel = require('./photo_model');
//const logger = require('./logger'); 
const express = require('express');
const {PubSub} = require('@google-cloud/pubsub'); 
const { Storage } = require('@google-cloud/storage');
const env = require('../project-id-9307823999230114798-b3157dde6a00');

let storage = new Storage({
  projectId: env['project_id'],
  credentials: env
});
function route(app) {
  app.get('/', (req, res) => { 

    const tags = req.query.tags;
    const tagmode = req.query.tagmode;

    const ejsLocalVariables = {
      tagsParameter: tags || '',
      tagmodeParameter: tagmode || '',
      photos: [],
      searchResults: false,
      invalidParameters: false
    };

    // if no input params are passed in then render the view with out querying the api
    if (!tags && !tagmode) {
      return res.render('index', ejsLocalVariables);
    }

    const name = "";

    // validate query parameters
    if (!formValidator.hasValidFlickrAPIParams(tags, tagmode)) {
      ejsLocalVariables.invalidParameters = true;
      return res.render('index', ejsLocalVariables);
    }
 
    // get photos from flickr public feed api
    return photoModel
      .getFlickrPhotos(tags, tagmode)
      .then(photos => {
        ejsLocalVariables.photos = photos;
        ejsLocalVariables.searchResults = true;
        return res.render('index', ejsLocalVariables);
      })
      .catch(error => {
        return res.status(500).send({ error });
      });
  });

  app.post('/zip', (req, res) => {   
    const tags = req.query.tags;
    
    const env = require('../project-id-9307823999230114798-b3157dde6a00');
    const pubsub = new PubSub({
      projectId: env['project_id'],
      credentials: env
    });
    const topic = pubsub.topic("loris"); 
 
    topic.publish(Buffer.from(tags));

    
    
    // cloud storage
    const options = {
      action: 'read',
      expires: '03-09-2491'
     };
     const signedUrls = storage
      .bucket("dmii2bucket")
      .file("lolo.zip")
      .getSignedUrl(options)
      .then(signedUrls => {
        res.redirect(signedUrls[0])
      });


  });
}

module.exports = route;
