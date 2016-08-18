'use strict';

// Global webgl references
var gl;
var program;
var canvas;

// State trackers
var world;
var geometry;
var camera;
var controller;
var paused = false;
var started = false;
var won = false;
var wontimer = 0;

// Presets and initialization constants
var arenaSize = [500, 500, 500];
var lightPos = [250, 250, 250];

window.onload = function init() {
    // Get HTML canvas element
    canvas = document.getElementById("gl-canvas");

    // Get webgl context
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Configure high-level gl settings
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Adjust framebuffer and viewport size for CSS
    canvas.height = canvas.clientHeight
    canvas.width = canvas.clientWidth;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Compile shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Create controller handler
    controller = new Controller();

    // Create the geometry used in World objects
    initializeGeometry();

    // Other set up
    toggleAttrib("vPosition", true);
    setUniform(gl.uniform1i, "texture", 0);
    setUniform(gl.uniform4fv, "lightPosition", flatten(vec4(lightPos)));
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Start game
    initializeBgm();
    controller.restart();
    requestAnimFrame(render);
}

function initializeBgm() {
    var bgm = document.getElementById('bgm');
    if (!bgm.error) {
        bgm.volume = 0.1;
        bgm.loop = true;
        bgm.play();
    }
}

function playCrashSound() {
    var sound = document.getElementById('collision');
    if (!sound.error) {
        sound.volume = 0.5;
        sound.pause();
        sound.currentTime = 0;
        sound.play();
    }
}

function Camera(aspect) {
    this.aspect = aspect;
    this.fovx = 60;
    this.position = [1, 10, 20];
    this.rotation = [-10, 0, 0];
    this.dir = [0, 0, -1];
    this.up = [0, 1, 0];
    this.mode = 1;

    this.controls = this.controls.bind(this);
    addEventListener("keydown", this.controls);
}

Camera.prototype.controls = function(e) {
    var nextMode = -1;

    // Switch camera mode depending on key
    if (e.keyCode === 48) {          // 0
        nextMode = 0;
    } else if (e.keyCode === 49) {   // 1
        nextMode = 1;
    } else {
        return;
    }

    // Retoggling current mode goes back to mode 1
    if (nextMode === this.mode) {
        this.mode = 1;
    } else {
        this.mode = nextMode;
    }
}


