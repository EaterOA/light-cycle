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

// Creates a cube geometry
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

    var texCorners = [
        vec2(0, 0),
        vec2(0, zoom),
        vec2(zoom, zoom),
        vec2(zoom, 0)
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
        var vIdx = [a, b, c, c, d, a];
        var tIdx = [1, 0, 3, 3, 2, 1];
        var n = normal(corners[vIdx[0]], corners[vIdx[1]], corners[vIdx[2]]);
        for (var i = 0; i < vIdx.length; i++) {
            r.vertices.push(corners[vIdx[i]]);
            r.texCoords.push(texCorners[tIdx[i]]);
            r.normals.push(vec4(n));
        }
    }

    quad(1, 0, 3, 2);
    quad(4, 0, 1, 5);
    quad(6, 2, 3, 7);
    quad(4, 5, 6, 7);
    quad(5, 1, 2, 6);
    quad(0, 4, 7, 3);

    return r;
}

// Computes the normal of a triangle primitive
function normal(a, b, c)
{
    var v = subtract(b, a);
    var u = subtract(c, a);
    return normalize(cross(v, u));
}
