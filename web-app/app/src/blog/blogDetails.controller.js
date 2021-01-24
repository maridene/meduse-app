class BlogDetailsCtrl {
    constructor(AppConstants, $sce, data) {
      'ngInject';
  
      this.appName = AppConstants.appName;
      this.$sce = $sce;
      this.post = data;
      this.postTitleInUrl = this.post.title.replaceAll(' ', '-');
    }

    trust(src) {
      return this.$sce.trustAsResourceUrl(src);
    }

    trustAsUrl(url) {
      return this.$sce.trustAsUrl(url);
    }

    share() {
      FB.ui(
        {
            method: 'feed',
            name: this.post.title,
            link: 'http://www.meduse.tn/#!/blog/'+ this.post.id + '-' + this.post.title.replaceAll(' ', '-'),
            picture: this.post.coverlink,
            caption: 'Meduse.tn',
            description: '',
            message: ''
        });
    }
  }
  
  export default BlogDetailsCtrl;