var app = angular.module("zoom3p", []);
var socket = io();

app.controller("podController", function($scope, $window) {
    $scope.currSpd = 50;
    $scope.turn = 0;
    $scope.oldTurns = [];
    $scope.oldTrnTime = new Date().getTime();
    $scope.turnDif = 0;
    $scope.spinGud = false;
    $scope.spinNum = 0;
    $scope.currBackPos = 0;
    socket.on('moveOrder', function(movObj) {
        $scope.currSpd = 100-(100*(movObj.y + 90)/180);
        $scope.turn = 100*(movObj.x / 180);
        $scope.turnShip();
    })
    $scope.turnShip = function() {
        $scope.oldTrnTime = new Date().getTime();
        $scope.oldTurns.push($scope.turn);
        $scope.oldTurns.shift();

        var cowlBits = document.getElementsByClassName('engAftPiece');
        var airBitsL = $('#leftEngine .airbrake');
        var airBitsR = $('#rightEngine .airbrake');
        var totalAirL = 0;
        var totalAirR = 0;

        if ($scope.currSpd > 50) {
            //accel, so add 0 to airbrake
            totalAirL += 0;
            totalAirR += 0;
            //adjust afterburners

            for (var n = 0; n < cowlBits.length; n++) {
                cowlBits[n].style.transform = 'translateX(200px) rotateY(' + ($scope.currSpd - 50) / 2.2 + 'deg)';
            }
        } else {
            //decel, so afterburner full open, airbrakes expand
            for (var n = 0; n < cowlBits.length; n++) {
                cowlBits[n].style.transform = 'translateX(200px) rotateY(0deg)';
            }
            totalAirL -= (50 - $scope.currSpd) * 2; //add up to 100 for airbrakez
            totalAirR -= (50 - $scope.currSpd) * 2; //add up to 100 for airbrakez
        }
        // now, turn
        if ($scope.turn > 0) {
            //turn right, add to R engine
            totalAirL += 0;
            totalAirR -= $scope.turn * 2;
        } else {
            //turn right, add to R engine
            totalAirL += $scope.turn * 2;
            totalAirR -= 0;
        }
        //'cap' air amts;
        totalAirL = Math.min(totalAirL, 100) / 3;
        totalAirR = Math.min(totalAirR, 100) / 3;
        //finally, move airbrakes
        for (var rn = 0; rn < airBitsL.length; rn++) {
            airBitsL[rn].style.transform = 'rotateX(90deg) translateZ(-5px) translateX(-110px) rotateY(' + (totalAirL) + 'deg)';
        }
        for (var ln = 0; ln < airBitsR.length; ln++) {
            airBitsR[ln].style.transform = 'rotateX(90deg) translateZ(-5px) translateX(-110px) rotateY(' + (totalAirR) + 'deg)';
        }
        //and lastly, tilt the engine complex and untilt the cockpit complex
        $('#cont').css('transform', 'rotateY(20deg) rotateX(' + $scope.turn + 'deg)')
        $('#cpCont').css('transform', 'rotateX(' + (90 - $scope.turn) + 'deg) translateX(300px) rotateZ(' + $scope.turnDif + 'deg)');
    }
    var init = function() {
        //run once to create a bunch of objects. This is a lot easier than manually coding in stuff, especially for 'round' geometries.
        //first, populate old Turns array with terns or something. 
        // <(o)
        for (var trn = 0; trn < 50; trn++) {
            $scope.oldTurns.push(0);
        }
        for (var j = 0; j < 2; j++) {
            var whichSide = '';
            if (!j) {
                whichSide = 'left';
            } else {
                whichSide = 'right';
            }
            for (var i = 0; i < 40; i++) {

                var el = document.createElement('div');
                el.id = whichSide + 'engSlice' + i;
                el.className = 'engPiece';
                el.style.transform = 'rotateX(' + i * 9 + 'deg) translateZ(40px)';
                var shadeNum = 30 * Math.abs(i - 20) / 20;
                el.style.backgroundColor = 'hsl(0,0%,' + (60 + shadeNum) + '%)';
                $('#' + whichSide + 'Engine').append(el);
                //now afterBurner seg;
                var afEl = document.createElement('div');
                afEl.id = 'engAft' + i;
                afEl.className = 'engAftPiece';

                var shadeNum = 30 * Math.abs(i - 20) / 20;
                afEl.style.backgroundColor = 'hsl(0,0%,' + (20 + shadeNum) + '%)';
                $('#' + whichSide + 'engSlice' + i).append(afEl);
            }
            //construct airbrakes
            for (var a = 0; a < 3; a++) {
                //ea qui nomen yw est desidero
                var abp = document.createElement('div');
                abp.id = whichSide + 'AirbrakePylon' + a;
                abp.className = 'airbrakePylon';
                abp.style.transform = 'rotateX(' + (a + 1) * 120 + 'deg) translateY(43px) translateX(30px)';
                $('#' + whichSide + 'Engine').prepend(abp);

                var ab = document.createElement('div');
                var shadeNum = (a * 10) + 30;
                ab.style.backgroundColor = 'hsl(10,43%,' + shadeNum + '%)';
                ab.id = whichSide + 'Airbrake' + a;
                ab.className = 'airbrake';
                ab.style.transform = 'rotateX(20deg) translateZ(-5px) translateX(-110px)';
                $('#' + whichSide + 'AirbrakePylon' + a).prepend(ab);
            }
        }
    }
    init();
    $scope.turnTimer = setInterval(function() {
        $scope.newTrnTime = new Date().getTime();
        if ($scope.newTrnTime - $scope.oldTrnTime > 50) {
            $scope.oldTurns.push($scope.oldTurns[$scope.oldTurns.length - 1]);
            $scope.oldTurns.shift();
        }
        $scope.turnDif = $scope.oldTurns[20] - $scope.oldTurns[49];
        //finally, update turn time;
        $('#cpCont').css('transform', 'rotateX(' + (90 - $scope.turn) + 'deg) translateX(300px) rotateZ(' + $scope.turnDif + 'deg)');
        $scope.oldTrnTime = $scope.newTrnTime;
        if ($scope.spinGud) {
            $scope.spinNum++;
        }
        var moveDist = ($scope.currSpd / 100) * 10;
        $scope.currBackPos += moveDist;
        $('#bigCont').css('transform', 'rotateY(' + $scope.spinNum + 'deg)');
        $('#ground').css('background-position', $scope.currBackPos + '% 0%');
    }, 50);

    //activate/deactivate fly-around
    window.onkeyup = function(e) {
        if (e.which == 32) {
            e.preventDefault();
            $scope.spinGud ? $scope.spinGud = false : $scope.spinGud = true;
        }
    };
});