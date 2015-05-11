// Global webgl references
var gl;
var program;

// Bookkeeping and presets
var aspect = 1.0;
var objects = {};

// State variables
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

    // Create game objects
    initObjects();

    // Enable shader attributes
    var positionLocation = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(positionLocation);

    // Other set up
    aspect = canvas.width / canvas.height;
    addEventListener("keydown", handleKey);

    // First frame
    requestAnimFrame(render);
}

function initObjects()
{
    var obj, geometry;

    obj = objects["test"] = {};
    obj.numVertices = 3;
    obj.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
    geometry = [vec4(0,1,0,1),
                vec4(0,0,0,1),
                vec4(1,0,0,1)];
    gl.bufferData(gl.ARRAY_BUFFER, flatten(geometry), gl.STATIC_DRAW);
    obj.size = 3.0;
    obj.position = [0.0, 0.0, -1.0];
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

function render(duration)
{
    // Update game state
    tick(duration);

    // Clear screen
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Adjust camera
    if (cameraAttached)
        cameraPosition = cameraAttachedObject.position;

    // Adjust view and projection
    updateView(true);
    updateProjection(true);

    // Draw game objects
    for (var key in objects) {
        if (!objects.hasOwnProperty(key)) continue;
        var obj = objects[key];

        // Switch vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
        setVertexAttribPointer("vPosition", 4);

        // Set model transform
        var model = mat4();
        model = mult(model, translate(obj.position));
        var scaleMatrix = mat4();
        for (var i = 0; i < 3; i++)
            scaleMatrix[i][i] = obj.size;
        model = mult(model, scaleMatrix);
        setUniform(gl.uniformMatrix4fv, "vModel", flatten(model));

        gl.drawArrays(gl.TRIANGLES, 0, obj.numVertices);
    }

    // Ask the browser to schedule next frame for us
    requestAnimFrame(render);
}

function tick(duration)
{
    for (var key in objects) {
        if (!objects.hasOwnProperty(key)) continue;
        var obj = objects[key];

        // noop
    }
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
