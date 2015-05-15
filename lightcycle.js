// Global webgl references
var gl;
var program;

// State variables
var world;
var geometry;
var aspect = 1.0;
var cameraPosition = [1, 10, 20];
var cameraX = -12;
var cameraY = 0;
var cameraFov = 50;
var arenaDimX = 1000;
var arenaDimZ = 1000;
var ufoDir = 0;
var ufoSpd = 100.0;

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

    // Create the geometry used in World objects
    initializeGeometry();

    // Other set up
    addEventListener("keydown", handleKey);
    setUniform(gl.uniform1i, "texture", 0);
    
    // First frame
    requestAnimFrame(render);
}

var World = function()
{
    this.currentTime = 0;
    this.elapsed = 0;
    this.arena = [arenaDimX, arenaDimZ];
    this.objects = [];

    var ufotable = {};
    ufotable.type = "ufo";
    ufotable.position = [0.0, 0.0, 5.0];
    ufotable.size = [1.0, 1.0, 1.0];
    this.objects.push(ufotable);

    this.player = ufotable;
}

World.prototype.update = function(time)
{
    time /= 1000.0;
    this.elapsed = time - this.currentTime;
    this.currentTime = time;

    for (var i = 0; i < this.objects.length; i++) {
        var obj = this.objects[i];
        if (obj.type == "ufo")
        {
            if (ufoDir == 0)
            {
                obj.position[0] += this.elapsed * ufoSpd;
                if (obj.position[0] > arenaDimX - obj.size[0])
                {
                    obj.position[0] = arenaDimX - obj.size[0];
                }
            }
            else if (ufoDir == 1)
            {
                obj.position[2] += this.elapsed * ufoSpd;
                if (obj.position[2] > arenaDimZ - obj.size[2])
                {
                    obj.position[2] = arenaDimZ - obj.size[2];
                }
            }
            else if (ufoDir == 2)
            {
                obj.position[0] -= this.elapsed * ufoSpd;
                if (obj.position[0] < 0.0)
                {
                    obj.position[0] = 0;
                }
            }
            else
            {
                obj.position[2] -= this.elapsed * ufoSpd;
                if (obj.position[2] < 0.0)
                {
                    obj.position[2] = 0;
                }
            }
            
        }
    }
}

function initializeGeometry()
{
    var geo, shape, image;

    geometry = {};

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
    geo.textureMinFilter = gl.LINEAR_MIPMAP_LINEAR;
    geo.textureMagFilter = gl.LINEAR;

    geo = geometry.ufo = {};
    shape = makeCube(1);
    geo.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, geo.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.vertices), gl.STATIC_DRAW);
    geo.numVertices = shape.vertices.length;
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
        var nextAngle = 270 - ufoDir * 90;
        var diff = angleDiff(cameraY, nextAngle);
        var rotateSpd = diff * 8 + (diff >= 0 ? 10 : -10);
        var rotateAmt = rotateSpd * world.elapsed;
        if (Math.abs(diff) < Math.abs(rotateAmt))
            cameraY = nextAngle;
        else
            cameraY += rotateAmt;
        cameraY = normalizeAngle(cameraY);

        // Adjust position
        cameraPosition = p.position.slice();
        for (var i = 0; i < p.size.length; i++)
            cameraPosition[i] += p.size[i] / 2;
        var offset = transform(rotate(cameraY, [0, 1, 0]), vec4(0, 5, 17));
        cameraPosition = add(cameraPosition, offset.slice(0,3));
    }

    // Adjust view
    var view = mat4();
    view = mult(view, rotate(-cameraX, [1, 0, 0]));
    view = mult(view, rotate(-cameraY, [0, 1, 0]));
    view = mult(view, translate(negate(cameraPosition)));
    setUniform(gl.uniformMatrix4fv, "vView", flatten(view));

    // Adjust projection
    var fovy = Math.atan(Math.tan(radians(cameraFov / 2)) / aspect);
    fovy = degrees(fovy) * 2;
    projection = perspective(fovy, aspect, 1, 5000);
    setUniform(gl.uniformMatrix4fv, "vProjection", flatten(projection));

    // Other misc settings
    toggleAttrib("vPosition", true);

    // Draw game arena
    {
        var geo = geometry.arena;

        // Switch vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, geo.vertexBuffer);
        setAttrib("vPosition", 4);

        // Turn on textures
        toggleAttrib("vTexCoord", true);
        setUniform(gl.uniform1i, "useTexture", true);

        // Switch texCoord buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, geo.texCoordBuffer);
        setAttrib("vTexCoord", 2);

        // Configure texture settings
        gl.bindTexture(gl.TEXTURE_2D, geo.texture);
        var ext = (
            gl.getExtension('EXT_texture_filter_anisotropic') ||
            gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
            gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
        );
        if (ext){
            var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
        }

        // Set model transform
        var model, scaleMatrix;
        model = mat4();
        model = mult(model, scale(world.arena[0], 1000, world.arena[1]));
        setUniform(gl.uniformMatrix4fv, "vModel", flatten(model));

        gl.drawArrays(gl.TRIANGLES, 0, geo.numVertices);
    }

    // Draw game objects
    for (var i = 0; i < world.objects.length; i++) {
        var obj = world.objects[i];
        var geo = geometry[obj.type];

        // Switch vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, geo.vertexBuffer);
        setAttrib("vPosition", 4);

        // Set model transform
        var model = mat4();
        model = mult(model, translate(obj.position));
        model = mult(model, scale(obj.size));
        setUniform(gl.uniformMatrix4fv, "vModel", flatten(model));

        if (geo.texture) {
            toggleAttrib("vTexCoord", true);
            setUniform(gl.uniform1i, "useTexture", true);

            // Switch texCoord buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, geo.texCoordBuffer);
            setAttrib("vTexCoord", 2);

            // Configure texture settings
            gl.bindTexture(gl.TEXTURE_2D, geo.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                geo.textureMinFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
                geo.textureMagFilter);
        }
        else {
            toggleAttrib("vTexCoord", false);
            setUniform(gl.uniform1i, "useTexture", false);
        }

        gl.drawArrays(gl.TRIANGLES, 0, geo.numVertices);
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
    else if (e.keyCode == 74) { // j
        ufoDir = (ufoDir + 3) % 4;
    }
    else if (e.keyCode == 75) { // k
        ufoDir = (ufoDir + 1) % 4;
    }
    else if (e.keyCode == 80) { // p
        console.log(cameraPosition);
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
