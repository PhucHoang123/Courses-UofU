// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform(positionX, positionY, rotation, scale) {
    // convert degree to radian
    var rad = rotation * Math.PI / 180;

    // sin cos math
    let sin = Math.sin(rad);
    let cos = Math.cos(rad);

    // return the result by Scale x Rotation x Translation
    return Array(scale * cos, scale * sin, 0, 	 	// first column
        scale * -sin, scale * cos, 0,		// second column
        positionX, positionY, 1);			// thrid column
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform(trans1, trans2) {
    let Array = [];

    // multiply 1st row of trans2 with 1st col of trans 1 and increment
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            Array[row + col * 3] =
                trans2[row] * trans1[col * 3] +
                trans2[row + 3] * trans1[col * 3 + 1] +
                trans2[row + 6] * trans1[col * 3 + 2];
        }
    }

    return Array;
}
