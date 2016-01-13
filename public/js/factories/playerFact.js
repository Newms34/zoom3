app.factory('playerFact', function($rootScope) {

    return {
        checkBounds: function(oldVal, newVal) {
            if (newVal && (newVal > 1000 || newVal < 0)) {
                return oldVal;
            }
            return newVal;
        },
        checkTargs: function(allDoodz, thisDood, i) {
            //doodz!
            var targ = -1; //if this is -1 at the end of our loop, no targs;
            var x1 = thisDood.x;
            var y1 = thisDood.y;
            var angle = (thisDood.heading%360)-90;
            for (var t = 0; t < allDoodz.length; t++) {
                if (t != i) {
                	//don't test the player against themselves
                    var x2 = allDoodz[t].x;
                    var y2 = allDoodz[t].y;
                    var m = (y2-y1)/(x2-x1); //oboy, algebra
                    //y2 = m*x2+b
                    //y2-(m*x2) = b
                    var b = y2 - (m*x2);//do we actually need this? omfg math halp
                    corrAngle = Math.atan(m)*180/Math.PI;

                    console.log(angle, corrAngle,i)
                    if (parseInt(angle)==parseInt(corrAngle)){
                    targ = t;
                    }
                }
            }
            return targ;
        }
    };
});