Camera.prototype.update = function() {
    var p = world.player;

    // Player perspective mode
    if (p && this.mode === 1) {

        // Hacky face-transition stuff
        if (this.bikePrevFace !== undefined &&
                this.bikePrevFace !== p.face) {
            var prevTrueAngle = 270 - this.bikePrevDir * 90;
            var offset = angleDiff(prevTrueAngle, this.rotation[1]);
            var trueAngle = 270 - p.dir * 90;
            this.rotation[1] = normalizeAngle(trueAngle + offset);

            this.transitioning = true;
            this.transitionNum = 0.0;
            this.transitionSpd = 2.0;
            this.prevDir = this.dir;
            this.prevUp = this.up;
            this.prevPos = this.position;
        }
        this.bikePrevFace = p.face;
        if (this.transitioning) {
            this.transitionSpd -= 1.7 * world.elapsed;
            this.transitionNum += this.transitionSpd * world.elapsed;
            this.transitioning = !(this.transitionNum >= 1 || this.transitionSpd <= 0)
        }

        // State adjustments based on player actions
        var bikeTurned = this.bikePrevDir !== p.dir && this.bikePrevFace === p.face;
        if (bikeTurned) {
            this.fullOffset = true;
        }
        this.bikePrevDir = p.dir;
        var rotating = controller.pressing[37] || controller.pressing[39];
        if (rotating) {
            this.fullOffset = false;
        }

        // Adjust Y rotation
        if (controller.pressing[37]) {  // left
            this.rotation[1] += 210 * world.elapsed;
        }
        if (controller.pressing[39]) {  // right
            this.rotation[1] -= 210 * world.elapsed;
        }
        var maxOffset = this.fullOffset ? 12 : 35;
        var snapMult = rotating ? 1.2 : 1.5;
        var curAngle = this.rotation[1];
        var trueAngle = 270 - p.dir * 90;
        var angleOffset = angleDiff(trueAngle, curAngle);
        if (-maxOffset > angleOffset || angleOffset > maxOffset) {
            var diff = angleDiff(curAngle, trueAngle + maxOffset)
            var diff2 = angleDiff(curAngle, trueAngle - maxOffset)
            if (Math.abs(diff2) < Math.abs(diff)) {
                diff = diff2;
            }
            var sign = (diff >= 0 ? 1.0 : -1.0);
            var rotateSpd = sign * Math.min(210, Math.pow(Math.abs(diff), snapMult));
            curAngle += rotateSpd * world.elapsed;
            this.rotation[1] = normalizeAngle(curAngle);
        }

        // Adjust X rotation
        if (controller.pressing[38]) {  //up
            this.rotation[0] += 150 * world.elapsed;
        }
        var snapMult = 1.6;
        var curAngle = this.rotation[0];
        var trueAngle = -10;
        var diff = angleDiff(curAngle, trueAngle)
        var sign = (diff >= 0 ? 1.0 : -1.0);
        var rotateSpd = sign * Math.min(150, Math.pow(Math.abs(diff), snapMult));
        var rotateAmt = rotateSpd * world.elapsed;
        this.rotation[0] = normalizeAngle(curAngle + rotateAmt);

        // Convert rotation angles into direction+up vectors
        var m = identity();
        m = mult(m, rotate(this.rotation[1], [0, 1, 0]));
        m = mult(m, rotate(this.rotation[0], [1, 0, 0]));
        this.dir = transform(m, [0, 0, -1]);
        this.up = transform(m, [0, 1, 0]);

        // Adjust position
        var anchor = [0, 8.5, 30];
        var offset = transform(rotate(this.rotation[1], [0, 1, 0]), anchor);
        this.position = add(p.position, offset);

        // Transform the camera vectors based on cube face
        this.position = transform(geometry.cubeRotate[p.face], this.position);
        this.dir = transform(geometry.cubeORotate[p.face], this.dir);
        this.up = transform(geometry.cubeORotate[p.face], this.up);

        // Hacky face-transition stuff
        if (this.transitioning) {
            this.position = mix(this.prevPos, this.position, this.transitionNum);
            this.dir = mix(normalize(this.prevDir), normalize(this.dir), this.transitionNum);
            this.up = mix(normalize(this.prevUp), normalize(this.up), this.transitionNum);
            this.prevPos = mix(this.prevPos, this.position, 0.2);
            this.prevDir = mix(this.prevDir, this.dir, 0.2);
            this.prevUp = mix(this.prevUp, this.up, 0.2);
        }
    }

    // Free camera mode
    else {
        if (controller.pressing[37]) { // left
            this.rotation[1] += 120 * world.elapsed;
        }
        if (controller.pressing[39]) { // right
            this.rotation[1] += -120 * world.elapsed;
        }
        if (controller.pressing[38]) { // up
            this.position[1] += 100 * world.elapsed;
        }
        if (controller.pressing[40]) { // down
            this.position[1] += -100 * world.elapsed;
        }
        if (controller.pressing[73]) { // w
            var dir = transform(rotate(this.rotation[1], [0, 1, 0]), vec4(0, 0, -1));
            stretch(100 * world.elapsed, dir);
            this.position = add(this.position, dir.slice(0,3));
        }
        if (controller.pressing[74]) { // a
            var dir = transform(rotate(this.rotation[1], [0, 1, 0]), vec4(-1, 0, 0));
            stretch(100 * world.elapsed, dir);
            this.position = add(this.position, dir.slice(0,3));
        }
        if (controller.pressing[75]) { // s
            var dir = transform(rotate(this.rotation[1], [0, 1, 0]), vec4(0, 0, 1));
            stretch(100 * world.elapsed, dir);
            this.position = add(this.position, dir.slice(0,3));
        }
        if (controller.pressing[76]) { // d
            var dir = transform(rotate(this.rotation[1], [0, 1, 0]), vec4(1, 0, 0));
            stretch(100 * world.elapsed, dir);
            this.position = add(this.position, dir.slice(0,3));
        }
        if (controller.pressing[90]) { // z
            this.rotation[0] += 50 * world.elapsed;
        }
        if (controller.pressing[88]) { // x
            this.rotation[0] += -50 * world.elapsed;
        }

        var m = identity();
        m = mult(m, rotate(this.rotation[1], [0, 1, 0]));
        m = mult(m, rotate(this.rotation[0], [1, 0, 0]));
        this.dir = transform(m, [0, 0, -1]);
        this.up = transform(m, [0, 1, 0]);
    }
}

Camera.prototype.view = function() {
    var r1 = angleBetween(this.up, [0, 1, 0]);
    var vv = transform(rotate(r1.angle, r1.axis), this.dir);
    var r2 = angleBetween(vv, [0, 0, -1]);
    var view = identity();
    view = mult(view, rotate(r2.angle, r2.axis));
    view = mult(view, rotate(r1.angle, r1.axis));
    view = mult(view, translate(negate(this.position)));
    return view;
}

Camera.prototype.projection = function() {
    var fovy = Math.atan(Math.tan(radians(this.fovx / 2)) / this.aspect);
    fovy = degrees(fovy) * 2;
    return perspective(fovy, this.aspect, 1, 5000);
}

function World() {
    this.time = 0;
    this.elapsed = 0;
    this.bikes = [];
    this.bikeLimit = 8;
    this.objects = [];

    var arena = {};
    arena.type = "arena";
    arena.position = [0, 0, 0];
    arena.size = arenaSize;
    this.objects.push(arena);

    this.arena = arena;
    this.player = null;
}

