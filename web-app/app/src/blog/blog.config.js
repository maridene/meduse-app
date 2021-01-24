function BlogConfig($stateProvider, $sceProvider) {
    'ngInject';
    $sceProvider.enabled(false);
    $stateProvider
        .state('app.blog', {
          url: '/blog',
          controller: 'BlogCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'blog/blog.html',
          title: 'Blog',
          data: {
            meta: {
              'title': 'Blog'
            }
          },
          resolve: {
            data: function(BlogService, $state, $stateParams) {
              return BlogService.getAll().then(
                (data) => {
                  return data;
                },
                (err) => $state.go('app.home')
              )
            },
            tags: function(BlogService, $state) {
              return BlogService.getTags().then(
                (tags) => {
                  return tags;
                },
                (err) => $state.go('app.home')
              )
            }
          }
        })
        .state('app.blog-details', {
          url: '/blog/:slug',
          controller: 'BlogDetailsCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'blog/blog-details.html',
          resolve: {
            data: function(BlogService, $state, $stateParams, ngMeta) {
              const id = $stateParams.slug.split('-')[0];
              if (!isNaN(id)) {
                return BlogService.getById(id).then(
                  (data) => {
                    ngMeta.setTitle(data.title);
                    ngMeta.setTag('og:image', data.coverlink);
                    ngMeta.setTag('og:description', data.description);
                    ngMeta.setTag('og:title', data.title);
                    return data;
                  }, () => $state.go('app.home'));
              } else {
                $state.go('app.home');
              }
            }
          },
          meta: {
            disableUpdate: true
          }
        });
  
  };
  
  export default BlogConfig;