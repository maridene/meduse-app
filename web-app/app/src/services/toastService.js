import { ApiConstants } from '../config/app.constants';
import { RESOURCE } from '../constants';

export default class ToastService {
  constructor($mdToast) {
    'ngInject';
    
    this.$mdToast = $mdToast;
  }

  showSimpleToast(text) {

    this.$mdToast.show(
      this.$mdToast.simple()
      .textContent(text)
      .position('top right')
      .hideDelay(3000))
    .then(function() {
      console.log('Toast dismissed.');
    }).catch(function() {
      console.log('Toast failed or was forced to close early by another toast.');
    });
  }
}
