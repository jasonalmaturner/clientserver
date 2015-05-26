(function(){
  angular
    .module('csFeedback')
    .directive('deskPreview', deskPreview);
  function deskPreview(){
    return {
      restrict: 'E',
      scope: {
        preview: '=',
        noEmail: '@',
        commentBox: '@',
        submitComment: '&'
      },
      templateUrl: 'desk-directive/deskPreview.html',
      controllerAs: 'desk',
      bindToController: true,
      controller: function($scope){
        var vm = this;

        vm.submit = submit;

        function submit(comment){
          vm.submitComment({comment: comment});
        }
      }
    };
  }
})();