World.prototype.update = function(time) {
    time /= 1000.0;
    this.elapsed = time - this.time;
    this.time = time;

    if(!paused) {
        for (var i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            if (obj.update) {
                obj.update(this);
            }
        }

        var newList = [];
        for (var i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            if (!(obj.type === "wall" && obj.dead)) {
                newList.push(obj);
            }
        }
        this.objects = newList;
    }

    if (!won) {
        if (this.player.dead) {
            return;
        }
        for (var i = 1; i < this.bikes.length; i++) {
            if (!this.bikes[i].dead) {
                return;
            }
        }
        won = true;
        wontimer = 5;
        document.getElementById("victory").style.visibility = "visible";
    } else if (wontimer > 0) {
        var opacity = Math.min(1.0, wontimer);
        document.getElementById("victory").style.opacity = opacity;
        wontimer -= world.elapsed;
    }
}

World.prototype.addBike = function(type) {
    var range = this.arena.size;
    var safe = 200;
    var pos = [rand(safe, range[0]-safe), 0, rand(safe, range[2])];
    var bike = new type(this.bikes.length, randint(0, 5), pos, randint(0, 3));
    this.bikes.push(bike);
    this.objects.push(bike);
}

function Bike(id, face, pos, dir) {
    this.type = "bike";
    this.face = face;
    this.position = pos.slice();
    this.spd = 100.0;
    this.dir = dir;
    this.upvel = 0.0;
    this.jumping = false;
    this.id = id;
    this.offsets = [1, 0.7];
    this.currentWall = null;
    this.pushWall();
}

Bike.prototype.turn = function(right) {
    if (this.jumping) {
        return;
    }

    if (right) {
        this.dir = (this.dir + 1) % 4;
    } else {
        this.dir = (this.dir + 3) % 4;
    }
    this.pushWall();
}

Bike.prototype.removeWalls = function() {
    var objs = world.objects;
    for(var i = 0; i < objs.length; i++) {
        if(objs[i].id === this.id && objs[i].type === "wall") {
            objs[i].dying = true;
        }
    }
}

Bike.prototype.update = function(world) {
    if (this.currentWall === null) {
        this.pushWall();
    }

    if (this.dead) {
        return;
    }

    // Evaluate vertical motion
    if (this.jumping) {
        var gravity = -60.0;
        this.upvel += world.elapsed * gravity;
        this.position[1] += world.elapsed * this.upvel;
        if (this.position[1] <= 0) {
            this.position[1] = 0;
            this.jumping = false;
            this.pushWall();
        }
    }

    var dist = world.elapsed * this.spd;

    // Detection collision with wall
    var wdist = this.nearestWalls();
    if (wdist[this.dir] < dist && this.position[1] < 1.5) {
        dist = wdist[this.dir];
        this.dead = true;
        playCrashSound();
        this.removeWalls();
    }

    var a = world.arena.size;
    if (this.dir === 0 && this.position[0] + dist > a[0]) {
        if (!this.jumping) {
            this.currentWall.extend(a[0] - this.position[0]);
        }
        dist = this.position[0] + dist - a[0];
        var st = [false, true, false, true, false, true][this.face];
        if (st) {
            this.position = [a[2] - this.position[2], 0, this.position[1]];
            this.dir = 1;
        } else {
            this.position = [this.position[2], 0, a[2] - this.position[1]];
            this.dir = 3;
        }
        this.face = [1, 2, 3, 4, 5, 0][this.face];
        this.pushWall();
        this.jumping = false;
    } else if (this.dir === 1 && this.position[2] + dist > a[2]) {
        if (!this.jumping) {
            this.currentWall.extend(a[2] - this.position[2]);
        }
        dist = this.position[2] + dist - a[2];
        var st = [true, false, true, false, true, false][this.face];
        if (st) {
            this.position = [this.position[1], 0, a[0] - this.position[0]];
            this.dir = 0;
        } else {
            this.position = [a[0] - this.position[1], 0, this.position[0]];
            this.dir = 2;
        }
        this.face = [2, 0, 4, 2, 0, 4][this.face];
        this.pushWall();
        this.jumping = false;
    } else if (this.dir === 2 && this.position[0] - dist < 0) {
        if (!this.jumping) {
            this.currentWall.extend(this.position[0]);
        }
        dist = Math.abs(this.position[0] - dist);
        var st = [false, true, false, true, false, true][this.face];
        if (st) {
            this.position = [this.position[2], 0, this.position[1]];
            this.dir = 1;
        } else {
            this.position = [a[2] - this.position[2], 0, a[2] - this.position[1]];
            this.dir = 3;
        }
        this.face = [4, 5, 0, 1, 2, 3][this.face];
        this.pushWall();
        this.jumping = false;
    } else if (this.dir === 3 && this.position[2] - dist < 0) {
        if (!this.jumping) {
            this.currentWall.extend(this.position[2]);
        }
        dist = Math.abs(this.position[2] - dist);
        var st = [false, true, false, true, false, true][this.face];
        if (st) {
            this.position = [this.position[1], 0, this.position[0]];
            this.dir = 0;
        } else {
            this.position = [a[0] - this.position[1], 0, a[0] - this.position[0]];
            this.dir = 2;
        }
        this.face = [5, 3, 1, 5, 3, 1][this.face];
        this.pushWall();
        this.jumping = false;
    }

    if (this.dir === 0) this.position[0] += dist;
    if (this.dir === 1) this.position[2] += dist;
    if (this.dir === 2) this.position[0] -= dist;
    if (this.dir === 3) this.position[2] -= dist;

    if (!this.jumping) {
        this.currentWall.extendTo(this.position);
    }
}

