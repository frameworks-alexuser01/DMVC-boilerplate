angular.module('hs.irc')
  .directive('touchStart', ['CONFIG', function (CONFIG) {
    return {
      restrict: 'A',
      scope: {
        touchStart: '&'
      },
      link: function (scope, element, attr) {

        if (CONFIG.phone) {
          var touchStart = function (event) {
            event.preventDefault();
            event.stopPropagation();
            scope.touchStart({
              '$event': event
            });
            scope.$apply();
          };
          var click = function (event) {
            event.preventDefault();
          };
          element.on('touchstart', touchStart);
          element.on('click', click);
          scope.$on('$destroy', function () {
            element.off('click', click);
            element.off('touchstart', touchStart);
          });

        } else {
          var click = function (event) {
            event.preventDefault();
            event.stopPropagation();
            scope.touchStart({
              '$event': event
            })
            scope.$apply();
          };

          scope.$on('$destroy', function () {
            element.off('click', click);
          });

          element.on('click', click);
        }

      }
    };
  }]);
