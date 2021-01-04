class BlogDetailsCtrl {
    constructor(AppConstants, $sce, data) {
      'ngInject';
  
      this.appName = AppConstants.appName;
      this.$sce = $sce;
      this.post = data;
      this.postTitleInUrl = this.post.title.replaceAll(' ', '-');
      //this.shareLink = `https://www.facebook.com/plugins/like.php?href=http://meduse.tn/#!/blog/${this.post.id}-${this.postTitleInUrl}&width=450&layout=standard&action=like&size=small&share=true&height=35&appId=227189032141937`;
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
            picture: 'http://www.meduse.tn/static/blogs/' + this.post.coverlink,
            caption: 'Meduse.tn',
            description: '',
            message: ''
        });
    }
  }
  
  export default BlogDetailsCtrl;