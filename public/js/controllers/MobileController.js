var app = angular.module("zoom3m", []);
var socket = io();

app.controller("MobileController", function($scope, $window) {
    $scope.currX;
    $scope.currY;
    $scope.userPass = Math.floor(Math.random() * 999999999).toString(36).toUpperCase().replace('I', 'X');
    $scope.ackPwd = false;
    window.onmousemove = function(e) {
        //this is just used for testing: basically allows us to run both pieces on the same machine using
        //mousemove instead of deviceorientation
        $scope.currX = (((e.x || e.clientX) * 100) / $(document).width()) - 50;
        $scope.currX /= 10;
        $scope.currY = (((e.y || e.clientY) * 100) / $(document).height()) - 50;
        $scope.currY /= -10;
        $scope.$apply();
        //convert rotations  (-90 to 90) to percent move up or down
        var movObj = {
            x: $scope.currX,
            y: $scope.currY,
            user: $scope.userPass
        }
        socket.emit('fromContr', movObj);
        var x = ((x * 100) / $(document).width());
        var y = ((y * -100) / $(document).height());
        $scope.radAdj(e.x,e.y);
    }
    console.log('dims', $(document).width(), $(document).height())

    window.addEventListener('deviceorientation', function(e) {
        $scope.currX = e.gamma;
        $scope.currY = e.beta;
        $scope.$apply();
        //convert rotations  (-90 to 90) to percent move up or down
        var movObj = {
            x: $scope.currX,
            y: $scope.currY,
            user: $scope.userPass
        }
        socket.emit('fromContr', movObj);
        var x = (100*(e.gamma+90)/180);
        var y = (100*(e.beta+90)/180);
        $scope.radAdj(x,y);
    });
    $scope.radAdj = function(x,y){
        x = ((x * 100) / $(document).width());
        y = ((y * -100) / $(document).height())
        $('#radH').css('top',(1-y)+'%');
        $('#radV').css('left',x+'%');
    }
});
