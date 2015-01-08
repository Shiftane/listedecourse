'use strict';

var marmiton = require('../controllers/marmiton');

// The Package is past automatically as first parameter
module.exports = function(Marmitonsnippet, app, auth, database) {

  app.get('/marmitonsnippet/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.route('/marmitonsnippet/search/:q')
  .get(marmiton.searchMarmiton);


  app.route('/marmitonsnippet/recette/:url')
  .get(marmiton.getRecette);

  app.get('/marmitonsnippet/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/marmitonsnippet/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/marmitonsnippet/example/render', function(req, res, next) {
    Marmitonsnippet.render('index', {
      package: 'marmitonsnippet'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};


