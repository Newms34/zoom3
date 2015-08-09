var app = angular.module("zoom3", []);
var socket = io();
var numEns = 0;
var enemPos = [];
var enemRots = [];
var bgPosX = 50;
var bgPosY = 50;

app.controller("MainController", function($scope, $window, enemFactory) {
    $scope.bgPosX = 50;
    $scope.bgPosY = 50;
    $scope.bgDeltaX = 0;
    $scope.bgDeltaY = 0;
    $scope.timer;
    $scope.user;
    $scope.userAtmpt;
    var init = function() {
        var bars = $('.ckBar');
        //build a TIE!
        for (var i = 0; i < bars.length; i++) {
            bars[i].style.transform = 'rotate(' + (i * 45) + 'deg)';
        }
    }
    init();
    socket.on('moveOrder', function(movObj) {
        if (movObj.user == $scope.user) {
            $scope.bgDeltaY = movObj.y / 20;
            $scope.bgDeltaX = movObj.x / 20;
        }
    })
    $('#enterPassBox input').focus();
    $scope.enterPwd = function(e, val) {
        if (e.keyCode == 13) {
            $scope.user = val;
            $scope.timer = setInterval(function() {
                $scope.bgPosX += $scope.bgDeltaX;
                $scope.bgPosY -= $scope.bgDeltaY;
                bgPosX = $scope.bgPosX;
                bgposY = $scope.bgPosY;
                $('#enemies').css('transform', 'rotateY(' + $scope.bgPosX * 2 + 'deg) rotateZ(' + $scope.bgPosY * 2 + 'deg)');
                $scope.$apply()
                enemFactory.clipEm();
                enemFactory.moveEns();
                if (Math.random() > 0.05 && numEns < 5) {
                    console.log(numEns);
                    enemFactory.makeEnemy();
                    numEns++;
                }
            }, 50);
        }
    }
    /***
        target generation:
        1) generate 10000px long div.
        2) place 'enemy' at end (pos: 100%)
        3) ship carrier div rotates rand amt (x and y)
        4) ship moves towards 'center' (pos:50%)
        5) have to rotate by certain amt. have to do this on the FRONT end. should just be a fn of $scope.bgPosX/Y

        CLIPPING PLANES:
        calculate sum of rotations in JUST Y from both enemTrack and enemies, 
        then if(rotSumY%360>0 & < 180), be invis. Otherwise, vis.

        STUFF TO SEND BACK FOR MULTIPLAY VERSION:
        1) obj x
        2) obj y
        3) obj z
        (pos stored on front end, recalced each time player's timer 'ticks')
        4) health (1-3)
        5) score

        it is possible to select an item by an id and THEN change that same item's id. So we can run thru and 'rename' items
        FIX: scope reference issue in factory. Can we reference parent scope vars? 
        or we could put all the data vars on global vars (i.e., var bgPosX instead of $scope.bgPosX)
    ***/
});
