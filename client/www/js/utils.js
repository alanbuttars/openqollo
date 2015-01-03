/************************************/
/** True utility functions         **/
/************************************/

function exists(object) {
	return object != null && object != undefined;
}

function isEmpty(object) {
    if (object != null && object != undefined) {
        if (object instanceof Array) {
            return object.length == 0;
        }
        else if (object instanceof String || typeof object == 'string') {
            return object.length == 0;
        }
        return false;
    }
    return true;
}

function isNotEmpty(object) {
    return !isEmpty(object);
}

/************************************/
/** Logging functions              **/
/************************************/

function toString(object) {
    if (object === undefined) {
        return "undefined";
    }
    else if (object == null) {
        return "null";
    }
    else if (object instanceof Array) {
        return "[" + object.toString() + "]";
    }
    else {
        return object.toString();
    }
}

function log() {
    if (arguments.length == 1) {
        console.log(arguments[0])
    }
    else {
        var message = arguments[0];
        if (message.indexOf("{0}") == -1) {
            for (var i = 1; i < arguments.length; i++) {
                var argument = arguments[i];
                message += "," + toString(argument);
            }
            console.log(message);
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                var argument = arguments[i + 1];
                message = message.replace("{" + i + "}", toString(argument));
            }
            console.log(message);
        }
    }
}

/************************************/
/** Loading functions              **/
/************************************/

function startLoading() {
    $('body').append('<div id="curtain" class="reveal-modal-bg" style="display: block;"></div>');
    $('body').append('<div id="loader" class="spinner-container"><div class="spinner"></div></div>');
}

function stopLoading() {
    $('#curtain').remove();
    $('#loader').remove();
}

/************************************/
/** Date functions                 **/
/************************************/

var DateFormatter = (function() {

    var toLocalMoment = function(utcTimestamp) {
        var utcMoment = moment(utcTimestamp);
        var localOffset = moment().zone();
        var localMoment = utcMoment.subtract(localOffset, 'minutes');
        return localMoment;
    };

    var toCalendarTime = function(utcTimestamp) {
        var localMoment = toLocalMoment(utcTimestamp);
        var calendarMoment = localMoment.calendar();
        return calendarMoment;
    };

    var toRelativeTime = function(utcTimestamp) {
        var localMoment = toLocalMoment(utcTimestamp);
        var relativeMoment = localMoment.fromNow();
        return relativeMoment;
    };

    var toString = function(utcTimestamp, format) {
        var localMoment = formatRelative(utcTimestamp);
        var localMomentString = localMoment.format(format);
        return localMomentString;
    };

    return {
        toCalendarTime : toCalendarTime,
        toRelativeTime : toRelativeTime,
        toString : toString
    };
})();
