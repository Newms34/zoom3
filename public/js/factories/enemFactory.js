app.factory('enemFactory', function($rootScope) {
  
    return {
        moveEns: function() {
            //function to move enemies.
            var tracks = document.getElementsByClassName('enem');
            for (var q = 0; q < tracks.length; q++) {
                if (enemPos[q] > 50) {
                    enemPos[q] -= (Math.random() * 0.25);
                    $('#enemFace' + q).css('left', enemPos[q] + '%');
                }
            }
            //find dead ones
            for (var r = 0; r < tracks.length; r++) {
                if (enemPos[r] <= 50.5) {
                    console.log('killin an en!')
                    enemPos.splice(r, 1);
                    enemRots.splice(r, 1);
                    $('#enem' + r).remove();
                    numEns--;
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
              
                var sumRot = (bgPosX * 2) + enemRots[q];
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
            var el = document.createElement('div');
            el.className = 'enem';
            el.id = 'enemTrack' + numEns;
            var randY = Math.floor(Math.random() * 360);
            enemRots.push(randY);
            enemPos.push(100);
            var randZ = Math.floor(Math.random() * 360);
            el.style.transform = 'rotateY(' + randY + 'deg) rotateZ(' + randZ + 'deg)';
            $('#enemies').append(el);
            //now create the enemy
            var elEn = document.createElement('div');
            elEn.className = 'enemy';
            elEn.id = 'enemFace' + numEns;
            $('#enemTrack' + numEns).append(elEn);
        }
    };
});
