var app = angular.module("zoom3", []);
var socket = io();

app.controller("MainController", function($scope, $window, playerFact) {
    $scope.userConst = function(name, x, y, heading, tv, vel) {
        //user constructor. 
        this.name = name;
        this.x = x;
        this.y = y;
        this.heading = heading;
        this.turnVel = tv; //how fast we're turning left or right.
        this.vel = vel;
        this.stillAlive = true;
        this.col= 'hsla('+Math.floor(Math.random()*360)+',100%,50%,.8)';
        this.hasTarg=-1;
        this.callMe = undefined;
        this.lastUpd = new Date().getTime();
    };
    $scope.allUsers = []; //array that holds all user objects and their current states.
    $scope.allNames = []; //just the names from the above list, to make finding stuff easier.
    $scope.userName;
    $scope.callMe='Dave';
    $scope.boardRot=16;
    $scope.tempName = 'Enter a user code!';
    $scope.playEls;
    $scope.getName = function() {
        socket.emit('checkName', {
            un: $scope.tempName, 
            name:$scope.callMe
        });
    }
    socket.on('nameRes', function(res) {
        //response from backend on whether this name is gud or nawt.
        if (res.good) {
            //this user exists!
            $scope.userName = res.name;
            socket.emit('setAppel',{
                un:res.un,
                name:res.name
            });
            $scope.$digest();
        } else {
            $('.userBox').css('background', '#fcc');
            var t = setTimeout(function() {
                $('.userBox').css('background', '#fff');
            }, 100)
        }
    })
    window.onscroll = function(e) {
        if (!$scope.userName) {
            $(document).scrollTop(0)
            e.preventDefault();
        }
    }
    socket.on('outData', function(data) {
        //update the data
        if ($scope.userName) {
            //the user has 'logged in' with a correct username
            //first, we gotta deal with adding names to the
            //list above, if the user is not already in there
            if ($scope.allNames.indexOf(data.un) == -1) {
                $scope.allNames.push(data.un);
                //push in a new user obj with initial settings of
                //0 everything (i.e., standing still, facing north)
                $scope.allUsers.push(new $scope.userConst(data.un, 0, 0, 0, 0, 0));
                //now push in a new user element
            }
            //now, update the user's deltas (i.e., vel and turnVel);
            var whichUser = $scope.allNames.indexOf(data.un);
            if ($scope.allUsers[whichUser].callMe==undefined){
                $scope.allUsers[whichUser].callMe=data.name;
            }
            $scope.allUsers[whichUser].vel = 8 * data.beta / 90;
            $scope.allUsers[whichUser].turnVel = 6 * data.gamma / 90;
            $scope.allUsers[whichUser].lastUpd = data.lastUpd;
        }
    })
    $scope.mainTimer = setInterval(function() {
        $scope.playEls = $('.player');
        //first, set number of players equal to number of elements.
        var len = $scope.allNames.length;
        for (var i = 0; i < $scope.allNames.length; i++) {
            $scope.allUsers[i].heading += $scope.allUsers[i].turnVel;
            //now gotta calc the x,y for the current user using
            //heading, vel, and glorious trigonawesomeness
            var theta = $scope.allUsers[i].heading * Math.PI / 180; //convert heading to radians
            var tempX = $scope.allUsers[i].x + ($scope.allUsers[i].vel * Math.sin(theta));
            var tempY = $scope.allUsers[i].y + -($scope.allUsers[i].vel * Math.cos(theta));
            var whenIsIt = new Date().getTime();
            $scope.allUsers[i].x = playerFact.checkBounds($scope.allUsers[i].x, tempX);
            $scope.allUsers[i].y = playerFact.checkBounds($scope.allUsers[i].y, tempY);
            $scope.allUsers[i].hasTarg = playerFact.checkTargs($scope.allUsers, $scope.allUsers[i],i);//check to see if we're aiming at anyone!
            if (whenIsIt - $scope.allUsers[i].lastUpd>5000){
                //more than 5sec have elapsed since last signal from this user's mobile
                $scope.allUsers[i].callMe='IS DED';
                $scope.allUsers.splice(i,1)
                $scope.allNames.splice(i,1);
                i--;
                len--;
            }
        }
        $scope.$digest();
    }, 50)
});