Bike.prototype.pushWall = function() {
    if(!this.dead) {
        var maki = new Wall(this.position, this.position, this.face, this.dir, this.id);
        world.objects.push(maki);
        this.currentWall = maki;
    }
}

Bike.prototype.nearestWalls = function() {
    var facemap = [
        [0, 1, 2, 3, 4, 5],
        [2, 0, 1, 5, 3, 4],
        [4, 5, 0, 1, 2, 3],
        [3, 4, 2, 0, 1, 5],
        [2, 3, 4, 5, 0, 1],
        [1, 5, 3, 4, 2, 0],
    ][this.face];
    var st = [true, false, true, false, true, false][this.face];
    var x = this.position[0];
    var z = this.position[2];
    var s = this.offsets[1];
    var a = world.arena.size;
    var objs = world.objects;
    var dists = [Infinity, Infinity, Infinity, Infinity];
    for (var i = 0; i < objs.length; i++) {
        if (objs[i].type === "wall" && objs[i] !== this.currentWall) {
            var wall = objs[i];
            var f = facemap[wall.face];
            if (f === 3) {
                continue;
            }

            if (f === 1) {
                if (st) {
                    wall = {
                        start: [a[0] + a[2]-wall.start[2], 0, wall.start[0]],
                        end: [a[0] + a[2]-wall.end[2], 0, wall.end[0]]
                    };
                } else {
                    wall = {
                        start: [a[0] + wall.start[2], 0, a[0]-wall.start[0]],
                        end: [a[0] + wall.end[2], 0, a[0]-wall.end[0]]
                    };
                }
            } else if (f === 2) {
                if (st) {
                    wall = {
                        start: [a[2]-wall.start[2], 0, a[2] + wall.start[0]],
                        end: [a[2]-wall.end[2], 0, a[2] + wall.end[0]]
                    };
                } else {
                    wall = {
                        start: [wall.start[2], 0, a[2] + a[0]-wall.start[0]],
                        end: [wall.end[2], 0, a[2] + a[0]-wall.end[0]]
                    };
                }
            } else if (f === 4) {
                if (st) {
                    wall = {
                        start: [-1*a[0] + wall.start[2], 0, a[0]-wall.start[0]],
                        end: [-1*a[0] + wall.end[2], 0, a[0]-wall.end[0]]
                    };
                } else {
                    wall = {
                        start: [-1*a[0] + a[2]-wall.start[2], 0, wall.start[0]],
                        end: [-1*a[0] + a[2]-wall.end[2], 0, wall.end[0]]
                    };
                }
            } else if (f === 5) {
                if (st) {
                    wall = {
                        start: [a[2]-wall.start[2], 0, -1*a[2] + wall.start[0]],
                        end: [a[2]-wall.end[2], 0, -1*a[2] + wall.end[0]]
                    };
                } else {
                    wall = {
                        start: [wall.start[2], 0, -1*a[2] + a[0]-wall.start[0]],
                        end: [wall.end[2], 0, -1*a[2] + a[0]-wall.end[0]]
                    };
                }
            }

            if ((wall.start[0]-s <= x && x <= wall.end[0]+s) ||
                    (wall.end[0]-s <= x && x <= wall.start[0]+s)) {
                var t = wall.start[2] - z;
                var te = wall.end[2] - z;
                if (Math.abs(te) < Math.abs(t)) {
                    t = te;
                }
                if (t > 0 && t < dists[1]) {
                    dists[1] = t;
                } else if (t < 0 && -t < dists[3]) {
                    dists[3] = -t;
                }
            }
            if ((wall.start[2]-s <= z && z <= wall.end[2]+s) ||
                    (wall.end[2]-s <= z && z <= wall.start[2]+s)) {
                var t = wall.start[0] - x;
                var te = wall.end[0] - x;
                if (Math.abs(te) < Math.abs(t)) {
                    t = te;
                }
                if (t > 0 && t < dists[0]) {
                    dists[0] = t;
                } else if (t < 0 && -t < dists[2]) {
                    dists[2] = -t;
                }
            }
        }
    }
    for (var i = 0; i < dists.length; i++) {
        dists[i] -= this.offsets[0];
    }
    return dists;
}

function PcBike(id, face, pos, dir) {
    Bike.call(this, id, face, pos, dir);

    this.controls = this.controls.bind(this);
    addEventListener("keydown", this.controls);
}
PcBike.prototype = Object.create(Bike.prototype);
PcBike.prototype.constructor = PcBike;

