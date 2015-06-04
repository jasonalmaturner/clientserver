void function(angular){
  angular.module('csFeedback')
  .service('dataService', function($http, $location, $q){
   
    this.getPreview = function(){
      var survey_id = window.location.pathname.split('/')[2];
      var dfd = $q.defer();
      $http({
        method: 'GET',
        url: '/api/save-survey?survey_id=' + survey_id
      })
      .then(function(response){
        dfd.resolve(response.data);
      }, function(err){
        dfd.reject(err);    
      });
      return dfd.promise;
    };

    this.submitFeedback = function(comment){
      var survey_id = window.location.pathname.split('/')[2];
      var contact_id = window.location.search.split('=')[1];
      var dfd = $q.defer();
      $http({
        method: 'POST',
        url: '/api/respond/feedback?survey_id=' + survey_id + '&contact_id=' + contact_id,
        data: { feedback: comment }
      })
      .then(function(response){
        dfd.resolve(response.data);
      }, function(err){
        dfd.reject(err);    
      });
      return dfd.promise;
    };


  });
}(angular)

