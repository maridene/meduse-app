'use strict';

angular.module('sbAdminApp').service('ModalService', [function () {
  
    function showErrorModal(message) {
        showModal(MODAL_TITLE_LABEL.ERROR, message);
    }

    function showWarningModal(message) {
        showModal(MODAL_TITLE_LABEL.WARNING, message);
    }

    function showSuccessModal(message) {
        showModal(MODAL_TITLE_LABEL.SUCCESS, message);
    }

    function showCustomModal(title, message) {
        showModal(title, message);
    }

    return {
        showErrorModal,
        showWarningModal,
        showSuccessModal,
        showCustomModal
    }

}]);