PcBike.prototype.controls = function(e) {
    if (!paused) {
        if (e.keyCode === 32) { // space
            if (!this.jumping) {
                this.jumping = true;
                this.upvel = 30;
                this.pushWall();
            }
        } else if (e.keyCode === 87) { // w
            this.spd = 150;
        } else if (e.keyCode === 65) { // a
            this.turn(false);
        } else if (e.keyCode === 83) { // s
            this.spd = 100;
        } else if (e.keyCode === 68) { // d
            this.turn(true);
        }
    }
}

function CpuBike(id, face, pos, dir) {
    Bike.call(this, id, face, pos, dir);
}
CpuBike.prototype = Object.create(Bike.prototype);
CpuBike.prototype.constructor = CpuBike;

CpuBike.prototype.update = function(world) {
    var CPU_TURNRATE = 100; //cpu has 1 in CPU_TURNRATE chance of turning
    var pika = 10;
    var dist = world.elapsed * this.spd;
    var wdist = this.nearestWalls();
    var cdist = wdist[this.dir];
    var rcdist = wdist[(this.dir + 1) % 4];
    var lcdist = wdist[(this.dir + 3) % 4];
    // TODO: make cpubikes capable of jumping
    if (cdist - dist <= pika) {
        if (rcdist - dist > pika && lcdist - dist > pika) {
            var r = randint(0, 10);
            if (rcdist > lcdist) {
                this.turn(r < 7);
            } else {
                this.turn(r >= 7);
            }
        } else {
            if (rcdist - dist > pika) {
                this.turn(true);
            } else if (lcdist - dist > pika) {
                this.turn(false);
            } else {
                if (cdist > lcdist) {
                    if (rcdist > cdist) {
                        this.turn(true);
                    }
                } else if (lcdist > rcdist) {
                    this.turn(false);
                } else {
                    this.turn(true);
                }
            }
        }
    } else {
        var r = randint(0, CPU_TURNRATE);
        if (r === 0) {
            if (rcdist > pika && lcdist > pika) {
                if (randint(0, 2) === 0) {
                    this.turn(true);
                } else {
                    this.turn(false);
                }
            } else {
                if (rcdist > pika) {
                    this.turn(true);
                } else {
                    this.turn(false);
                }
            }
        }
    }
    Bike.prototype.update.call(this, world);
}

CpuBike.prototype.distanceFromWall = function(pos, dir) {
    if (dir === 0) {
        return world.arena.size[0] - pos[0];
    }
    if (dir === 1) {
        return world.arena.size[2] - pos[2];
    }
    if (dir === 2) {
        return pos[0];
    }
    if (dir === 3) {
        return pos[2];
    }
    throw "distanceFromWall: illegal dir";
}

function Wall(start, end, face, dir, id) {
    this.type = "wall";
    this.start = start.slice();
    this.end = end.slice();
    this.face = face;
    this.dir = dir;
    this.id = id;
    this.dying = false;
    this.life = 1.0;
}

Wall.prototype.extend = function(amt) {
    if (this.dir === 0) {
        this.end[0] += amt;
    } else if (this.dir === 1) {
        this.end[2] += amt;
    } else if (this.dir === 2) {
        this.end[0] -= amt;
    } else if (this.dir === 3) {
        this.end[2] -= amt;
    }
}

Wall.prototype.extendTo = function(pos) {
    this.end[0] = pos[0];
    this.end[2] = pos[2];
}

Wall.prototype.update = function(world) {
    if (this.dying) {
        this.life -= 2 * world.elapsed;
        if (this.life <= 0) {
            this.dead = true;
        }
    }
}

