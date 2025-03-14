// This function takes the projection matrix, the translation, and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// The given projection matrix is also a 4x4 matrix stored as an array in column-major order.
// You can use the MatrixMult function defined in project4.html to multiply two 4x4 matrices in the same format.
function GetModelViewProjection(projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY) {
	// Rotation around X-axis
	var cosX = Math.cos(rotationX);
	var sinX = Math.sin(rotationX);
	var rotX = [
		1, 0, 0, 0,
		0, cosX, sinX, 0,
		0, -sinX, cosX, 0,
		0, 0, 0, 1
	];

	// Rotation around Y-axis
	var cosY = Math.cos(rotationY);
	var sinY = Math.sin(rotationY);
	var rotY = [
		cosY, 0, -sinY, 0,
		0, 1, 0, 0,
		sinY, 0, cosY, 0,
		0, 0, 0, 1
	];

	// Translation matrix
	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];

	// RotationMatrix = rotY * rotX
	var rotationMatrix = MatrixMult(rotY, rotX);

	// ModelMatrix = trans * rotationMatrix
	var modelMatrix = MatrixMult(trans, rotationMatrix);
	var mvp = MatrixMult(projectionMatrix, modelMatrix);
	return mvp;
}


class MeshDrawer {
	// The constructor is a good place for taking care of the necessary initializations.
	constructor() {
		// Vertex shader
		var meshVS = `
            attribute vec3 pos;
			uniform vec3 axisSwap;
            attribute vec2 texCoord;
            uniform mat4 mvp;
            varying vec2 vTexCoord;

            void main() {
                vec3 position = vec3(pos.x, pos.y * axisSwap.y + pos.z * axisSwap.z, pos.y * axisSwap.z + pos.z * axisSwap.y);
    			gl_Position = mvp * vec4(position, 1.0);
    			vTexCoord = texCoord;
            }
        `;

		// Fragment shader
		var meshFS = `
            precision mediump float;
            uniform sampler2D texture;
            uniform bool useTexture;
            varying vec2 vTexCoord;

            void main() {
                if (useTexture) {
                    // Use the texture checked
                    gl_FragColor = texture2D(texture, vTexCoord);
                } else {
                    // Provided code from requirement
                    gl_FragColor = vec4(1,gl_FragCoord.z*gl_FragCoord.z,0,1);
                }
            }
        `;

		// Compile the shader program
		this.prog = InitShaderProgram(meshVS, meshFS);

		// Get attribute and uniform locations
		this.mvp = gl.getUniformLocation(this.prog, "mvp");
		this.vertPos = gl.getAttribLocation(this.prog, "pos");
		this.texCoord = gl.getAttribLocation(this.prog, "texCoord");
		this.useTexture = gl.getUniformLocation(this.prog, "useTexture");
		this.axisSwap = gl.getUniformLocation(this.prog, "axisSwap");

		// Initialize buffers
		this.vertexBuffer = gl.createBuffer();
		this.texCoordBuffer = gl.createBuffer();
		this.numTriangles = 0;

		// Initialize texture
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	}

	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions
	// and an array of 2D texture coordinates.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex.
	// Note that this method can be called multiple times.
	setMesh(vertPos, texCoords) {
		this.numTriangles = vertPos.length / 3;

		// Bind and upload vertex positions
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

		// Bind and upload texture coordinates
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

		// No swap by default
		gl.useProgram(this.prog);
		gl.uniform3f(this.axisSwap, 1.0, 1.0, 0.0);
	}

	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ(swap) {
		gl.useProgram(this.prog);
		if (swap) {
			gl.uniform3f(this.axisSwap, 1.0, 0.0, 1.0);  // Swap Y and Z
		} else {
			gl.uniform3f(this.axisSwap, 1.0, 1.0, 0.0);  // Return to normal
		}
	}

	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw(trans) {
		gl.useProgram(this.prog);

		// Set the transformation matrix uniform
		gl.uniformMatrix4fv(this.mvp, false, new Float32Array(trans));

		// Bind the vertex buffer and set the position attribute
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.vertPos);

		// Bind the texture coordinate buffer and set the texCoord attribute
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
		gl.vertexAttribPointer(this.texCoord, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.texCoord);

		// Draw the mesh using triangles
		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
	}

	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture(img) {
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
		this.showTexture(true);
	}

	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture(show) {
		gl.useProgram(this.prog);
		gl.uniform1i(this.useTexture, show ? 1 : 0);
	}
}
