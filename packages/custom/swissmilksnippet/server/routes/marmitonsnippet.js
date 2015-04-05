'use strict';

var marmiton = require('../controllers/swissmilk');

// The Package is past automatically as first parameter
module.exports = function(Swissmilksnippet, app, auth, database) {

  app.get('/swissmilksnippet/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.route('/swissmilksnippet/search/:q')
  .get(marmiton.searchMarmiton);


  app.route('/swissmilksnippet/recette/:url')
  .get(marmiton.getRecette);

  app.get('/swissmilksnippet/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/swissmilksnippet/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/swissmilksnippet/example/render', function(req, res, next) {
    Swissmilksnippet.render('index', {
      package: 'swissmilksnippet'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};


