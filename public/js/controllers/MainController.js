var app = angular.module("zoom3", []);
var socket = io();

app.controller("MainController", function($scope, $window, playerFact) {
    $scope.mobilecheck = function() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }
    if ($scope.mobilecheck()){
       $window.location.href='/mobile'
    }
    $scope.userConst = function(name, x, y, heading, tv, vel) {
        //user constructor. 
        this.name = name;
        this.x = x;
        this.y = y;
        this.heading = heading;
        this.turnVel = tv; //how fast we're turning left or right.
        this.vel = vel;
        this.stillAlive = true;
        this.col = 'hsla(' + Math.floor(Math.random() * 360) + ',100%,50%,.8)';
        this.hasTarg = -1;
        this.callMe = undefined;
        this.lastUpd = new Date().getTime();
    };
    $scope.allUsers = []; //array that holds all user objects and their current states.
    $scope.allNames = []; //just the names from the above list, to make finding stuff easier.
    $scope.userName;
    $scope.callMe = 'Dave';
    $scope.boardRot = 16;
    $scope.tempName = 'Enter a user code!';
    $scope.playEls;
    $scope.getName = function() {
        socket.emit('checkName', {
            un: $scope.tempName,
            name: $scope.callMe
        });
    }
    socket.on('nameRes', function(res) {
        //response from backend on whether this name is gud or nawt.
        if (res.good) {
            //this user exists!
            $scope.userName = res.name;
            socket.emit('setAppel', {
                un: res.un,
                name: res.name
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
            if ($scope.allUsers[whichUser].callMe == undefined) {
                $scope.allUsers[whichUser].callMe = data.name;
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
            $scope.allUsers[i].hasTarg = playerFact.checkTargs($scope.allUsers, $scope.allUsers[i], i); //check to see if we're aiming at anyone!
            if (whenIsIt - $scope.allUsers[i].lastUpd > 5000) {
                //more than 5sec have elapsed since last signal from this user's mobile
                $scope.allUsers[i].callMe = 'IS DED';
                $scope.allUsers.splice(i, 1)
                $scope.allNames.splice(i, 1);
                i--;
                len--;
            }
        }
        $scope.$digest();
    }, 50)
});
