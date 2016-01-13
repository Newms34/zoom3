var app = angular.module("zoom3m", []);
var socket = io();

app.controller("MobileController", function($scope, $window) {
    $scope.userName = Math.floor(Math.random() * 99999999).toString(32).toUpperCase();
    $scope.callMe = undefined;
    $scope.debug;
    $scope.debugRun = 0;
    //controller for player's mobile phone. Emits motion data, accepts vibrator
    window.addEventListener('deviceorientation', function(rotObj) {
        //on phone movement, send current orientation data to the front.
        //rotObj.un = $scope.userName;
        $scope.debugRun++;
        var outObj = {
            alpha: rotObj.alpha,
            beta: -rotObj.beta,
            gamma: rotObj.gamma,
            un: $scope.userName,
            name: $scope.callMe,
            lastUpd: new Date().getTime(), 
            isPhone:true
        };
        $scope.debug = outObj;
        $scope.$digest();
        socket.emit('moveData', outObj);
    }, true);
    socket.on('setAppelBak', function(nomen) {
        if (nomen.un == $scope.userName) {
            $scope.callMe = nomen.name;
        }
    });
    window.addEventListener('touchend', function(e) {
        e.preventDefault();
        socket.emit('fireToBack', {
            un: $scope.userName
        });
    }, true);
    //--------------------
    //TEMPORARY, for testing, since it seems servers cannot be run on Starbucks Wifi!
    window.addEventListener('mousemove', function(e) {
        //gotta normalize stuff first to btwn 90 and -90;
        var rotObj = {
            alpha: 0,
            beta: -180 * (((e.y || e.clientY) / $(window).height()) - .5),
            gamma: 180 * (((e.x || e.clientX) / $(document).width()) - .5),
            un: $scope.userName,
            name: $scope.callMe,
            lastUpd: new Date().getTime(),
            isPhone:false
        };
        console.log(rotObj)
        socket.emit('moveData', rotObj);
    });
    window.onkeyup = function(e) {
        if (e.which == 70) {
            e.preventDefault();
            socket.emit('fireToBack', {
                un: $scope.userName
            });
        }
    };

    //beta = vel
    //gamma = turnVel.

});
