// Global webgl references
var gl;
var program;

// State trackers
var world;
var geometry;
var camera;
var controller;

window.onload = function init()
{
    // Get HTML canvas element
    var canvas = document.getElementById("gl-canvas");

    // Get webgl context
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // Configure high-level gl settings
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Adjust framebuffer and viewport size for CSS
    var displayHeight = canvas.clientHeight;
    var displayWidth = canvas.clientWidth;
    if (displayHeight != canvas.height)
        canvas.height = displayHeight;
    if (displayWidth != canvas.width)
        canvas.width = displayWidth;
    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = canvas.width / canvas.height;

    // Compile shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Create controller handler
    controller = new Controller();

    // Create camera object
    camera = new Camera(aspect);

    // Create game world / logic controller
    world = new World();
    world.addBike(PcBike);
    world.player = world.bikes[0];
    world.addBike(CpuBike);
    world.addBike(CpuBike);
    world.addBike(CpuBike);
    world.addBike(CpuBike);
    world.addBike(CpuBike);
    world.addBike(CpuBike);

    // Create the geometry used in World objects
    initializeGeometry();

    // Other set up
    toggleAttrib("vPosition", true);
    setUniform(gl.uniform1i, "texture", 0);
    setUniform(gl.uniform4fv, "lightPosition", flatten(vec4(geometry.light.position)));
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    world.time = window.performance.now() / 1000;

    // Start game
    requestAnimFrame(render);
}

function Camera(aspect)
{
    this.aspect = aspect;
    this.fovx = 60;
    this.position = [1, 10, 20];
    this.rotation = [-10, 0];
    this.free = false;

    addEventListener("keydown", function(e) {
        if (e.keyCode == 70) // f
            this.free = !this.free;
    }.bind(this));
}

Camera.prototype.update = function()
{
    // Update according to player perspective
    if (world.player && !this.free) {

        // Attached rotation
        if (controller.pressing[37]) // left
            this.rotation[1] += 180 * world.elapsed;
        if (controller.pressing[39]) // right
            this.rotation[1] -= 180 * world.elapsed;

        // State adjustments based on player actions
        var bikeTurned = this.bikePrevDir != world.player.dir;
        if (bikeTurned)
            this.fullOffset = true;
        this.bikePrevDir = world.player.dir;
        var rotating = controller.pressing[37] || controller.pressing[39];
        if (rotating)
            this.fullOffset = false;

        // Adjust direction
        var maxOffset = this.fullOffset ? 12 : 35;
        var snapMult = rotating ? 1.2 : 1.5;
        var curAngle = this.rotation[1];
        var trueAngle = 270 - world.player.dir * 90;
        var angleOffset = angleDiff(trueAngle, curAngle);
        if (-maxOffset > angleOffset || angleOffset > maxOffset) {
            var diff = angleDiff(curAngle, trueAngle + maxOffset)
            var diff2 = angleDiff(curAngle, trueAngle - maxOffset)
            if (Math.abs(diff2) < Math.abs(diff))
                diff = diff2;
            var sign = (diff >= 0 ? 1.0 : -1.0);
            var rotateSpd = sign * Math.pow(Math.abs(diff), snapMult);
            curAngle += rotateSpd * world.elapsed;
            this.rotation[1] = normalizeAngle(curAngle);
        }

        // Adjust position
        var anchor = vec4(0, 8.5, 30);
        var nextPos = world.player.position.slice();
        var offset = transform(rotate(this.rotation[1], [0, 1, 0]), anchor);
        nextPos = add(nextPos, offset.slice(0,3));
        this.position = nextPos;
    }

    // Update according to free camera
    else {
        if (controller.pressing[37]) // left
            this.rotation[1] += 120 * world.elapsed;
        if (controller.pressing[39]) // right
            this.rotation[1] += -120 * world.elapsed;
        if (controller.pressing[38]) // up
            this.position[1] += 100 * world.elapsed;
        if (controller.pressing[40]) // down
            this.position[1] += -100 * world.elapsed;
        if (controller.pressing[87]) { // w
            var dir = transform(rotate(this.rotation[1], [0, 1, 0]), vec4(0, 0, -1));
            stretch(100 * world.elapsed, dir);
            this.position = add(this.position, dir.slice(0,3));
        }
        if (controller.pressing[65]) { // a
            var dir = transform(rotate(this.rotation[1], [0, 1, 0]), vec4(-1, 0, 0));
            stretch(100 * world.elapsed, dir);
            this.position = add(this.position, dir.slice(0,3));
        }
        if (controller.pressing[83]) { // s
            var dir = transform(rotate(this.rotation[1], [0, 1, 0]), vec4(0, 0, 1));
            stretch(100 * world.elapsed, dir);
            this.position = add(this.position, dir.slice(0,3));
        }
        if (controller.pressing[68]) { // d
            var dir = transform(rotate(this.rotation[1], [0, 1, 0]), vec4(1, 0, 0));
            stretch(100 * world.elapsed, dir);
            this.position = add(this.position, dir.slice(0,3));
        }
        if (controller.pressing[90]) // z
            this.rotation[0] += 50 * world.elapsed;
        if (controller.pressing[88]) // x
            this.rotation[0] += -50 * world.elapsed;
    }
}

