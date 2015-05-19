// ------------- utilities --------------

// For backwards compatibility
if(!Object.create)
{
    Object.create=function(o){
        function F(){}
        F.prototype=o;
        return new F();
    }
}


// ------------- geometry -------------

// Converts radians to degrees
function degrees(r)
{
    return r * 180.0 / Math.PI;
}

// Applies mat to vec
function transform(mat, vec)
{
    var res = [];
    for (var i = 0; i < mat.length; i++) {
        var sum = 0.0;
        for (var j = 0; j < vec.length; j++)
            sum += mat[i][j] * vec[j];
        res.push(sum);
    }
    return res;
}

// Bounds the angle to [0, 360) degrees
function normalizeAngle(a)
{
    a %= 360;
    if (a < 0)
        a += 360;
    return a;
}

// Finds the difference from angle a to angle b
// The difference is between -180 and 180 degrees, denoting the smallest amount
// to increment 'a' by to get to 'b'.
function angleDiff(a, b)
{
    a = normalizeAngle(a);
    b = normalizeAngle(b);
    var diff = b - a;
    if (diff >= 0 && diff < 180) return diff;
    if (diff >= 180) return diff - 360;
    if (diff < 0 && diff > -180) return diff;
    return diff + 360;
}

// Creates a quad geometry (two triangles)
// The optional zoom parameter allows zooming of texture
// Returns an object with attributes:
//   - vertices: vertex coordinates
//   - texCoords: texture coordinates
//   - normals: normal vectors for each vertex
function makeQuad(zoom)
{
    if (typeof(zoom) == 'undefined')
        zoom = 1;

    var r = {"vertices": [],
             "texCoords": [],
             "normals": []};

    var texCorners = [
        vec2(0, 0),
        vec2(0, zoom),
        vec2(zoom, zoom),
        vec2(zoom, 0)
    ];
    var corners = [
        vec4(0, 0, 0),
        vec4(1, 0, 0),
        vec4(1, 0, 1),
        vec4(0, 0, 1),
    ];
    idx = [1, 0, 3, 3, 2, 1];
    var n = normal(corners[idx[0]], corners[idx[1]], corners[idx[2]]);
    for (var i = 0; i < idx.length; i++) {
        r.vertices.push(corners[idx[i]]);
        r.texCoords.push(texCorners[idx[i]]);
        r.normals.push(vec4(n));
    }

    return r;
}

// Creates a cube geometry (six quads)
// The optional zoom parameter allows zooming of texture
// Returns an object with attributes:
//   - vertices: vertex coordinates
//   - texCoords: texture coordinates
//   - normals: normal vectors for each vertex
function makeCube(zoom)
{
    if (typeof(zoom) == 'undefined')
        zoom = 1;

    var r = {"vertices": [],
             "texCoords": [],
             "normals": []};

    var transforms = [
        mult(translate(1, 0, 0), rotate(180, [0, 0, 1])),
        rotate(-90, [1, 0, 0]),
        mult(translate(0, 1, 1), rotate(90, [1, 0, 0])),
        mult(translate(1, 1, 0), rotate(-90, [0, 0, 1])),
        rotate(90, [0, 0, 1]),
        translate(0, 1, 0),
    ];
    for (var i = 0; i < transforms.length; i++) {
        var q = makeQuad(zoom);
        q.vertices = transformVectors(transforms[i], q.vertices);
        q.normals = transformVectors(transforms[i], q.normals);
        for (var j = 0; j < q.vertices.length; j++) r.vertices.push(q.vertices[j]);
        for (var j = 0; j < q.normals.length; j++) r.normals.push(q.normals[j]);
        for (var j = 0; j < q.texCoords.length; j++) r.texCoords.push(q.texCoords[j]);
    }

    return r;
}

// Computes the normal of a triangle primitive
function normal(a, b, c)
{
    var v = subtract(b, a);
    var u = subtract(c, a);
    return normalize(cross(v, u));
}

// Scales the components of vector v by s
function stretch(s, v)
{
    for (var i = 0; i < v.length; i++)
        v[i] = s * v[i];
}

// Finds the angle between two vectors on the XZ plane
// Rotating v by this angle with the Y axis should yield u
function angleBetweenY(v, u)
{
    var dotp = dot(v, u);
    var crossp = cross(v, u);
    return degrees(Math.atan2(crossp[1], dotp));
}

// Applies mat to all vertices in arr
function transformVectors(mat, arr)
{
    res = []
    for (var i = 0; i < arr.length; i++)
        res.push(transform(mat, arr[i]))
    return res;
}