function initializeGeometry() {
    function convert(v) {
        var converted = [];
        for (var i = 0; i < v.length; i++) {
            converted.push(v[i]);
            if (i % 3 === 2) {
                converted.push(1.0);
            }
        }
        return converted;
    }

    var geo, shape, image, xmlhttp;

    geometry = {};

    geometry.cubeORotate = [
        identity(),
        mult(rotate(-90, [-1,0,0]), rotate(90, [0,0,1])),
        mult(rotate(-90, [0,0,-1]), rotate(-90, [1,0,0])),
        rotate(180, [0,0,1]),
        mult(rotate(90, [1,0,0]), rotate(-90, [0,0,1])),
        mult(rotate(-90, [0,0,1]), rotate(90, [1,0,0]))
    ]

    geo = geometry.cubeRotate = [];
    for (var i = 0; i < geometry.cubeORotate.length; i++) {
        var m = identity();
        m = mult(m, translate(stretched(0.5, arenaSize)));
        m = mult(m, geometry.cubeORotate[i]);
        m = mult(m, translate(stretched(-0.5, arenaSize)));
        geo.push(m);
    }

    geo = geometry.arena = {};
    geo.shape = makeCube(50);
    geo.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geo.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(geo.shape.vertices), gl.DYNAMIC_DRAW);
    geo.numVertices = geo.shape.vertices.length;
    geo.texture = gl.createTexture();
    image = document.getElementById("arenaTexture");
    configureTexture(geo.texture, image);
    geo.texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geo.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(geo.shape.texCoords), gl.DYNAMIC_DRAW);
    geo.generateModel = function(obj) {
        return mult(translate(obj.position), scale(obj.size));
    }
    geo.colorBuffer = gl.createBuffer();
    geo.transparent = false;
    geo.coloring = false;
    geo.update = function(world, obj) {
        var trans = [];
        var cpos = camera.position;
        if (cpos[1] <= 0) trans.push(0);
        if (cpos[2] <= 0) trans.push(1);
        if (cpos[2] >= world.arena.size[2]) trans.push(2);
        if (cpos[0] >= world.arena.size[0]) trans.push(3);
        if (cpos[0] <= 0) trans.push(4);
        if (cpos[1] >= world.arena.size[1]) trans.push(5);
        var vertices = [];
        var texCoords = [];
        if (trans.length === 0) {
            if (!this.transparent) {
                return false;
            }
            this.transparent = false;
            this.coloring = false;
            vertices = this.shape.vertices;
            texCoords = this.shape.texCoords;
        }
        else {
            this.transparent = true;
            this.coloring = true;
            var colors = [];
            for (var i = 0; i < 6; i++) {
                if (trans.indexOf(i) === -1) {
                    for (var j = 0; j < 6; j++) {
                        vertices.push(this.shape.vertices[i*6+j]);
                        texCoords.push(this.shape.texCoords[i*6+j]);
                        colors.push([1.0, 1.0, 1.0, 1.0]);
                    }
                }
            }
            for (var i = 0; i < trans.length; i++) {
                for (var j = 0; j < 6; j++) {
                    vertices.push(this.shape.vertices[trans[i]*6+j]);
                    texCoords.push(this.shape.texCoords[trans[i]*6+j]);
                    colors.push([1.0, 1.0, 1.0, 0.2]);
                }
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.DYNAMIC_DRAW);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.DYNAMIC_DRAW);
        return true;
    }

    geo = geometry.bike = {};
    xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType("text/plain; charset=ascii");
    xmlhttp.open("GET", "bike.obj", false);
    xmlhttp.send();
    var m = new OBJ.Mesh(xmlhttp.responseText);
    m.vertices = convert(m.vertices);
    m.normals = convert(m.vertexNormals);
    geo.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geo.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(m.indices), gl.STATIC_DRAW)
    geo.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geo.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(m.vertices), gl.STATIC_DRAW);
    geo.numVertices = m.vertices.length / 4;
    geo.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geo.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(m.normals), gl.STATIC_DRAW);
    geo.lighting = function(obj) {
        var res = {
            specular: [0.3, 0.3, 0.3],
            shininess: 4.0,
        }

        // Color definitions based on lighting
        if (obj.id === 0) {
            res.ambient = [0.11, 0.3, 0.5];
            res.diffuse = [0.1, 0.1, 0.25];
        } else if (obj.id === 1) {
            res.ambient = [0.6, 0.15, 0.23];
            res.diffuse = [0.3, 0.16, 0.13];
        } else if (obj.id === 2) {
            res.ambient = [0.0, 0.5, 0.15];
            res.diffuse = [0.05, 0.2, 0.13];
        } else if (obj.id === 3) {
            res.ambient = [0.3, 0.2, 0.12];
            res.diffuse = [0.1, 0.1, 0.15];
        } else if (obj.id === 4) {
            res.ambient = [0.37, 0.15, 0.6];
            res.diffuse = [0.15, 0.1, 0.25];
        } else if (obj.id === 5) {
            res.ambient = [0.75, 0.3, 0.0];
            res.diffuse = [0.15, 0.1, 0.05];
        } else if (obj.id === 6) {
            res.ambient = [0.05, 0.37, 0.3];
            res.diffuse = [0.1, 0.2, 0.1];
        } else {
            res.ambient = [0.3, 0.4, 0.37];
            res.diffuse = [0.1, 0.13, 0.1];
        }

        if (paused) {
            for(var i = 0; i < 3; i++) {
                res.ambient[i] *= 0.1;
                res.diffuse[i] *= 0.1;
            }
        }

        return res;
    }
    geo.baseModel = mult(scale(1.4, 1.47, 1.4),
                    mult(translate(0.8, -0.1, 0),
                         rotate(-90, [1, 0, 0])));
    geo.generateModel = function(obj) {
        var model = geometry.cubeRotate[obj.face];
        model = mult(model, translate(obj.position));
        model = mult(model, rotate(360 - obj.dir * 90, [0, 1, 0]));
        if (obj.jumping) {
            var turnAmt = obj.position[1] + obj.upvel * 0.15;
            model = mult(model, rotate(turnAmt, [0, 0, 1]));
        }
        model = mult(model, this.baseModel);
        return model;
    }

    geo = geometry.wall = {};
    shape = makeCube();
    geo.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geo.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.vertices), gl.STATIC_DRAW);
    geo.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geo.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.normals), gl.STATIC_DRAW);
    geo.numVertices = shape.vertices.length;
    geo.update = function(world, obj) {
        var c = obj.geocache;
        if (!c) {
            c = obj.geocache = {}
        }
        if (!c.rstart) {
            c.rstart = transform(geometry.cubeRotate[obj.face], obj.start);
        }
        if (!c.model) {
            for (var i = 0; i < world.bikes.length; i++) {
                if (obj === world.bikes[i].currentWall) {
                    return false;
                }
            }
            c.model = this.generateModel(obj);
            c.rend = transform(geometry.cubeRotate[obj.face], obj.end);
        }
        return false;
    }
    geo.lighting = function (obj) {
        var res = geometry.bike.lighting(obj);
        stretch(2.2, res.ambient);
        res.specular = [0,0,0,0];
        return res;
    }
    geo.generateModel = function(obj) {
        if (!obj.dying && obj.geocache.model) {
            return obj.geocache.model;
        }
        var v = subtract(obj.end, obj.start);
        var size = [0.1, 1.5 * obj.life, length(v)];
        var angle = angleBetweenY([0, 0, 1], v);
        var model = geometry.cubeRotate[obj.face];
        model = mult(model, translate(obj.start));
        model = mult(model, rotate(angle, [0, 1, 0]));
        model = mult(model, translate(-size[0] / 2, 0, -size[0] / 2));
        model = mult(model, scale(size));
        return model;
    }
    geo.isVisible = function(obj) {
        if (obj.face === camera.face + 3 || camera.face === obj.face + 3) {
            return false;
        }
        var u = camera.dir;
        var sv = obj.geocache.rstart;
        var sa = angleBetween(u, subtract(sv, camera.position)).angle;
        if (Math.abs(sa) < 50) {
            return true;
        }
        var ev = obj.geocache.rend;
        if (!ev) {
            ev = transform(geometry.cubeRotate[obj.face], obj.end);
        }
        var ea = angleBetween(u, subtract(ev, camera.position)).angle;
        if (Math.abs(ea) < 50) {
            return true;
        }
        var v = subtract(ev, sv);
        var w0 = subtract(camera.position, sv)
        var a = dot(u, u);
        var b = dot(u, v);
        var c = dot(v, v);
        var d = dot(u, w0);
        var e = dot(v, w0);
        var tc = (a*e - b*d) / (a*c - b*b);
        if (tc > 0 && tc < 1) {
            var cv = add(sv, stretched(tc, v));
            var ca = angleBetween(camera.dir, subtract(cv, camera.position)).angle;
            if (Math.abs(ca) < 50) {
                return true;
            }
        }
        return false;
    }
}

