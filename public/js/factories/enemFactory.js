app.factory('enemFactory', function($rootScope) {
  var reported = false;
    return {
        moveEns: function() {
            //function to move enemies.
            var tracks = document.getElementsByClassName('enem');
            for (var q = 0; q < tracks.length; q++) {
                if ($rootScope.enemPos[q] > 50) {
                    $rootScope.enemPos[q] -= (Math.random() * 0.25);
                    $('#enemFace' + q).css('left', $rootScope.enemPos[q] + '%');
                }
            }
            //find dead ones
            for (var r = 0; r < tracks.length; r++) {
                if ($rootScope.enemPos[r] <= 50.5) {
                    console.log('killin an en!')
                    $rootScope.enemPos.splice(r, 1);
                    $rootScope.enemRots.splice(r, 1);
                    $('#enem' + r).remove();
                    $rootScope.numEns--;
                    tracks = document.getElementsByClassName('enem');
                    for (var s = r; s < tracks.length; s++) {
                        // go thru and 'shift' all subsequent elements to the left 
                        tracks[s].id = 'enem' + s;
                        console.log('enemFace should be', $('#' + tracks[s].id).children());
                        $('#' + tracks[s].id).children().attr('id', 'enemFace' + s);
                    }
                }
            }
        },
        clipEm: function() {
            var tracks = document.getElementsByClassName('enem');
            for (var q = 0; q < tracks.length; q++) {
              console.log('bgPosX',$rootScope.bgPosX)
                var sumRot = ($rootScope.bgPosX * 2) + $rootScope.enemRots[q];
                if (sumRot % 360 > 0 && sumRot % 360 > 180) {
                    tracks[q].style.visibility = 'visible';
                    // tracks[q].style.border = '1px solid red';
                } else {
                    tracks[q].style.visibility = 'visible';
                    // tracks[q].style.border = '5px solid green';
                }
            }
        },
        makeEnemy : function() {
            //create the 'track';
            if (!reported){
              console.log($rootScope)
              reported=true;
            }
            var el = document.createElement('div');
            el.className = 'enem';
            el.id = 'enemTrack' + $rootScope.numEns;
            var randY = Math.floor(Math.random() * 360);
            $rootScope.enemRots.push(randY);
            $rootScope.enemPos.push(100);
            var randZ = Math.floor(Math.random() * 360);
            el.style.transform = 'rotateY(' + randY + 'deg) rotateZ(' + randZ + 'deg)';
            $('#enemies').append(el);
            //now create the enemy
            var elEn = document.createElement('div');
            elEn.className = 'enemy';
            elEn.id = 'enemFace' + $rootScope.numEns;
            $('#enemTrack' + $rootScope.numEns).append(elEn);
            $rootScope.numEns++;
        }
    };
});
