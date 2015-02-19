'use strict';
angular.module('mean.listedecourse').controller('ModalInstanceCtrl', function ($scope, $log, $modalInstance, listedecourse) {

  $scope.listedecourse = listedecourse;
  // $scope.selected = {
  //   item: $scope.items[0]
  // };

  // $scope.ok = function () {
  //   $modalInstance.close($scope.selected.item);
  // };
  $scope.print = function(divId){
    var printContents = document.getElementById(divId).innerHTML;    
    var popupWin = window.open('', '_blank', 'width=800,height=800');
    popupWin.document.open();
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</html>');
    popupWin.document.close();
  };
  //$scope.emit()
  $scope.toggle = function(scope) {
      $log.info('Toggle node : ' + scope);
      scope.toggle();
    };

  $scope.remove = function(scope) {
    $log.info('Remove node : ' + scope);
    scope.remove();
  };

  $scope.cancel = function () {
    $log.info('Cancel Popup ');
    $modalInstance.dismiss('cancel');
  };
});