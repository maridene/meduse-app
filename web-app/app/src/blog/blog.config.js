function BlogConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
        .state('app.blog', {
          url: '/blog',
          controller: 'BlogCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'blog/blog.html',
          title: 'Blog'
        });
  
  };
  
  export default BlogConfig;