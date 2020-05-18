'use strict';

angular.module('meduseApp.core.header', ['meduseApp.core.category'])
  .component('muHeader', {
    templateUrl: 'core/components/header/header.html',
    binding: {

    },
    controller(CategoryService) {
      CategoryService.getAllCategories()
          .then((result) => {
            this.categories = result;
          });
    }
  });
