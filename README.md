# [Listedecourse.ch](http://www.listedecourse.ch)  based on  [MEAN Stack](http://mean.io/)

[![Build Status](https://travis-ci.org/Shiftane/listedecourse.svg?branch=master)](https://travis-ci.org/Shiftane/listedecourse)
[![Dependencies Status](https://david-dm.org/Shiftane/listedecourse.svg)](https://david-dm.org/Shiftane/listedecourse)


## Prerequisites
* Node.js - Download and Install [Node.js](http://www.nodejs.org/download/). You can also follow [this gist](https://gist.github.com/isaacs/579814) for a quick and easy way to install Node.js and npm
* MongoDB - Download and Install [MongoDB](http://docs.mongodb.org/manual/installation/) - Make sure `mongod` is running on the default port (27017). And must be in the same directory as listedecourse with the folder name mongodb

### Tools Prerequisites
* NPM - Node.js package manage; should be installed when you install node.js.
* Bower - Web package manager. Installing [Bower](http://bower.io/) is simple when you have `npm`:

```
$ npm install -g bower
```

### Optional [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
* Grunt - Download and Install [Grunt](http://gruntjs.com).
```
$ npm install -g grunt-cli
```


  We recommend using [Grunt](https://github.com/gruntjs/grunt-cli) to start the server:

    $ grunt

  If grunt aborts because of JSHINT errors, these can be overridden with the `force` flag:

    $ grunt -f

  Alternatively, when not using `grunt` you can run:

    $ node server

  Then, open a browser and go to:

    http://localhost:3000


* Issue with bson lib


#### Installation problems on Windows 8 / 8.1
Some of Mean.io dependencies uses [node-gyp](https://github.com/TooTallNate/node-gyp) with supported Python version 2.7.x. So if you see an error related to node-gyp rebuild follow next steps:

1. install [Python 2.7.x](https://www.python.org/downloads/)
2. install [Microsoft Visual Studio C++ 2012 Express](http://www.microsoft.com/ru-ru/download/details.aspx?id=34673)
3. fire NPM update
````
$ npm update -g
````


To simply run tests

    $ npm test

> NOTE: Running Node.js applications in the __production__ environment enables caching, which is disabled by default in all other environments.

## License
[The MIT License](http://opensource.org/licenses/MIT)