function configureTexture(texture, image) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
        gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    var ext = (
        gl.getExtension('EXT_texture_filter_anisotropic') ||
        gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
        gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
    );
    if (ext) {
        var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
    }
}

function render(time) {
    // Update game state
    world.update(time);

    // Clear screen
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Adjust camera to player position and direction
    camera.update()
    setUniform(gl.uniformMatrix4fv, "vView", flatten(camera.view()));
    setUniform(gl.uniformMatrix4fv, "vProjection", flatten(camera.projection()));

    // Draw game objects
    // prevGeo is a quick and dirty hack to detect state changes, because
    // calling uniforms and rebinding buffers is expensive
    var prevGeo = null;
    for (var i = world.objects.length-1; i >= 0; i--) {
        var obj = world.objects[i];
        var geo = geometry[obj.type];

        // Don't draw dead objects
        if (obj.dead) {
            continue;
        }

        // Perform full update on geometry (hopefully rare)
        if (geo.update && geo.update(world, obj)) {
            prevGeo = null;
        }

        // Cull
        if (typeof(geo.isVisible) === "function" && !geo.isVisible(obj)) {
            continue;
        }

        // Special sauce for wall
        if (prevGeo !== geo) {
            setUniform(gl.uniform1i, "isWall", obj.type === "wall");
        }

        // Switch vertex buffer
        if (prevGeo !== geo) {
            gl.bindBuffer(gl.ARRAY_BUFFER, geo.vertexBuffer);
            setAttrib("vPosition", 4);
        }

        // Set model transform (depends heavily on object type)
        var model = geo.generateModel(obj);
        setUniform(gl.uniformMatrix4fv, "vModel", flatten(model));

        // Configure texture, if defined
        if (prevGeo !== geo) {
            if (geo.texture) {
                toggleAttrib("vTexCoord", true);
                setUniform(gl.uniform1i, "useTexture", true);

                // Switch texCoord buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, geo.texCoordBuffer);
                setAttrib("vTexCoord", 2);

            } else {
                toggleAttrib("vTexCoord", false);
                setUniform(gl.uniform1i, "useTexture", false);
            }
        }

        // Configure lighting, if defined
        if (geo.lighting) {
            if (prevGeo !== geo) {
                toggleAttrib("vNormal", true);
                setUniform(gl.uniform1i, "useLighting", true);

                // Switch normal buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, geo.normalBuffer);
                setAttrib("vNormal", 4);
            }

            // Setting reflection stuff
            var lighting = geo.lighting;
            if (typeof(lighting) === "function") {
                lighting = lighting(obj);
            }
            if (!prevGeo || prevGeo.lighting !== lighting) {
                var diffuse = vec4(lighting.diffuse);
                var specular = vec4(lighting.specular);
                var ambient = vec4(lighting.ambient);
                setUniform(gl.uniform4fv, "ambient", flatten(ambient));
                setUniform(gl.uniform4fv, "diffuse", flatten(diffuse));
                setUniform(gl.uniform4fv, "specular", flatten(specular));
                setUniform(gl.uniform1f, "shininess", lighting.shininess);
            }
        } else {
            if (prevGeo !== geo) {
                toggleAttrib("vNormal", false);
                setUniform(gl.uniform1i, "useLighting", false);
            }
        }

        // Configure color scaling, if defined
        if (geo.coloring) {
            if (prevGeo !== geo) {
                toggleAttrib("vColor", true);
                setUniform(gl.uniform1i, "useColoring", true);

                // Switch color buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, geo.colorBuffer);
                setAttrib("vColor", 4);
            }
        } else {
            if (prevGeo !== geo) {
                toggleAttrib("vColor", false);
                setUniform(gl.uniform1i, "useColoring", false);
            }
        }

        if (geo.transparent) {
            gl.enable(gl.BLEND);
            gl.depthMask(false);
        }
        if (geo.indexBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geo.indexBuffer);
            gl.drawElements(gl.TRIANGLES, geo.numVertices, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, geo.numVertices);
        }
        if (geo.transparent) {
            gl.disable(gl.BLEND);
            gl.depthMask(true);
        }

        prevGeo = geo;
    }

    // Ask the browser to schedule next frame for us
    requestAnimFrame(render);
}

