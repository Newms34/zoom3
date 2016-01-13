var app = angular.module("zoom3m", []);
var socket = io();

app.controller("MobileController", function($scope, $window) {
    $scope.userName = Math.floor(Math.random() * 99999999).toString(32);
    //controller for player's mobile phone. Emits motion data, accepts vibrator
    window.addEventListener('deviceorientation', function(rotObj) {
        //on phone movement, send current orientation data to the front.
        console.log("ROT", rotObj.beta);
        //rotObj.un = $scope.userName;
        $scope.testData = rotObj.beta;
        $scope.$digest();
        socket.emit('moveData', {
            alpha: rotObj.alpha,
            beta: rotObj.beta,
            gamma: rotObj.gamma,
            un:$scope.userName
        });
    });
    //TEMPORARY, for testing, since it seems servers cannot be run on Starbucks Wifi!
    window.addEventListener('mousemove', function(e) {
           //gotta normalize stuff first to btwn 90 and -90;
           console.log(e.x, $('body').width())
           var rotObj = {
               alpha: 0,
               beta: 180 * (((e.y || e.clientY) / $(window).height()) - .5),
               gamma: 180 * (((e.x || e.clientX) / $(document).width()) - .5),
               un: $scope.userName
           };
           console.log('rotObj', rotObj)
           socket.emit('moveData', rotObj);
       })
       //beta = vel
       //gamma = turnVel.

});
