qolloApp.factory('AuthService', function($http, $q) {

    /**
     * Attempts to authenticate the user with the stored authentication data
     */
    var authenticate = function() {
        var deferred = $q.defer();

        $http.post('http://qollo.alanbuttars.com/server/rest/authenticate.php')
        .success(function(data) {
            log("[SUCCESS] authenticate: {0}", data);
            deferred.resolve(data);
        })
        .error(function(error) {
            log("[ERROR] authenticate: {0}", error);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    /**
     * Attempts to log in with credentials
     */
    var login = function(user) {
        var deferred = $q.defer();

        $http.post('http://qollo.alanbuttars.com/server/rest/login.php', user)
        .success(function(data) {
            log("[SUCCESS] login: {0}", data);
            deferred.resolve(data);
        })
        .error(function(error) {
            log("[ERROR] login: {0}", error);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    /**
     * Destroys the stored authentication data
     */
    var logout = function() {
        window.localStorage.setItem("tokenPublic", "");
        window.localStorage.setItem("tokenPrivate", "");
        window.localStorage.setItem("userId", "");
    };

    /**
     * Attempts to register the user with credentials
     */
    var register = function(user) {
        var deferred = $q.defer();

        $http.post('http://qollo.alanbuttars.com/server/rest/register.php', user)
        .success(function(data) {
            log("[SUCCESS] register: {0}", data);
            deferred.resolve(data);
        })
        .error(function(error) {
            log("[ERROR] register: {0}", error);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    return {
        authenticate : authenticate,
        login: login,
        logout : logout,
        register : register
    }

});

qolloApp.factory('UserService', function($http, $q) {

    /**
     * Gathers user data for the profile view
     */
    var getProfile = function() {
        var deferred = $q.defer();

        $http.post('http://qollo.alanbuttars.com/server/rest/user-profile.php')
        .success(function(data) {
            log("[SUCCESS] getProfile: {0}", data);
            deferred.resolve(data);
        })
        .error(function(error) {
            log("[ERROR] getProfile: {0}", error);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    /**
     * Gathers user data for the user's phone contacts
     */
    var getUserDetails = function(contacts) {
        var promises = [];

        for (var i = 0; i < getObjectSize(contacts); i+= 25) {
            var contactsSlice = getObjectSlice(contacts, i, i + 25);
            var promise = $http.post('http://qollo.alanbuttars.com/server/rest/user-details.php', contactsSlice);
            promises.push(promise);
        }

        return $q.all(promises);
    };

    return {
        getProfile : getProfile,
        getUserDetails : getUserDetails
    };
});

qolloApp.factory('ContactService', function($http, $q, $rootScope) {

    /**
     * Reads the user's phone contacts
     */
    var getContacts = function() {
        var deferred = $q.defer();

        var contactFields = ["id", "displayName", "phoneNumbers"];

        var contactFindOptions = { filter: "", multiple: true };

        var onGetContactsSuccess = function(unfilteredContacts) {
            var filteredContacts = {};
            for (var i = 0; i < unfilteredContacts.length; i++) {
                var unfilteredContact = unfilteredContacts[i];
                var displayName = unfilteredContact["displayName"];
                if (exists(displayName)) {
                    var phoneNumbersInfo = unfilteredContact["phoneNumbers"];
                    if (exists(phoneNumbersInfo)) {
                        var contactId = unfilteredContact["id"];
                        var phoneNumbers = getObjectValues(phoneNumbersInfo, "value");
                        var filteredContact = {displayName : displayName, phoneNumbers : phoneNumbers};
                        filteredContacts[contactId] = filteredContact;
                    }
                }
            }
            deferred.resolve(filteredContacts);
            $rootScope.$apply();
        };

        var onGetContactsError = function(contactsError) {
            log("[ERROR] getContacts: {0}", contactsError);
            deferred.reject(contactsError);
            $rootScope.$apply();
        };

        navigator.contacts.find(contactFields, onGetContactsSuccess, onGetContactsError, contactFindOptions);
        return deferred.promise;
    };

    return {
        getContacts : getContacts
    };
});

qolloApp.factory('DatabaseService', function($http, $q) {

    var cache = {};

    /**
     * Creates a connection to the local database
     */
    var getConnection = function() {
   		return window.openDatabase("openqollo", "1.0", "OpenQollo DB", 1000000);
    };

    /**
     * Stores a collection of user detail promises to the local database
     */
    var storeContactPromises = function(contactPromises) {
        var deferred = $q.defer();

        for (var i = 0; i < contactPromises.length; i++) {
            var contactPromise = contactPromises[i];
            if (exists(contactPromise)) {
                var contactData = contactPromise.data;
                if (exists(contactData)) {
                    var dataSuccess = contactData["success"];
                    var dataErrors = contactData["errors"];

                    if (exists(dataSuccess)) {
                        storeContacts(dataSuccess);
                    }
                    else if (exists(dataErrors)) {
                        deferred.reject(dataErrors);
                    }
                    else {
                        deferred.reject("Failed to retrieve promise data");
                    }
                }
            }
        }

        deferred.resolve();
        return deferred.promise;
    };

    /**
     * Stores the user's phone contacts and user details to the local database
     */
    var storeContacts = function(contacts) {

        var wrapInt = function(val) {
            if (exists(val)) {
                return val;
            }
            return "NULL";
        };

        var wrapString = function(val) {
            if (exists(val)) {
                return "\"" + val + "\"";
            }
            return "NULL";
        };

        var store = function(transaction) {
            transaction.executeSql(
                'create table if not exists contacts ' + //
                '(qolloId integer primary key autoincrement, ' + //
                'contactId integer unique, ' + //
                'userId integer unique, ' + //
                'displayName text unique, ' + //
                'friendshipId integer unique, ' + //
                'friendshipType text, ' + //
                'friendshipStatus text, ' + //
                'invited integer)'
            );
            for (var i = 0; i < contacts.length; i++) {
                var contact = contacts[i];
                var sql =   "insert or replace into contacts " + //
                            "(contactId, userId, displayName, friendshipId, friendshipType, friendshipStatus, invited) " + //
                            "values (" + //
                            [   wrapInt(contact["contactId"]),
                                wrapInt(contact["userId"]),
                                wrapString(contact["displayName"]),
                                wrapInt(contact["friendshipId"]),
                                wrapString(contact["friendshipType"]),
                                wrapString(contact["friendshipStatus"]),
                                "coalesce((select invited from contacts where contactId = " + contact["contactId"] + "), 0)"
                            ].join() + //
                            ")";
                transaction.executeSql(sql);
            }
        };

        var onStoreSuccess = function() {
        };

        var onStoreError = function(storeError) {
            log("[ERROR] store: {0}", storeError);
        };

        var connection = getConnection();
        connection.transaction(store, onStoreError, onStoreSuccess);
    };

    /**
     * Retrieves contact user data from the local database according to the contact type
     */
    var getContactsByTypeFromDatabase = function(type) {
        var deferred = $q.defer();

        var connection = getConnection();
        connection.transaction(
            function(transaction) {
                var sql = null;
                var params = [];
                if (type == "friends") {
                    sql =   "select contactId, userId, displayName, friendshipId from contacts " + //
                            "where friendshipStatus = 'accepted' " + //
                            "order by displayName";
                }
                else if (type == "users") {
                    sql =   "select contactId, userId, displayName, friendshipId, friendshipType, friendshipStatus from contacts " + //
                            "where userId is not null " + //
                            "and friendshipStatus is not 'accepted' " + //
                            "and (friendshipType is not 'received' " + //
                            "or (friendshipType = 'received' and friendshipStatus is not 'accepted')) " + //
                            "and userId is not ? " + //
                            "order by displayName";
                    params.push(window.localStorage.getItem("userId"));
                }
                else if (type == "contacts") {
                    sql =   "select contactId, displayName from contacts " + //
                            "where userId is null " + //
                            "order by displayName";
                }
                else {
                    log("[ERROR] getContactsByTypeFromDatabase: {0} is not a valid type", type);
                    deferred.reject(type + " is not a valid type");
                }

                transaction.executeSql(sql, params,
                    function(transaction, results) {
                        log("[SUCCESS] getContactsByTypeFromDatabase: type {0} returned {1} rows", type, results.rows.length);
                        var contacts = [];
                        for (var i = 0; i < results.rows.length; i++) {
                            var contact = results.rows.item(i);
                            contacts.push(contact);
                        }
                        deferred.resolve(contacts);
                    },
                    function(transaction, error) {
                        log("[ERROR] getContactsByTypeFromDatabase: transaction={0}, error={1}", transaction, error);
                        deferred.reject(error);
                    }
                );
            },
            function(error) {
                log("[ERROR] getContactsByTypeFromDatabase: {0}", error);
                deferred.reject(error);
            }
        );
        return deferred.promise;
    };

    /**
     * Retrieves contact user data from the cache first, and then from the database according to the contact type
     */
    var getContactsByType = function(type) {
        var cachedValues = cache[type];
        if (exists(cachedValues)) {
            if (!isEmpty(cachedValues)) {
                return cachedValues;
            }
        }
        cache[type] = getContactsByTypeFromDatabase(type);
        return cache[type];
    };

    return {
        storeContactPromises : storeContactPromises,
        getContactsByType : getContactsByType
    };
});