var app = angular.module("zoom3", []);
var socket = io();

app.controller("MainController", function($scope, $window) {
    $scope.bgPosX = 50;
    $scope.bgPosY = 50;
    $scope.bgDeltaX = 0;
    $scope.bgDeltaY = 0;
    $scope.timer;
    $scope.user;
    $scope.userAtmpt;
    $scope.numEns = 0;
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
                $('#enemies').css('transform', 'rotateY(' + $scope.bgPosX * 2 + 'deg) rotateZ(' + $scope.bgPosY * 2 + 'deg)');
                $scope.$apply()
                $scope.clipEm();
                $scope.moveEns();
                if (Math.random()>.05 && $scope.numEns<5){
                    $scope.makeEnemy();
                }
            }, 50);
        }
    }
    $scope.enemRots = []; //store the rotation vals of the track elements for SCIENCE
    $scope.enemPos = [];
    $scope.makeEnemy = function() {
            //create the 'track';
            var el = document.createElement('div');
            el.className = 'enem';
            el.id = 'enemTrack' + $scope.numEns;
            var randY = Math.floor(Math.random() * 360);
            $scope.enemRots.push(randY);
            $scope.enemPos.push(100);
            var randZ = Math.floor(Math.random() * 360);
            el.style.transform = 'rotateY(' + randY + 'deg) rotateZ(' + randZ + 'deg)';
            $('#enemies').append(el);
            //now create the enemy
            var elEn = document.createElement('div');
            elEn.className = 'enemy';
            elEn.id = 'enemFace' + $scope.numEns;
            $('#enemTrack' + $scope.numEns).append(elEn);
            $scope.numEns++;
        }
        //make 4 enemies for testing!
    $scope.makeEnemy();

    $scope.clipEm = function() {
        var tracks = document.getElementsByClassName('enem');
        for (var q = 0; q < tracks.length; q++) {
            var sumRot = ($scope.bgPosX*2) + $scope.enemRots[q];
            if (sumRot % 360 > 0 && sumRot % 360 > 180) {
                tracks[q].style.visibility = 'visible';
                // tracks[q].style.border = '1px solid red';
            } else {
                tracks[q].style.visibility = 'visible';
                // tracks[q].style.border = '5px solid green';
            }
        }
    };
    $scope.moveEns = function(){
        //function to move enemies.
        var tracks = document.getElementsByClassName('enem');
        for (var q = 0; q < tracks.length; q++) {
            if ($scope.enemPos[q]>50){
                $scope.enemPos[q] -= (Math.random()*0.25);
                $('#enemFace'+q).css('left',$scope.enemPos[q]+'%');
            }
        }
        //find dead ones
        for (var r = 0; r < tracks.length; r++) {
            if ($scope.enemPos[r]<=50.5){
                console.log('killin an en!')
                $scope.enemPos.splice(r,1);
                $scope.enemRots.splice(r,1);
                $('#enem'+r).remove();
                $scope.numEns--;
                tracks = document.getElementsByClassName('enem');
                for (var s=r;s<tracks.length;s++){
                    // go thru and 'shift' all subsequent elements to the left 
                    tracks[s].id = 'enem'+s;
                    console.log('enemFace should be',$('#'+tracks[s].id).children());
                    $('#'+tracks[s].id).children().attr('id','enemFace'+s);
                }
            }
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
    ***/
});
