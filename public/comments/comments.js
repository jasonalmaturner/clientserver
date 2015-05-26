(function(){
    angular
        .module("csFeedback")
        .controller("commentsCtrl", commentsCtrl);
    function commentsCtrl(dataService){
        var vm = this;

        vm.preview = {};
        vm.commentSubmit = commentSubmit;

        _init();

        function commentSubmit(comment){
          dataService.submitFeedback(comment)
            .then(function(response){
              console.log(response);
            }, function(err){
              console.log(err);
            });
        }

        function _init(){
          dataService.getPreview()
          .then(function(response){
            vm.preview = response;
          }, function(err){
            console.log(err);
          });
        }

    }
})();
