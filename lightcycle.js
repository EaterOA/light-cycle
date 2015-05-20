// Global webgl references
var gl;
var program;

// State variables
var world;
var geometry;
var aspect = 1.0;
var cameraPosition = [1, 10, 20];
var cameraX = -10;
var cameraY = 0;
var cameraFov = 60;

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

    // Create game world / logic controller
    world = new World();
    world.addBike(PcBike);
    world.player = world.bikes[0];
    world.addBike(CpuBike);
    world.addBike(CpuBike);

    // Create the geometry used in World objects
    initializeGeometry();

    // Other set up
    addEventListener("keydown", handleKey);
    toggleAttrib("vPosition", true);
    setUniform(gl.uniform1i, "texture", 0);
    setUniform(gl.uniform4fv, "lightPosition", flatten(vec4(geometry.light.position)));

    // First frame
    requestAnimFrame(render);
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
}

World.prototype.addBike = function(type)
{
    if (this.bikes.length >= this.bikeLimit) {
        console.log("addBike: reached bike limit");
        return;
    }
    var range = this.arena.size;
    var pos = [rand(0, range[0]), 0, rand(0, range[2])];
    var bike = new type(pos, this.objects.length);
    this.bikes.push(bike);
    this.objects.push(bike);
}

function Bike(pos, id)
{
    this.type = "bike";
    this.position = pos.slice();
    this.spd = 100.0;
    this.dir = 0;
    this.currentWall = null;
    this.prevWall = null;
    this.id = id;
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
            objs.splice(i, 1);
            i--;
        }
    }
}

Bike.prototype.update = function(world)
{
    if (this.dead)
        return;

    var dist = world.elapsed * this.spd;
    var pos = this.position;
    var next = pos.slice();
    if (this.dir == 0) next[0] += dist;
    if (this.dir == 1) next[2] += dist;
    if (this.dir == 2) next[0] -= dist;
    if (this.dir == 3) next[2] -= dist;


    // Detection collision with wall
    for (var i = 0; i < world.objects.length; i++) {
        var obj = world.objects[i];
        if (obj.type != "wall")
            continue;
        if (obj == this.currentWall || obj == this.prevWall)
            continue;
        if ((obj.start[0] > pos[0]) ^ (obj.start[0] > next[0]) &&
                (pos[2] > obj.start[2]) ^ (pos[2] > obj.end[2])) {
            this.dead = true;
            next[0] = obj.start[0];
            this.removeWalls();
        }
        else if ((obj.start[2] > pos[2]) ^ (obj.start[2] > next[2]) &&
                (pos[0] > obj.start[0]) ^ (pos[0] > obj.end[0])) {
            this.dead = true;
            next[2] = obj.start[2];
            this.removeWalls();
        }
    }

    // Detect collision with arena boundary
    if (next[0] <= 0 || next[0] >= world.arena.size[0] ||
            next[2] <= 0 || next[2] >= world.arena.size[2]) {
        this.dead = true;
        next[0] = Math.max(0, Math.min(next[0], world.arena.size[0]))
        next[2] = Math.max(0, Math.min(next[2], world.arena.size[2]))
        this.removeWalls();
    }

    this.position = next;
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

PcBike.prototype = Object.create(Bike.prototype);
PcBike.prototype.constructor = PcBike;
function PcBike(pos, id)
{
    Bike.call(this, pos, id);
    addEventListener("keydown", function(e) {
        if (e.keyCode == 74) { // j
            this.turn(false);
        }
        else if (e.keyCode == 75) { // k
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
    var wdist = CpuBike.nearestWalls(this.position);
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

CpuBike.nearestWalls = function(pos)
{
    var x = pos[0];
    var z = pos[2];
    var objs = world.objects;
    var dists = [world.arena.size[0] - x, world.arena.size[2] - z, x, z];
    for (var i = 0; i < objs.length; i++)
    {
        if (objs[i].type == "wall")
        {
            var wall = objs[i];
            if ((wall.start[0] <= x && x <= wall.end[0]) ||
                (wall.end[0] <= x && x <= wall.start[0]))
            {
                var t = wall.start[2] - z;
                if (t > 0 && t < dists[0])
                    dists[1] = t;
                else if (t < 0 && -t < dists[2])
                    dists[3] = -t;
            }
            else if ((wall.start[2] <= z && z <= wall.end[2]) ||
                (wall.end[2] <= z && z <= wall.start[2]))
            {
                var t = wall.start[0] - x;
                if (t > 0 && t < dists[2])
                    dists[0] = t;
                else if (t < 0 && -t < dists[3])
                    dists[2] = -t;
            }
        }
    }
    return dists;
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

function initializeGeometry()
{
    var geo, shape, image;

    geometry = {};

    geo = geometry.light = {};
    geo.ambient = [0.4, 0.8, 0.8];
    geo.diffuse = [0.8, 0.9, 0.9];
    geo.specular = [0.8, 1.0, 0.9];
    geo.position = [500, 500, 500];

    geo = geometry.arena = {};
    shape = makeCube(100);
    geo.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geo.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.vertices), gl.STATIC_DRAW);
    geo.numVertices = shape.vertices.length;
    geo.texture = gl.createTexture();
    image = document.getElementById("arenaTexture");
    configureTexture(geo.texture, image);
    geo.texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geo.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.texCoords), gl.STATIC_DRAW);
    geo.generateModel = function(obj) {
        var model = identity();
        model = mult(model, translate(obj.position));
        model = mult(model, scale(obj.size));
        return model;
    }

    geo = geometry.bike = {};
    shape = makeCube();
    geo.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geo.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.vertices), gl.STATIC_DRAW);
    geo.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geo.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.normals), gl.STATIC_DRAW);
    geo.numVertices = shape.vertices.length;
    geo.ambient = [0.7, 0.5, 0.8];
    geo.diffuse = [0.2, 0.31, 0.35];
    geo.specular = [0.5, 0.5, 0.5];
    geo.shininess = 4.0;
    geo.generateModel = function(obj) {
        var model = identity();
        model = mult(model, translate(obj.position));
        model = mult(model, translate([-0.5, 0, -0.5]));
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
    geo.ambient = [0.7, 0.8, 1.0];
    geo.diffuse = [0.7, 0.51, 0.95];
    geo.specular = [0.3, 0.1, 0.8];
    geo.shininess = 3.0;
    geo.generateModel = function(obj) {
        var v = subtract(obj.end, obj.start);
        var size = [0.2, 2, length(v)];
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
}

function render(time)
{
    // Update game state
    world.update(time);

    // Clear screen
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Adjust camera to player position and direction
    if (world.player) {
        var p = world.player;

        // Adjust direction
        var nextAngle = normalizeAngle((270 - p.dir * 90) - 8);
        var diff = angleDiff(cameraY, nextAngle);
        var sign = (diff >= 0 ? 1.0 : -1.0);
        var rotateSpd = sign * Math.pow(Math.abs(diff), 1.5);
        var rotateAmt = rotateSpd * world.elapsed;
        if (Math.abs(diff) < Math.abs(rotateAmt))
            cameraY = nextAngle;
        else
            cameraY += rotateAmt;
        cameraY = normalizeAngle(cameraY);

        // Adjust position
        cameraPosition = p.position.slice();
        var offset = transform(rotate(cameraY, [0, 1, 0]), vec4(-1.2, 7, 21));
        cameraPosition = add(cameraPosition, offset.slice(0,3));
    }

    // Adjust view
    var view = identity();
    view = mult(view, rotate(-cameraX, [1, 0, 0]));
    view = mult(view, rotate(-cameraY, [0, 1, 0]));
    view = mult(view, translate(negate(cameraPosition)));
    setUniform(gl.uniformMatrix4fv, "vView", flatten(view));

    // Adjust projection
    var fovy = Math.atan(Math.tan(radians(cameraFov / 2)) / aspect);
    fovy = degrees(fovy) * 2;
    projection = perspective(fovy, aspect, 1, 5000);
    setUniform(gl.uniformMatrix4fv, "vProjection", flatten(projection));

    // Draw game objects
    // prevGeo is a quick and dirty hack to detect state changes, because
    // calling uniforms and rebinding buffers is expensive
    var prevGeo = null;
    for (var i = 0; i < world.objects.length; i++) {
        var obj = world.objects[i];
        var geo = geometry[obj.type];

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

                // Configure texture filter
                gl.bindTexture(gl.TEXTURE_2D, geo.texture);
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
            else {
                toggleAttrib("vTexCoord", false);
                setUniform(gl.uniform1i, "useTexture", false);
            }
        }

        // Configure lighting, if defined
        if (prevGeo !== geo) {
            if (geo.ambient) {
                    toggleAttrib("vNormal", true);
                    setUniform(gl.uniform1i, "useLighting", true);

                // Switch normal buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, geo.normalBuffer);
                setAttrib("vNormal", 4);

                // Setting reflection stuff
                var ambient = mult(vec4(geometry.light.ambient), vec4(geo.ambient));
                var diffuse = mult(vec4(geometry.light.diffuse), vec4(geo.diffuse));
                var specular = mult(vec4(geometry.light.specular), vec4(geo.specular));
                setUniform(gl.uniform4fv, "ambient", flatten(ambient));
                setUniform(gl.uniform4fv, "diffuse", flatten(diffuse));
                setUniform(gl.uniform4fv, "specular", flatten(specular));
                setUniform(gl.uniform1f, "shininess", geo.shininess);
            }
            else {
                toggleAttrib("vNormal", false);
                setUniform(gl.uniform1i, "useLighting", false);
            }
        }

        gl.drawArrays(gl.TRIANGLES, 0, geo.numVertices);

        prevGeo = geo;
    }

    // Ask the browser to schedule next frame for us
    requestAnimFrame(render);
}

