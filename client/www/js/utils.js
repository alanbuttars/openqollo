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

    var second  = 1000;
    var minute  = 60 * second;
    var hour    = 60 * minute;
    var day     = 24 * hour;
    var week    = 7 * day;
    var year    = 365 * day;

    var months = {
        0: {short: "Jan", long: "January"},
        1: {short: "Feb", long: "February"},
        2: {short: "Mar", long: "March"},
        3: {short: "Apr", long: "April"},
        4: {short: "May", long: "May"},
        5: {short: "Jun", long: "June"},
        6: {short: "Jul", long: "July"},
        7: {short: "Aug", long: "August"},
        8: {short: "Sep", long: "September"},
        9: {short: "Oct", long: "October"},
        10: {short: "Nov", long: "November"},
        11: {short: "Dec", long: "December"}
    };

    var days = {
        0: {short: "Mon", long: "Monday"},
        1: {short: "Tue", long: "Tuesday"},
        2: {short: "Wed", long: "Wednesday"},
        3: {short: "Thu", long: "Thursday"},
        4: {short: "Fri", long: "Friday"},
        5: {short: "Sat", long: "Saturday"},
        6: {short: "Sun", long: "Sunday"},
    };


    var getShortMonth = function(timestamp) {
        var monthIndex = timestamp.getMonth();
        var monthInfo = months[monthIndex];
        return monthInfo["short"];
    };

    var getMonth = function(timestamp) {
        var monthIndex = timestamp.getMonth();
        var monthInfo = months[monthIndex];
        return monthInfo["long"];
    };

    var getShortDay = function(timestamp) {
        var dayIndex = timestamp.getDay();
        var dayInfo = days[dayIndex];
        return dayInfo["short"];
    };

    var getDay = function(timestamp) {
        var dayIndex = timestamp.getDay();
        var dayInfo = days[dayIndex];
        return dayInfo["long"];
    }

    var fromUTC = function(utcTimestamp) {
        var offsetMinutes = new Date(utcTimestamp * 1000).getTimezoneOffset();
        var offsetSeconds = offsetMinutes * second;
        return new Date((utcTimestamp * 1000) - offsetSeconds);
    };

    var toUTC = function(clientTimestamp) {
        var clientDate = new Date(clientTimestamp);
        return new Date(//
        	clientDate.getUTCFullYear(), //
        	clientDate.getUTCMonth(),//
        	clientDate.getUTCDate(), //
        	clientDate.getUTCHours(), //
        	clientDate.getUTCMinutes(), //
        	clientDate.getUTCSeconds()
        );
    };

    var getFormattedTime = function(date, dayOnly, longForm) {
    	var hours = date.getHours();
    	var minutes = date.getMinutes();
    	if (minutes < 10) {
    		minutes = "0" + minutes;
    	}
    	var time = "AM";
    	if (hours == 12) {
    		time = "PM";
    	}
    	else if (hours > 11) {
    		hours -= 12;
    		time = "PM";
    	}

    	if (dayOnly) {
    		var day = longForm? getDay(date) : getShortDay(date);
    		return day + " " + hours + ":" + minutes + " " + time;
    	}
    	else {
    		var month = longForm? getMonth(date) : getShortMonth(date);
    		var day = date.getDate();
    		var year = date.getFullYear();
    		var currentYear = new Date().getFullYear();
    		if (year == currentYear) {
    			return month + " " + day + ", " + year + " " + hours + ":" + minutes + " " + time;
    		}
    		return month + " " + day + " " + hours + ":" + minutes + " " + time;
    	}
    };

    var formatRelativeDate = function(utcDate, longForm) {
    	if (!exists(utcDate)) {
    		return null;
    	}
    	var utcNow = toUTC(new Date());

    	var delta = utcNow - utcDate;
    	if (delta < minute) {
    		return "Now";
    	}
    	else if (delta < (2 * minute) && longForm) {
    		return "1 minute ago";
    	}
    	else if (delta < (2 * minute)) {
    		return "1 min";
    	}
    	else if (delta < hour && longForm) {
    		return new Date(delta).getMinutes() + " minutes ago";
    	}
    	else if (delta < hour) {
    		return new Date(delta).getMinutes() + " mins";
    	}
    	else if (delta < (2 * hour) && longForm) {
    		return "1 hour ago";
    	}
    	else if (delta < (2 * hour)) {
    		return "1 hour";
    	}
    	else if (delta < day && longForm) {
    		return Math.floor(delta / hour) + " hours ago";
    	}
    	else if (delta < day) {
    		return Math.floor(delta / hour) + " hours";
    	}
    	else if (delta < week) {
    		var clientDate = fromUTC(utcDate);
    		return getFormattedTime(clientDate, true, longForm);
    	}
    	else if (delta < year) {
    		var clientDate = fromUTC(utcDate);
    		return getFormattedTime(clientDate, false, longForm);
    	}
    	var clientDate = fromUTC(utcDate);
    	return getFormattedTime(clientDate, true, longForm);
    };

    var formatShortRelative = function(utcTimestamp) {
        return formatRelativeDate(utcTimestamp, false);
    };

    var formatRelative = function(utcTimestamp) {
        return formatRelativeDate(utcTimestamp, true);
    };

    var formatShortDate = function(utcTimestamp) {
		var clientDate = fromUTC(utcTimestamp);
    	return getFormattedTime(clientDate, true, true);
    };

    var formatDate = function(utcTimestamp) {
    	var clientDate = fromUTC(utcTimestamp);
    	return getFormattedTime(clientDate, false, true);
    };

    return {
        formatShortRelative : formatShortRelative,
        formatRelative : formatRelative,
        formatShortDate : formatShortDate,
        formatDate : formatDate
    };
})();
