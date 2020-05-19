'use strict';

angular.module('meduseApp.version', [
  'meduseApp.version.interpolate-filter',
  'meduseApp.version.version-directive'
])

.value('version', '0.1');
