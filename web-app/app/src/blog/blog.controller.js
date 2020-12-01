class BlogCtrl {
    constructor(data, tags, AppConstants, $sce) {
      'ngInject';
  
      this.appName = AppConstants.appName;
      this.blogItems = data;
      this.tags = tags.map((each) => ({label: each, isSelected: false}));
      this.filteredBlogItems = data;
      this.filterText = '';
      this.$sce = $sce;
    }

    trust(src) {
      return this.$sce.trustAsResourceUrl(src);
    }

    filterTextChanged() {
      this.filteredBlogItems = this.blogItems.filter((each) => each.title.toLowerCase().includes(this.filterText.toLowerCase()));
    }

    selectTag(tag) {
      tag.isSelected = !tag.isSelected;
      this.updateFiltered();
    }

    updateFiltered() {
      const selectedTags = this.tags.filter(each => each.isSelected).map(each => each.label);
      if (selectedTags.length) {
        this.filteredBlogItems = this.blogItems.filter(each => each.tags.some((blogTag) => selectedTags.includes(blogTag)));
      } else {
        this.filteredBlogItems = this.blogItems;
      }
      this.filteredBlogItems = this.filteredBlogItems.filter((each) => each.title.toLowerCase().includes(this.filterText.toLowerCase()));
    }
  }
  
  export default BlogCtrl;