Camera.prototype.view = function()
{
    var view = identity();
    view = mult(view, rotate(-this.rotation[0], [1, 0, 0]));
    view = mult(view, rotate(-this.rotation[1], [0, 1, 0]));
    view = mult(view, translate(negate(this.position)));
    return view;
}

Camera.prototype.projection = function()
{
    var fovy = Math.atan(Math.tan(radians(this.fovx / 2)) / aspect);
    fovy = degrees(fovy) * 2;
    return perspective(fovy, this.aspect, 1, 5000);
}

function World()
{
    this.time = 0;
    this.elapsed = 0;
    this.bikes = [];
    this.bikeLimit = 8;
    this.objects = [];

    var arena = {};
    arena.type = "arena";
    arena.position = [0, 0, 0];
    arena.size = [1000, 1000, 1000];
    this.objects.push(arena);

    this.arena = arena;
    this.player = null;
}

World.prototype.update = function(time)
{
    time /= 1000.0;
    this.elapsed = time - this.time;
    this.time = time;

    for (var i = 0; i < this.objects.length; i++) {
        var obj = this.objects[i];
        if (obj.update)
            obj.update(this);
    }

    var newList = [];
    for (var i = 0; i < this.objects.length; i++) {
        var obj = this.objects[i];
        if (obj.type == "wall" && obj.dead) {}
        else
            newList.push(obj);
    }
    this.objects = newList;
}

World.prototype.addBike = function(type)
{
    if (this.bikes.length >= this.bikeLimit) {
        console.log("addBike: reached bike limit");
        return;
    }
    var range = this.arena.size;
    var pos = [rand(0, range[0]), 0, rand(0, range[2])];
    var bike = new type(pos, this.bikes.length);
    this.bikes.push(bike);
    this.objects.push(bike);
}

function Bike(pos, id)
{
    this.type = "bike";
    this.position = pos.slice();
    this.spd = 100.0;
    this.dir = 0;
    this.id = id;
    this.offsets = [1, 0.7];
    this.currentWall = null;
    this.prevWall = null;
    this.pushWall();
}

Bike.prototype.turn = function(right)
{
    if (right)
        this.dir = (this.dir + 1) % 4;
    else
        this.dir = (this.dir + 3) % 4;
    this.pushWall();
}

Bike.prototype.removeWalls = function()
{
    var objs = world.objects;
    for(var i = 0; i < objs.length; i++)
    {
        if(objs[i].id == this.id && objs[i].type == "wall")
        {
            objs[i].dying = true;
        }
    }
}

Bike.prototype.update = function(world)
{
    if (this.dead)
        return;

    var dist = world.elapsed * this.spd;

    // Detection collision with wall
    var wdist = Bike.nearestWalls(this.position, this.offsets);
    if (wdist[this.dir] < dist) {
        dist = wdist[this.dir];
        this.dead = true;
        this.removeWalls();
    }

    if (this.dir == 0) this.position[0] += dist;
    if (this.dir == 1) this.position[2] += dist;
    if (this.dir == 2) this.position[0] -= dist;
    if (this.dir == 3) this.position[2] -= dist;

    this.currentWall.extendTo(this.position);
}

