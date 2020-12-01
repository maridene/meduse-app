class BlogDetailsCtrl {
    constructor(AppConstants, $sce, data) {
      'ngInject';
  
      this.appName = AppConstants.appName;
      this.$sce = $sce;
      this.post = data;
    }

    trust(src) {
      return this.$sce.trustAsResourceUrl(src);
    }
  }
  
  export default BlogDetailsCtrl;