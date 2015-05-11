// Global webgl references
var gl;
var program;

// State variables
var world;
var geometry;
var aspect = 1.0;
var cameraPosition = [0, 10, 20];
var cameraX = 0;
var cameraY = -20;
var cameraFov = 50;
var cameraAttached = null;

window.onload = function init()
{
    // Get HTML canvas element
    var canvas = document.getElementById("gl-canvas");

    // Get webgl context
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // Configure high-level gl settings
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Compile shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Create game world / logic controller
    world = new World();

    //
    initializeGeometry();

    // Enable shader attributes
    var positionLocation = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(positionLocation);

    // Other set up
    aspect = canvas.width / canvas.height;
    addEventListener("keydown", handleKey);

    // First frame
    requestAnimFrame(render);
}

var World = function()
{
    this.currentTime = 0;
    this.objects = [];

    var obj = {};
    obj.type = "wall";
    obj.position = [-5.0, 0.0, 0.0];
    obj.size = [10.0, 1.0, -10.0];
    this.objects.push(obj);
}

World.prototype.update = function(time)
{
    time /= 1000.0;
    var elapsed = time - this.currentTime;
    this.currentTime = time;

    for (var i = 0; i < this.objects.length; i++) {
        var obj = this.objects[i];
        //noop
    }
}

function initializeGeometry()
{
    var shape, buffer;

    geometry = {};

    geometry.wall = {};
    shape = makeCube();
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape[0]), gl.STATIC_DRAW);
    geometry.wall.numVertices = shape[0].length;
    geometry.wall.vertexBuffer = buffer;
}

/*
Creates a cube by providing its vertices and texture coordinates
*/
function makeCube(zoom)
{
    var vertices = [], texCoords = [];

    // Texture coordinates are vec2 + a homogeneous coordinate, so they can be
    // transformed as well
    var texCorners = [
        vec3(0, 0, 1.0),
        vec3(0, zoom, 1.0),
        vec3(zoom, zoom, 1.0),
        vec3(zoom, 0, 1.0)
    ];
    var corners = [
        vec4(0, 0, 1),
        vec4(0, 1, 1),
        vec4(1, 1, 1),
        vec4(1, 0, 1),
        vec4(0, 0, 0),
        vec4(0, 1, 0),
        vec4(1, 1, 0),
        vec4(1, 0, 0)
    ];
    function quad(a, b, c, d) {
        vIdx = [a, b, c, c, d, a];
        tIdx = [1, 0, 3, 3, 2, 1];
        for (var i = 0; i < vIdx.length; i++) {
            vertices.push(corners[vIdx[i]]);
            texCoords.push(texCorners[tIdx[i]]);
        }
    }

    quad(1, 0, 3, 2);
    quad(4, 0, 1, 5);
    quad(6, 2, 3, 7);
    quad(4, 5, 6, 7);
    quad(5, 1, 2, 6);
    quad(0, 4, 7, 3);

    return [vertices, texCoords];
}

/*
Updates the view (camera) matrix. This controls what objects are placed in
front of the view and can potentially be seen.
*/
function updateView(followCamera)
{
    var view = mat4();

    // Setting this to false essentially disables the camera transformation
    // This can be useful for displaying e.g. the HUD
    if (followCamera) {
        view = mult(view, rotate(-cameraY, [1, 0, 0]));
        view = mult(view, rotate(-cameraX, [0, 1, 0]));
        view = mult(view, translate(negate(cameraPosition)));
    }

    setUniform(gl.uniformMatrix4fv, "vView", flatten(view));
}

/*
Updates the projection matrix, which brings visible objects into clip space.
*/
function updateProjection(usePerspective)
{
    var projection;

    // usePerspective determines whether to use perspective projection or
    // orthographic projection
    if (usePerspective) {
        // Convert horizontal field of view to vertical
        var fovy = Math.atan(Math.tan(radians(cameraFov / 2)) / aspect);
        fovy = fovy * 180 / Math.PI * 2;
        projection = perspective(fovy, aspect, 1, 1000);
    }
    else {
        var range = 20;
        projection = ortho(-range*aspect, range*aspect, -range, range, 1, 100);
    }

    setUniform(gl.uniformMatrix4fv, "vProjection", flatten(projection));
}

function render(time)
{
    // Update game state
    world.update(time);

    // Clear screen
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Adjust camera
    if (cameraAttached)
        cameraPosition = cameraAttachedObject.position;

    // Adjust view and projection
    updateView(true);
    updateProjection(true);

    // Draw game objects
    for (var i = 0; i < world.objects.length; i++) {
        var obj = world.objects[i];
        var geo = geometry[obj.type];

        // Switch vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, geo.vertexBuffer);
        setVertexAttribPointer("vPosition", 4);

        // Set model transform
        var model = mat4();
        model = mult(model, translate(obj.position));
        var scaleMatrix = mat4();
        for (var i = 0; i < 3; i++)
            scaleMatrix[i][i] = obj.size[i];
        model = mult(model, scaleMatrix);
        setUniform(gl.uniformMatrix4fv, "vModel", flatten(model));

        gl.drawArrays(gl.TRIANGLES, 0, geo.numVertices);
    }

    // Ask the browser to schedule next frame for us
    requestAnimFrame(render);
}

function handleKey(e)
{
    if (e.keyCode == 37) { // left
        cameraX += 1;
    }
    else if (e.keyCode == 39) { // right
        cameraX += -1;
    }
    else if (e.keyCode == 38) { // up
        cameraPosition[1] += 1;
    }
    else if (e.keyCode == 40) { // down
        cameraPosition[1] += -1;
    }
    else if (e.keyCode == 87) { // w
        cameraPosition[2] += -1;
    }
    else if (e.keyCode == 65) { // a
        cameraPosition[0] += -1;
    }
    else if (e.keyCode == 83) { // s
        cameraPosition[2] += 1;
    }
    else if (e.keyCode == 68) { // d
        cameraPosition[0] += 1;
    }
}

function setUniform(setterFn, key, value)
{
    var loc = gl.getUniformLocation(program, key);
    if (setterFn == gl.uniformMatrix4fv) {
        gl.uniformMatrix4fv(loc, false, value);
    }
    else {
        setterFn.call(gl, loc, value);
    }
}

function setVertexAttribPointer(key, value)
{
    var loc = gl.getAttribLocation(program, key);
    gl.vertexAttribPointer(loc, value, gl.FLOAT, false, 0, 0);
}
