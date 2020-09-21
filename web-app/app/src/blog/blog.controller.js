class BlogCtrl {
    constructor(data, AppConstants, $sce) {
      'ngInject';
  
      this.appName = AppConstants.appName;
      this.blogItems = data;
      this.$sce = $sce;
    }

    trust(src) {
      return this.$sce.trustAsResourceUrl(src);
    }
  }
  
  export default BlogCtrl;