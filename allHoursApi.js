'use strict'

function AllHoursApi(currentUser) {
    var _this = this;
    _this.baseApiUrl = 'https://dave-allhoursapi2.azurewebsites.net/api/';

    _this.currentUser= currentUser;
    //_this.accessToken = undefined;

    
    _this.getUser = function () {
        //var accessToken = _this.accessToken;

        return new Promise(
            function (resolve, reject) {
                console.info("api: getting user");

                $.ajax({
                    url: _this.baseApiUrl + "currentuser",
                    headers: {
                        "Authorization": "Bearer " + _this.currentUser.accessToken
                    },
                    type: "GET",
                    success: function (data) {
                        return resolve(data)
                    },
                    error: function (data) {
                        console.error(data);
                        return reject(Error());
                    }
                });
            }
        )
    }

    _this.getAccessToken = function (email, password) {
        return new Promise(
            function (resolve, reject) {
                console.info("api: getting token");

                $.ajax({
                    url: _this.baseApiUrl + "tokens",
                    type: "POST",
                    data: {
                      clientId: "45541f8d-972c-4737-a685-26e892fbb7af",
                      email: email,
                      grantType: "password",
                      password: password
                    },
                    success: function (data) {
                        return resolve(data);
                    },
                    error: function (data) {
                        console.error(data);
                        return reject(Error());
                    }
                });
            }
        )
    }

    _this.getClock = function(date){
        var accessToken = _this.accessToken;
        return new Promise(
            function (resolve, reject) {
                console.info("api: getting clocking data");

                $.ajax({
                    url:  _this.baseApiUrl + "clock",
                    headers: {
                      "Authorization": "Bearer " + _this.currentUser.accessToken
                    },
                    type: "GET",
                    success: function (data) {
                         resolve(data);
                    },
                    error: function () {
                     
                        reject(Error());
                    }
                });
            }
        )


    }

};