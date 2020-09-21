function BlogConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
        .state('app.blog', {
          url: '/blog',
          controller: 'BlogCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'blog/blog.html',
          title: 'Blog',
          resolve: {
            data: function(BlogService, $state, $stateParams) {
              return BlogService.getAll().then(
                (data) => {
                  return data;
                },
                (err) => $state.go('app.home')
              )
            }
          }
        });
  
  };
  
  export default BlogConfig;