Bike.prototype.pushWall = function()
{
    if(!this.dead)
    {
        var maki = new Wall(this.position, this.position, this.dir, this.id);
        world.objects.push(maki);
        this.prevWall = this.currentWall;
        this.currentWall = maki;
    }
}

Bike.nearestWalls = function(pos, offsets)
{
    if (typeof(offsets) == "undefined")
        offsets = [0, 0];

    var x = pos[0];
    var z = pos[2];
    var s = offsets[1];
    var objs = world.objects;
    var dists = [world.arena.size[0] - x, world.arena.size[2] - z, x, z];
    for (var i = 0; i < objs.length; i++)
    {
        if (objs[i].type == "wall")
        {
            var wall = objs[i];
            if ((wall.start[0]-s <= x && x <= wall.end[0]+s) ||
                (wall.end[0]-s <= x && x <= wall.start[0]+s))
            {
                var t = wall.start[2] - z;
                var te = wall.end[2] - z;
                if (Math.abs(te) < Math.abs(t))
                    t = te;
                if (t > 0 && t < dists[1])
                    dists[1] = t;
                else if (t < 0 && -t < dists[3])
                    dists[3] = -t;
            }
            if ((wall.start[2]-s <= z && z <= wall.end[2]+s) ||
                (wall.end[2]-s <= z && z <= wall.start[2]+s))
            {
                var t = wall.start[0] - x;
                var te = wall.end[0] - x;
                if (Math.abs(te) < Math.abs(t))
                    t = te;
                if (t > 0 && t < dists[0])
                    dists[0] = t;
                else if (t < 0 && -t < dists[2])
                    dists[2] = -t;
            }
        }
    }
    for (var i = 0; i < dists.length; i++)
        dists[i] -= offsets[0];
    return dists;
}

PcBike.prototype = Object.create(Bike.prototype);
PcBike.prototype.constructor = PcBike;
function PcBike(pos, id)
{
    Bike.call(this, pos, id);

    addEventListener("keydown", function(e) {
        if (e.keyCode == 87) { // w
        }
        else if (e.keyCode == 65) { // a
            this.turn(false);
        }
        else if (e.keyCode == 83) { // s
        }
        else if (e.keyCode == 68) { // d
            this.turn(true);
        }
    }.bind(this));
}

CpuBike.prototype = Object.create(Bike.prototype);
CpuBike.prototype.constructor = CpuBike;
function CpuBike(pos, id)
{
    Bike.call(this, pos, id);
}

CpuBike.prototype.update = function(world)
{
    var pika = 10;
    var dist = world.elapsed * this.spd;
    var wdist = Bike.nearestWalls(this.position, this.offsets);
    var cdist = wdist[this.dir];
    var rcdist = wdist[(this.dir + 1) % 4];
    var lcdist = wdist[(this.dir + 3) % 4];
    if (cdist - dist <= pika) {
        //console.log(this.dir, lcdist, cdist, rcdist);
        if (rcdist > lcdist)
            this.turn(true);
        else
            this.turn(false);
    }
    Bike.prototype.update.call(this, world);
}

CpuBike.distanceFromWall = function(pos, dir)
{
    if (dir == 0) {
        return world.arena.size[0] - pos[0];
    }
    if (dir == 1) {
        return world.arena.size[2] - pos[2];
    }
    if (dir == 2) {
        return pos[0];
    }
    if (dir == 3) {
        return pos[2];
    }
    throw "distanceFromWall: illegal dir";
}

function Wall(start, end, dir, id)
{
    this.type = "wall";
    this.start = start.slice();
    this.end = end.slice();
    this.dir = dir;
    this.id = id;
    this.dying = false;
    this.life = 1.0;
}

Wall.prototype.extend = function(amt)
{
    if (this.dir == 0)
        this.end[0] += amt;
    else if (this.dir == 1)
        this.end[2] += amt;
    else if (this.dir == 2)
        this.end[0] -= amt;
    else if (this.dir == 3)
        this.end[2] -= amt;
}

Wall.prototype.extendTo = function(pos)
{
    this.end[0] = pos[0];
    this.end[2] = pos[2];
}

Wall.prototype.update = function(world)
{
    if (this.dying) {
        this.life -= 2 * world.elapsed;
        if (this.life <= 0)
            this.dead = true;
    }
}

