import angular from 'angular';

// Create the module where our functionality can attach to
let index = angular.module('app.blog', []);

// Include our UI-Router config settings
import BlogConfig from './blog.config';
index.config(BlogConfig);


// Controllers
import BlogCtrl from './blog.controller';
index.controller('BlogCtrl', BlogCtrl);

import BlogDetailsCtrl from './blogDetails.controller';
index.controller('BlogDetailsCtrl', BlogDetailsCtrl);

export default index;