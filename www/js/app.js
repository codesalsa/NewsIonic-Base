angular.module('newsionic', ['ionic', 'newsionic.controllers', 'ionicLazyLoad'])

.run(function($ionicPlatform, $ionicPopup) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  $ionicPlatform.registerBackButtonAction(function(event) {
    if (true) { // your check here
      $ionicPopup.confirm({
        title: 'System warning',
        template: 'are you sure you want to exit?'
      }).then(function(res) {
        if (res) {
          ionic.Platform.exitApp();
        }
      })
    }
  }, 100);
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'NewsCtrl'
	  })

	.state('app.posts', {
      url: '/posts',
      views: {
        'menuContent': {
          templateUrl: 'templates/posts.html',
        }
      }
    })
	
	.state('app.post', {
		url: "/posts/:postId",
		views: {
		  'menuContent': {
			templateUrl: "templates/post.html",
			controller: 'PostCtrl'
		  }
		}
	})
	
	.state('app.category', {
		url: "/category/:catSlug",
		views: {
		  'menuContent': {
			templateUrl: "templates/category.html",
			controller: 'CategoryCtrl'
		  }
		}
	})

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/posts');
});
