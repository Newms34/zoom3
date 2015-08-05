// pathing algorithm(s):

// changes every x frames, where x is a random number btwn a and b. 
// This allows vert and horiz bend to 'desync', producing some variety
// We're gonna need to do some derivatives

// x = x0 +v0t + .5at^2


var x = 50,
    ax = 0,
    prvX = 20,
    tillNext = 50,
    tillNextMax = 50,
    emergTrn = false,
    resetting = false,
    pathPos = [],
    pathCol = [],
    nothin=true;
//the above are the position vars. For now, we're just doing x.
var posTimer = setInterval(function () {
    moveTime()
}, 60);
var paths = document.getElementsByClassName('pathBit');
init();

function init() {
    for (var i = 0; i < paths.length; i++) {
        pathPos.push(50);
        paths[i].style.width = (100 / paths.length) + '%';
        pathCol.push((i / paths.length) * 100);
    }
    adjPos();
}

function adjPos() {
    for (var i = 0; i < paths.length; i++) {
        pathCol[i]--;
        if (pathCol[i] <= 0) {
            pathCol[i] = 100;
        }
        var hue = pathCol[i] * .6;
        paths[i].style.boxShadow = '0 0 15px 10px hsl(' + hue + ',100%,' + pathCol[i] + '%)';
        paths[i].style.backgroundColor = 'hsl(' + hue + ',100%,' + pathCol[i] + '%)';
        paths[i].style.top = pathPos[i] + 'px';
        paths[i].style.left = ((100 / paths.length) * i) + '%';
    }
}

function moveTime() {
    if (tillNext) {
        //not time to turn
        if ((x > 100 || x < 0) && !emergTrn && nothin) {
            //if we're at the edges, TURN
            //only do this if we have not turned (so we don't keep 'riding' the edge).
            console.log('emergency turn!');
            emergTrn = true;
            resetting = true;
        }

        //find pos for new path ele
        if (ax > 0) {
            x = prvX + (Math.pow(ax, 2) * .5 * Math.pow((tillNextMax - tillNext), 2));
        } else {
            x = prvX + (Math.pow(ax, 2) * .5 * (-Math.pow((tillNextMax - tillNext), 2)));
        }
    } else if (!resetting && (!tillNext || emergTrn)) {
        //time to turn
        prvX = x;
        if (emergTrn && x > 100) {
            while (ax > 0) {
                ax = .3 - (Math.random() * .6);
            }
        } else if (emergTrn && x < 0) {
            while (ax < 0) {
                ax = .3 - (Math.random() * .6);
            }
        } else {
            ax = .3 - (Math.random() * .6);
        }
        emergTrn = false;
        console.log('turning');

        console.log('new accel:', ax)
        tillNext = Math.floor(Math.random() * 60) + 70;
        tillNextMax = tillNext;
    }
    if (resetting && x > 0 && x < 100) {
        console.log('reset')
        resetting = false;
    }

    //first split off the last one, then push in the new X at the end
    pathPos.shift();
    pathPos.push(x);
    //now, adjust path.
    adjPos();
    tillNext--;
}

// still need to find a way to get it to switch on 'hitting' a wall and wait till we re-enter the borders to consider turning