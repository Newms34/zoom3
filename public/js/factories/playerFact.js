app.factory('playerFact', function($rootScope) {
    var targMaxDist = 50;
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
            var angle = (thisDood.heading - 90) % 360;
            var circ = {};
            var isPlayer = false;
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
                    circ.x = (targDist * Math.cos(angleRad)) + x1;
                    circ.y = (targDist * Math.sin(angleRad)) + y1;
                    var circToTarg = distCalc(circ.x, circ.y, x2, y2); //distance from center of circle to the target
                    if (circToTarg < targMaxDist && targDist < minDistance) {
                        //set this as the new target if we're pointing in the right direction,
                        //and the target is closer than any previously examined targs.
                        targ = t;
                        minDistance = targDist;
                        if (allDoodz[t].callMe) {
                            isPlayer = true;
                        }
                    }
                }
            }
            return {
                targ: targ,
                circ: circ,
                isPlayer: isPlayer
            };
        },
        userConst: function(name, x, y, heading, tv, vel) {
            //user constructor. 
            this.name = name;
            this.x = x;
            this.y = y;
            this.heading = heading;
            this.turnVel = tv; //how fast we're turning left or right.
            this.vel = vel;
            this.hpLeft = 3; //user can take three shots before dying
            this.col = 'hsla(' + Math.floor(Math.random() * 360) + ',100%,50%,.7)';
            this.hasTarg = -1;
            this.callMe = 'Anonymous';
            this.lastUpd = new Date().getTime();
            this.shotsLeft = 5; //number of shots left. Takes time to recharge.
            this.charging = 30;
            this.fireTimeLeft = 0; //if this is not zero, the fire animation is still running
            this.score = 0; //each time user gets a kill, they get +1pt;
        },
        obstConst: function (){
            this.x = Math.floor(Math.random()*900)+50;
            this.y= Math.floor(Math.random()*800)+100;
            this.col = 'hsl('+Math.floor(Math.random()*360)+','+Math.floor(Math.random()*100)+'%,'+Math.floor(Math.random()*100)+'%)'
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
