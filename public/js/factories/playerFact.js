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
            var minDistance = Number.POSITIVE_INFINITY;
            var angle = (thisDood.heading-90) % 360;
            var circ = {};
            if (angle < 0) {
                angle = 360 + angle; //normalize the angle to btwn 0 and 360 always
            }
            var angleRad = angle * Math.PI / 180;
            for (var t = 0; t < allDoodz.length; t++) {
                if (t != i) {
                    //don't test the player against themselves
                    var x2 = allDoodz[t].x;
                    var y2 = allDoodz[t].y;

                    var targDist = distCalc(x1, y1, x2, y2); //distance to target (pyth theorem)
                    //we now have the distance to the target from our craft. We need to find the point x,y so that
                    //it has a slope equivalent to 'angle' and passes thru a point targDist distance away
                    //we draw a circle there
                    circ.x = (targDist * Math.cos(angleRad))+x1;
                    circ.y = (targDist * Math.sin(angleRad))+y1;
                    var circToTarg = distCalc(circ.x, circ.y, x2, y2); //distance from center of circle to the target
                    if (circToTarg < 50 && targDist < minDistance) {
                        //set this as the new target if we're pointing in the right direction,
                        //and the target is closer than any previously examined targs.
                        targ = t;
                        minDistance = targDist;
                    }
                }
            }
            return {
                targ: targ,
                circ:circ
            };
        }
    };
});
var distCalc = function(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
/* PLAN FOR TARG SYSTEM:
1) calc dist to target
2) Create imaginary circle there at that distance away and that heading
3) find if targ is within that circle

old distance stuff: 
var m = (y2 - y1) / (x2 - x1); //oboy, algebra
y2 = m*x2+b
y2-(m*x2) = b
var b = y2 - (m * x2); //do we actually need this? omfg math halp
corrAngle = Math.atan(m) * 180 / Math.PI;
*/