function initializeGeometry()
{
    function convert(v) {
        var converted = [];
        for (var i = 0; i < v.length; i++) {
            converted.push(v[i]);
            if (i % 3 == 2)
                converted.push(1.0);
        }
        return converted;
    }

    var geo, shape, image, xmlhttp;

    geometry = {};

    geo = geometry.light = {};
    geo.position = [500, 500, 500];

    geo = geometry.arena = {};
    geo.shape = makeCube(100);
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
        var model = identity();
        model = mult(model, translate(obj.position));
        model = mult(model, scale(obj.size));
        return model;
    }
    geo.colorBuffer = gl.createBuffer();
    geo.transparent = false;
    geo.update = function(world, obj) {
        var trans = [];
        if (camera.position[1] <= 0) trans.push(0);
        if (camera.position[2] <= 0) trans.push(1);
        if (camera.position[2] >= world.arena.size[2]) trans.push(2);
        if (camera.position[0] >= world.arena.size[0]) trans.push(3);
        if (camera.position[0] <= 0) trans.push(4);
        if (camera.position[1] >= world.arena.size[1]) trans.push(5);
        var vertices = [];
        var texCoords = [];
        if (trans.length == 0) {
            if (!this.transparent)
                return false;
            this.transparent = false;
            vertices = this.shape.vertices;
            texCoords = this.shape.texCoords;
        }
        else {
            this.transparent = true;
            var colors = [];
            for (var i = 0; i < 6; i++) {
                if (trans.indexOf(i) == -1)
                    for (var j = 0; j < 6; j++) {
                        vertices.push(this.shape.vertices[i*6+j]);
                        texCoords.push(this.shape.texCoords[i*6+j]);
                        colors.push([1.0, 1.0, 1.0, 1.0]);
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

    /* cube bike code
    geo = geometry.bike = {};
    shape = makeCube();
    geo.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geo.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.vertices), gl.STATIC_DRAW);
    geo.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geo.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.normals), gl.STATIC_DRAW);
    geo.numVertices = shape.vertices.length;
    geo.lighting = function(obj) {
        var res = {
            ambient: [0.0, 0.0, 0.0],
            diffuse: [0.0, 0.0, 0.0],
            specular: [0.0, 0.0, 0.0],
            shininess: 1.0,
        }
        if (obj.id == 0) {
            res.ambient = [0.3, 0.5, 0.8];
            res.diffuse = [0.2, 0.29, 0.55];
        }
        else if (obj.id == 1) {
            res.ambient = [0.7, 0.3, 0.4];
            res.diffuse = [0.6, 0.21, 0.15];
        }
        else if (obj.id == 2) {
            res.ambient = [0.2, 0.8, 0.4];
            res.diffuse = [0.3, 0.6, 0.25];
        }
        return res;
    }
    geo.generateModel = function(obj) {
        var model = identity();
        model = mult(model, translate(obj.position));
        model = mult(model, translate([-0.5, 0, -0.5]));
        return model;
    }
    */
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
            ambient: [0.0, 0.0, 0.0],
            diffuse: [0.0, 0.0, 0.0],
            specular: [0.3, 0.3, 0.3],
            shininess: 4.0,
        }
        if (obj.id == 0) {
            res.ambient = [0.15, 0.4, 0.7];
            res.diffuse = [0.2, 0.2, 0.45];
        }
        else if (obj.id == 1) {
            res.ambient = [0.8, 0.2, 0.3];
            res.diffuse = [0.6, 0.31, 0.25];
        }
        else if (obj.id == 2) {
            res.ambient = [0.0, 0.7, 0.2];
            res.diffuse = [0.1, 0.4, 0.25];
        }
        else if (obj.id == 3) {
            res.ambient = [0.6, 0.4, 0.2];
            res.diffuse = [0.6, 0.5, 0.3];
        }
        else if (obj.id == 4) {
            res.ambient = [0.6, 0.5, 1.0];
            res.diffuse = [0.3, 0.3, 0.7];
        }
        else if (obj.id == 5) {
            res.ambient = [1.0, 0.4, 0.0];
            res.diffuse = [0.3, 0.2, 0.1];
        }
        else if (obj.id == 6) {
            res.ambient = [0.05, 0.5, 0.4];
            res.diffuse = [0.2, 0.3, 0.2];
        }
        else if (obj.id == 7) {
            res.ambient = [0.4, 0.5, 0.45];
            res.diffuse = [0.2, 0.22, 0.2];
        }
        return res;
    }
    geo.baseModel = mult(scale(1.4, 1.4, 1.4),
                    mult(translate(1, -0.1, 0),
                         rotate(-90, [1, 0, 0])));
    geo.generateModel = function(obj) {
        var model = identity();
        model = mult(model, translate(obj.position));
        model = mult(model, rotate(360 - obj.dir * 90, [0, 1, 0]));
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
    geo.lighting = function (obj) {
        var res = geometry.bike.lighting(obj);
        stretch(1.1, res.ambient);
        stretch(1.1, res.diffuse);
        res.specular = [0,0,0,0];
        return res;
    }
    geo.generateModel = function(obj) {
        var v = subtract(obj.end, obj.start);
        var size = [0.2, 2 * obj.life, length(v)];
        var angle = angleBetweenY([0, 0, 1], v);
        var model = identity();
        model = mult(model, translate(obj.start));
        model = mult(model, rotate(angle, [0, 1, 0]));
        model = mult(model, translate(-size[0] / 2, 0, 0));
        model = mult(model, scale(size));
        return model;
    }
}

function configureTexture(texture, image)
{
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

function render(time)
{
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
        if (obj.dead)
            continue;

        // Perform full update on geometry (hopefully rare)
        if (geo.update && geo.update(world, obj))
            prevGeo = null;

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

            }
            else {
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
            if (typeof(lighting) == "function") {
                lighting = lighting(obj);
            }
            if (!prevGeo || prevGeo.lighting != lighting) {
                var ambient = vec4(lighting.ambient);
                var diffuse = vec4(lighting.diffuse);
                var specular = vec4(lighting.specular);
                setUniform(gl.uniform4fv, "ambient", flatten(ambient));
                setUniform(gl.uniform4fv, "diffuse", flatten(diffuse));
                setUniform(gl.uniform4fv, "specular", flatten(specular));
                setUniform(gl.uniform1f, "shininess", lighting.shininess);
            }
        }
        else {
            if (prevGeo !== geo) {
                toggleAttrib("vNormal", false);
                setUniform(gl.uniform1i, "useLighting", false);
            }
        }

        // Configure color scaling, if defined
        if (geo.transparent || geo.coloring) {
            if (prevGeo !== geo) {
                toggleAttrib("vColor", true);
                setUniform(gl.uniform1i, "useColoring", true);

                // Switch color buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, geo.colorBuffer);
                setAttrib("vColor", 4);

                // Setting color
                var lighting = geo.lighting;
                if (typeof(lighting) == "function") {
                    lighting = lighting(obj);
                }
            }
        }
        else {
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
        }
        else {
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

function setUniform(setterFn, key, value)
{
    if (!setUniform.cache)
        setUniform.cache = {};

    var loc = setUniform.cache[key];
    if (typeof(loc) == "undefined") {
        loc = gl.getUniformLocation(program, key);
        setUniform.cache[key] = loc;
    }
    if (setterFn == gl.uniformMatrix4fv) {
        gl.uniformMatrix4fv(loc, false, value);
    }
    else {
        setterFn.call(gl, loc, value);
    }
}

function setAttrib(key, value)
{
    var loc = gl.getAttribLocation(program, key);
    gl.vertexAttribPointer(loc, value, gl.FLOAT, false, 0, 0);
}

function toggleAttrib(key, enable)
{
    var loc = gl.getAttribLocation(program, key);
    if (enable)
        gl.enableVertexAttribArray(loc);
    else
        gl.disableVertexAttribArray(loc);
}

function Controller()
{
    this.pressing = {};
    addEventListener("keydown", this.keydown.bind(this));
    addEventListener("keyup", this.keyup.bind(this));
}

Controller.prototype.keydown = function(e)
{
    this.pressing[e.keyCode] = true;

    if (e.keyCode == 80) { // p (for debug purposes)
        console.log(world.bikes[1].dir, flatten(Bike.nearestWalls(cameraPosition)));
    }
}

Controller.prototype.keyup = function(e)
{
    this.pressing[e.keyCode] = false;
}
