'use strict';

angular.module('mappXL-main', [
	'appFilters',
	'home','locator','header','scroll','userViewDirective'
]);

angular.module('mappXL-tasks', [
	'appFilters',
	'tasks','feedbackDirective','ngRateIt','header','scroll','confirmDialogDirective'
]);