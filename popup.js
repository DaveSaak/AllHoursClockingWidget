'use strict'

$(document).ready(function () {
    new popup();
});

function popup() {
    console.info('init');
    var _this = this;

    //_this.currentDate = moment();
    _this.currentUser = new CurrentUser();
    _this.allHoursApi = new AllHoursApi(_this.currentUser);

    _this.currentUser.load(function () {
        console.info(_this.currentUser);

        if (_this.currentUser.accessToken == undefined) {
            console.info('access token is undefined');

            if (_this.currentUser.email != undefined) {
                $('#email').val(_this.currentUser.email);
            }

            showLoginPage();
        } else {
            showMainPage();
        }
    })


    function initInterface() {

        $('#loginButton').click(function () {
            login($('#email').val(), $('#password').val());
        });

        $('#loginContainer input').keyup(function (e) {
            if (e.keyCode == 13) {
                login($('#email').val(), $('#password').val());
            }
        });


        $('#logOutButton').click(function () {
            _this.currentUser.clear();
            showLoginPage();
        });

    }


    function showLoginPage() {
        $('body').addClass('narrow');
        $('body').removeClass('wide');

        $('#mainContainer').hide();
        $('#loginContainer').show();


        if (_this.currentUser.email != undefined) {
            $('input#email').val(_this.currentUser.email);
        }

    }

    function showMainPage() {
        $('body').removeClass('narrow');
        $('body').addClass('wide');


        $('#mainContainer').show();
        $('#loginContainer').hide();

        $('#usersName').text(_this.currentUser.name);

        _this.allHoursApi.getClock().then(function (data) {

            $('.greeting').text(data.Greeting);
            $('.status').text(data.StatusText);

                $.each(data.Buttons, function (index, button) {
                    var buttonIndex = index + 1;
                    var buttonSelector = '.buttonContainer' + buttonIndex;
                    console.log(buttonSelector);
                    $(buttonSelector + ' div.buttonTitle').text(button.Title);

                    if (!button.Enabled){
                        $(buttonSelector).addClass('disabled');
                    }



                });

            },
            function () {
                console.info('failed to get clocking options');
                showLoginPage();
            })


    }



    function login(email, password) {
        _this.allHoursApi.getAccessToken(email, password).then(
            function (token) {
                _this.currentUser.email = email;
                _this.currentUser.setTokenData(token.AccessToken, token.RefreshToken);
                _this.currentUser.save();

                _this.allHoursApi.getUser().then(function (user) {
                    _this.currentUser.setUserData(user.id, user.name);
                    _this.currentUser.save();
                    showMainPage();
                }, function (err) {
                    console.info('error while geeting the user data');
                    showLoginPage();
                });

            },
            function (error) {
                console.info('error while geeting the access token');
                showLoginPage();
            }
        )
    }


    initInterface();
};