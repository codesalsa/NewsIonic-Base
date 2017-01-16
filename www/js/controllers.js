angular.module('newsionic.controllers', ['ionic'])

.controller('NewsCtrl', function($scope, $ionicLoading, $stateParams, $http, $timeout) {
	
	// Change your json API url here with http://crossorigin.me/http://yourwordpressurl/wp-json/posts
	
	$scope.newsAPI = 'http://crossorigin.me/http://pixelmarketing.biz/news/wp-json/posts/'; 
	
	
	$scope.show = function() {
		$ionicLoading.show({
			template: 'Loading...'
		});
	};
	
	$scope.hide = function(){
		$ionicLoading.hide();
	};
	
	$scope.categories = [];
	$scope.posts = [];
	
	
	// Scroll to Refresh
	$scope.doRefresh = function() {
		$http.get($scope.newsAPI).success(function(data){
			$scope.posts = data;
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	
	//Fetch the Categories list to show in Sliding Menu
	$http.get($scope.newsAPI+'types/posts/taxonomies/category/terms').success(function(data){
		$scope.categories = data;
	});
	
	$scope.show();
	
	$scope.loadPosts = function() {
		// Fetch the Latest Posts
		$http.get($scope.newsAPI).success(function(data){
			$scope.posts = data;
			window.localStorage.setItem("posts", JSON.stringify(data));
			$scope.hide();
		})
		.error(function(data) {
            if(window.localStorage.getItem("posts") !== undefined) {
                $scope.posts = JSON.parse(window.localStorage.getItem("posts"));
            }
        });
	};
	
	
	
	// Load posts on page load
    $scope.loadPosts();

    paged = 2;
    $scope.moreItems = true;
	
	$scope.loadMore = function() {

      if( !$scope.moreItems ) {
        return;
      }

      var pg = paged++;

      $timeout(function() {

        $http.get($scope.newsAPI+'?page=' + pg).success(function(data, status, headers, config){
          angular.forEach( data, function( value, key ) {
            $scope.posts.push(value);
          });

          if( data.length <= 0 ) {
            $scope.moreItems = false;
          }
        }).
        error(function(data, status, headers, config) {
          $scope.moreItems = false;
          console.log('error');
        });

        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.resize');

      }, 1000);

    }

    $scope.moreDataExists = function() {
      return $scope.moreItems;
    }
	
	
})


.controller('CategoryCtrl', function($scope, $ionicLoading, $stateParams, $http) {
	
	$scope.doRefresh = function() {
		$http.get($scope.newsAPI+'?filter[category_name]='+$stateParams.catSlug).success(function(data){
			$scope.catPosts = data;
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	
	$scope.catPosts = [];
	
	
	$scope.show();
	
	$http.get($scope.newsAPI+'?filter[category_name]='+$stateParams.catSlug).success(function(data){
		$scope.catPosts = data;
		$scope.hide();
	});
	
})

.controller('PostCtrl', function($scope, $stateParams, $sce, $ionicLoading, $http ) {

	
	$scope.post = [];

	$scope.show();

	$http.get($scope.newsAPI+$stateParams.postId).success(function(data){
		$scope.post = data;

		$scope.hide();
	});
 
})
