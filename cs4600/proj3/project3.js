class CurveDrawer {
	constructor() {
		this.prog = InitShaderProgram(curvesVS, curvesFS);

		// Get the locations of attributes and uniform variables.
		this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp');
		this.p0Loc = gl.getUniformLocation(this.prog, 'p0');
		this.p1Loc = gl.getUniformLocation(this.prog, 'p1');
		this.p2Loc = gl.getUniformLocation(this.prog, 'p2');
		this.p3Loc = gl.getUniformLocation(this.prog, 'p3');
		this.tLoc = gl.getAttribLocation(this.prog, 't');

		// Initialize the attribute buffer
		this.steps = 100;
		var tv = [];
		for (var i = 0; i < this.steps; ++i) {
			tv.push(i / (this.steps - 1));
		}

		// Create a vertex buffer object and bind the t values
		this.tBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tv), gl.STATIC_DRAW);
	}
	setViewport(width, height) {
		// Bind program
		gl.useProgram(this.prog);

		// Set the viewport transformation matrix
		let mvp = [
			2 / width, 0, 0, 0,
			0, -2 / height, 0, 0,
			0, 0, 1, 0,
			-1, 1, 0, 1
		];

		gl.uniformMatrix4fv(this.mvpLoc, false, mvp);
	}
	updatePoints(pt) {
		// Bind program
		gl.useProgram(this.prog);

		// Update the control points uniform variables
		var p0 = [parseFloat(pt[0].getAttribute("cx")), parseFloat(pt[0].getAttribute("cy"))];
		var p1 = [parseFloat(pt[1].getAttribute("cx")), parseFloat(pt[1].getAttribute("cy"))];
		var p2 = [parseFloat(pt[2].getAttribute("cx")), parseFloat(pt[2].getAttribute("cy"))];
		var p3 = [parseFloat(pt[3].getAttribute("cx")), parseFloat(pt[3].getAttribute("cy"))];

		gl.uniform2fv(this.p0Loc, p0);
		gl.uniform2fv(this.p1Loc, p1);
		gl.uniform2fv(this.p2Loc, p2);
		gl.uniform2fv(this.p3Loc, p3);
	}
	draw() {
		// Bind program
		gl.useProgram(this.prog);

		// Bind the vertex attribute buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.enableVertexAttribArray(this.tLoc);
		gl.vertexAttribPointer(this.tLoc, 1, gl.FLOAT, false, 0, 0);

		// Draw the curve as a line strip
		gl.drawArrays(gl.LINE_STRIP, 0, this.steps);
	}
}

// Vertex Shader
var curvesVS = `
	attribute float t;
	uniform mat4 mvp;
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;
	void main()
	{
		// Bézier cubic curve formula
		vec2 pos = (1.0 - t) * (1.0 - t) * (1.0 - t) * p0 +
				   3.0 * (1.0 - t) * (1.0 - t) * t * p1 +
				   3.0 * (1.0 - t) * t * t * p2 +
				   t * t * t * p3;

		// Apply the model-view-projection matrix
		gl_Position = mvp * vec4(pos, 0.0, 1.0);
	}
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(1,0,0,1);
	}
`;