function setUniform(setterFn, key, value) {
    if (!setUniform.cache) {
        setUniform.cache = {};
    }

    var loc = setUniform.cache[key];
    if (loc === undefined) {
        loc = gl.getUniformLocation(program, key);
        setUniform.cache[key] = loc;
    }
    if (setterFn === gl.uniformMatrix4fv) {
        gl.uniformMatrix4fv(loc, false, value);
    } else {
        setterFn.call(gl, loc, value);
    }
}

function setAttrib(key, value) {
    var loc = gl.getAttribLocation(program, key);
    gl.vertexAttribPointer(loc, value, gl.FLOAT, false, 0, 0);
}

function toggleAttrib(key, enable) {
    var loc = gl.getAttribLocation(program, key);
    if (enable) {
        gl.enableVertexAttribArray(loc);
    } else {
        gl.disableVertexAttribArray(loc);
    }
}

function Controller() {
    this.pressing = {};
    this.disable_bgm = false;
    this.bgm = document.getElementById('bgm');
    addEventListener("keydown", this.keydown.bind(this));
    addEventListener("keyup", this.keyup.bind(this));
}

Controller.prototype.start = function() {
    document.getElementById("start").style.visibility = "hidden";
    started = true;
    this.pause(false);
}

Controller.prototype.restart = function() {
    // Remove existing world, if any
    if (world) {
        removeEventListener("keydown", world.player.controls);
        world = undefined;
    }

    // Create game world / logic controller
    world = new World();
    world.addBike(PcBike);
    world.player = world.bikes[0];
    for (var i = 0; i < 15; i++)
        world.addBike(CpuBike);
    world.time = window.performance.now() / 1000;

    // Remove existing camera, if any
    if (camera) {
        removeEventListener("keydown", camera.controls);
        camera = undefined;
    }

    // Create camera object
    var aspect = canvas.width / canvas.height;
    camera = new Camera(aspect);

    won = false;
    document.getElementById("victory").style.visibility = "hidden";

    // Set up
    document.getElementById("start").style.visibility = "visible";
    started = false;

    // Start out game paused
    controller.pause(false);
    controller.pause(true);
}


Controller.prototype.pause = function(p) {
    if (paused === p) {
        return;
    }
    paused = !paused;

    // pause
    if (paused) {
        if (started) {
            document.getElementById("resume").style.visibility = "visible";
        }

    // unpause
    } else {
        document.getElementById("resume").style.visibility = "hidden";
    }

    geometry.arena.texture = gl.createTexture();
    var image;
    if(!paused) {
        image = document.getElementById("arenaTexture");
    } else {
        image = document.getElementById("arenaTexturePause");
    }
    configureTexture(geometry.arena.texture, image);
}

Controller.prototype.keydown = function(e) {
    this.pressing[e.keyCode] = true;
    if (e.keyCode === 27) { // esc
        if (started) {
            this.pause(!paused);
        }
    }
    else if (e.keyCode == 13) { //  enter
        if (!started) {
            this.start();
        } else {
            this.restart();
        }
    } else if (e.keyCode === 77) { // m
        if (this.bgm.error) {
            return;
        }
        this.disable_bgm = !this.disable_bgm;
        if (this.disable_bgm) {
            this.bgm.pause();
        } else if (!paused) {
            this.bgm.currentTime = 0;
            this.bgm.play();
        }
    }
}

Controller.prototype.keyup = function(e) {
    this.pressing[e.keyCode] = false;
}
