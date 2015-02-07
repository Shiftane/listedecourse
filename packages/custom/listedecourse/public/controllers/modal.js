'use strict';
angular.module('mean.listedecourse').controller('ModalInstanceCtrl', function ($scope, $modalInstance, listedecourse) {

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


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});