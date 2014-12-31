'use strict';

qolloApp.directive('focusDirective', function() {

	var getNextInput = function(currentInput) {
		var next = $(':input:eq(' + ($(':input').index(currentInput) + 1) + ')');
		return next;
	};

	return {
		restrict: 'A',
		link: function($scope, elem, attrs) {
			elem.bind('keyup', function(e) {
				var code = e.keyCode || e.which;
				if (code == 13) {
					e.preventDefault();
					var nextInput = getNextInput(this);
					if ($(nextInput).length) {
						nextInput.focus();
					} else {
						$(elem).blur(); // for ios
						var softKeyboard = window.cordova.plugins.SoftKeyBoard;
						softKeyboard.hide();
					}
				}
			});
		}
	};
});