function handleKey(e)
{
    if (e.keyCode == 37) { // left
        cameraY += 1;
    }
    else if (e.keyCode == 39) { // right
        cameraY += -1;
    }
    else if (e.keyCode == 38) { // up
        cameraPosition[1] += 1;
    }
    else if (e.keyCode == 40) { // down
        cameraPosition[1] += -1;
    }
    else if (e.keyCode == 87) { // w
        var dir = transform(rotate(cameraY, [0, 1, 0]), vec4(0, 0, -1));
        cameraPosition = add(cameraPosition, dir.slice(0,3));
    }
    else if (e.keyCode == 65) { // a
        var dir = transform(rotate(cameraY, [0, 1, 0]), vec4(-1, 0, 0));
        cameraPosition = add(cameraPosition, dir.slice(0,3));
    }
    else if (e.keyCode == 83) { // s
        var dir = transform(rotate(cameraY, [0, 1, 0]), vec4(0, 0, 1));
        cameraPosition = add(cameraPosition, dir.slice(0,3));
    }
    else if (e.keyCode == 68) { // d
        var dir = transform(rotate(cameraY, [0, 1, 0]), vec4(1, 0, 0));
        cameraPosition = add(cameraPosition, dir.slice(0,3));
    }
    else if (e.keyCode == 90) { // z
        cameraX += 1;
    }
    else if (e.keyCode == 88) { // x
        cameraX += -1;
    }
    else if (e.keyCode == 80) { // p (for debug purposes)
        console.log(world.bikes[1].dir, flatten(CpuBike.nearestWalls(cameraPosition)));
    }
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
