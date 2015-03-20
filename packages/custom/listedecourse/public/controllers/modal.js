'use strict';
angular.module('mean.listedecourse').controller('ModalInstanceCtrl', function ($scope, $log, $modalInstance, listedecourse, $analytics) {

  $scope.listedecourse = listedecourse;
  // $scope.selected = {
  //   item: $scope.items[0]
  // };

  // $scope.ok = function () {
  //   $modalInstance.close($scope.selected.item);
  // };
  $scope.print = function(divId){
    $analytics.pageTrack('printRecipe');
    var printContents = document.getElementById(divId).innerHTML;    
    var popupWin = window.open('', '_blank', 'width=800,height=800');
    popupWin.document.open();
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="/bower_components/bootstrap/dist/css/bootstrap.css" /><link rel="stylesheet" type="text/css" href="/listedecourse/assets/css/print.css" /></head><body onload="window.print()">' + printContents + '</html>');
    
    popupWin.document.close();
  };
  
  $scope.toggle = function(scope) {
      $analytics.pageTrack('toggleRecipe');
      $log.info('Toggle node : ' + scope);
      scope.toggle();
    };

  $scope.remove = function(scope) {
    $analytics.pageTrack('removeIngredient');
    $log.info('Remove node : ' + scope);
    scope.remove();
  };

  $scope.cancel = function () {
    $analytics.pageTrack('leaveListedeCourse');
    $log.info('Cancel Popup ');
    $modalInstance.dismiss('cancel');
  };
});