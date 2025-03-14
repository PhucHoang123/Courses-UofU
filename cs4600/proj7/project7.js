// This function takes the translation and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// You can use the MatrixMult function defined in project5.html to multiply two 4x4 matrices in the same format.
function GetModelViewMatrix( translationX, translationY, translationZ, rotationX, rotationY )
{
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

	// Combine the rotation matrices
	var rotationMatrix = MatrixMult(rotY, rotX);

	// Combine the translation matrix with the rotation matrix (trans * rotationMatrix)
	var mv = MatrixMult(trans, rotationMatrix);

	return mv;
}


// [TO-DO] Complete the implementation of the following class.

class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor() {
		// Vertex shader 
		var meshVS = `
		precision highp float;
		attribute vec3 pos;
		attribute vec3 normal;
		attribute vec2 texCoord;
		uniform mat4 mvp;           // Model-View-Projection matrix
		uniform mat4 mv;            // Model-View matrix
		uniform mat3 normalMatrix;  // Normal transformation matrix
		uniform vec3 axisSwap;      // Controls Y-Z axis swap
		varying vec3 vNormal;       // Interpolated normal for the fragment shader
		varying vec3 vPosition;     // Camera-space position for the fragment shader
		varying vec2 vTexCoord;     // Texture coordinates for the fragment shader

		void main() {
		    // Apply axis swap to the position
		    vec3 position = vec3(pos.x, pos.y * axisSwap.y + pos.z * axisSwap.z, pos.y * axisSwap.z + pos.z * axisSwap.y);

		    // Apply axis swap to the normal
		    vec3 swappedNormal = vec3(
		        normal.x,
		        normal.y * axisSwap.y + normal.z * axisSwap.z,
		        normal.y * axisSwap.z + normal.z * axisSwap.y
		    );

		    // Transform swapped normal to camera space
		    vNormal = normalize(normalMatrix * swappedNormal);

		    // Compute position in camera space
		    vPosition = vec3(mv * vec4(position, 1.0));

		    // Transform position to clip space
		    gl_Position = mvp * vec4(position, 1.0);

		    // Pass texture coordinates to the fragment shader
		    vTexCoord = texCoord;
			}
        `;

		// Fragment shader 
		var meshFS = `
			precision highp float;
			uniform vec3 lightDir;      // Light direction in world space
			uniform mat4 mv;            // Model-View matrix
			uniform float shininess;    // Shininess factor for specular reflection
			uniform vec3 kd;            // Diffuse color coefficient
			uniform vec3 ks;            // Specular color coefficient
			uniform bool useTexture;    // Texture toggle
			uniform sampler2D texture;  // Texture sampler
			varying vec3 vNormal;       // Normal in camera space
			varying vec3 vPosition;     // Position in camera space
			varying vec2 vTexCoord;     // Texture coordinates

			void main() {
			    // Transform light direction to camera space
			    vec3 light = normalize((mv * vec4(lightDir, 0.0)).xyz);

			    // Normalize the interpolated normal
			    vec3 norm = normalize(vNormal);

			    // Compute view direction
			    vec3 viewDir = normalize(-vPosition);

			    // Compute Blinn-Phong lighting components
			    vec3 halfDir = normalize(light + viewDir);
			    float diff = max(dot(norm, light), 0.0);  // Diffuse reflection
			    float spec = pow(max(dot(norm, halfDir), 0.0), shininess);  // Specular reflection

			    // Combine diffuse and specular lighting
			    vec3 color = kd * diff + ks * spec;

			    // Apply texture if enabled
			    if (useTexture) {
			        color *= texture2D(texture, vTexCoord).rgb;
			    }

			    // Output final color
			    gl_FragColor = vec4(color, 1.0);
			}
        `;

		// Compile shader
		this.prog = InitShaderProgram(meshVS, meshFS);

		// Get attribute and uniform locations
		this.mvp = gl.getUniformLocation(this.prog, "mvp");
		this.mv = gl.getUniformLocation(this.prog, "mv");
		this.normalMatrix = gl.getUniformLocation(this.prog, "normalMatrix");
		this.vertPos = gl.getAttribLocation(this.prog, "pos");
		this.normalAttr = gl.getAttribLocation(this.prog, "normal");
		this.texCoord = gl.getAttribLocation(this.prog, "texCoord");
		this.lightDir = gl.getUniformLocation(this.prog, "lightDir");
		this.shininess = gl.getUniformLocation(this.prog, "shininess");
		this.kd = gl.getUniformLocation(this.prog, "kd");
		this.ks = gl.getUniformLocation(this.prog, "ks");
		this.useTexture = gl.getUniformLocation(this.prog, "useTexture");
		this.axisSwap = gl.getUniformLocation(this.prog, "axisSwap");

		// Initialize buffers
		this.vertexBuffer = gl.createBuffer();
		this.normalBuffer = gl.createBuffer();
		this.texCoordBuffer = gl.createBuffer();
		this.numTriangles = 0;

		// Initialize texture
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		// No swap by default
		gl.useProgram(this.prog);
		gl.uniform3f(this.axisSwap, 1.0, 1.0, 0.0);
	}

	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions,
	// an array of 2D texture coordinates, and an array of vertex normals.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex and every three consecutive 
	// elements in the normals array form a vertex normal.
	// Note that this method can be called multiple times.
	setMesh(vertPos, texCoords, normals) {
		this.numTriangles = vertPos.length / 3;

		// Bind and upload vertex positions
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

		// Bind and upload texture coordinates
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

		// Bind and upload vertex normals
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

		// No swap by default
		gl.useProgram(this.prog);
		gl.uniform3f(this.kd, 1.0, 1.0, 1.0);
		gl.uniform3f(this.ks, 1.0, 1.0, 1.0);
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
	// The arguments are the model-view-projection transformation matrixMVP,
	// the model-view transformation matrixMV, the same matrix returned
	// by the GetModelViewProjection function above, and the normal
	// transformation matrix, which is the inverse-transpose of matrixMV.
	draw(matrixMVP, matrixMV, matrixNormal) {
		gl.useProgram(this.prog);

		// Set uniform matrices
		gl.uniformMatrix4fv(this.mvp, false, new Float32Array(matrixMVP));
		gl.uniformMatrix4fv(this.mv, false, new Float32Array(matrixMV));
		gl.uniformMatrix3fv(this.normalMatrix, false, new Float32Array(matrixNormal));

		// Bind vertex buffer and enable attribute
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.vertPos);

		// Bind normal buffer and enable attribute
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.vertexAttribPointer(this.normalAttr, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.normalAttr);

		// Bind texture coordinate buffer and enable attribute
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
		gl.vertexAttribPointer(this.texCoord, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.texCoord);

		// Draw the mesh using triangles
		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
	}

	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture(img) {
		gl.useProgram(this.prog);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
		this.showTexture(true);
	}

	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture(show) {
		gl.useProgram(this.prog);
		// Condition for checkbox
		gl.uniform1i(this.useTexture, show ? 1 : 0);
	}

	// This method is called to set the incoming light direction.
	setLightDir(x, y, z) {
		// Set the uniform parameter(s) of the fragment shader to specify the light direction.
		gl.useProgram(this.prog);
		gl.uniform3f(this.lightDir, x, y, z);
	}

	// This method is called to set the shininess of the material.
	setShininess(shininess) {
		// Set the uniform parameter(s) of the fragment shader to specify the shininess.
		gl.useProgram(this.prog);
		gl.uniform1f(this.shininess, shininess);
	}
}


// This function is called for every step of the simulation.
// Its job is to advance the simulation for the given time step duration dt.
// It updates the given positions and velocities.
function SimTimeStep(dt, positions, velocities, springs, stiffness, damping, particleMass, gravity, restitution) {
    // Initialize forces to zero for each particle
    let forces = positions.map(() => new Vec3(0, 0, 0));

    // Compute forces from springs and damping
    for (const spring of springs) {
        let p0 = spring.p0, p1 = spring.p1;
        let x0 = positions[p0], x1 = positions[p1];
        let v0 = velocities[p0], v1 = velocities[p1];

        // Spring properties
        let deltaPos = x1.sub(x0);
        let length = deltaPos.len();
        let direction = deltaPos.div(length);
        let springForce = direction.mul(stiffness * (length - spring.rest));

        // Damping force
        let relativeVelocity = v1.sub(v0).dot(direction);
        let dampingForce = direction.mul(relativeVelocity * damping);

        // Accumulate forces
        forces[p0] = forces[p0].add(springForce).add(dampingForce);
        forces[p1] = forces[p1].sub(springForce).sub(dampingForce);
    }

    // Update positions and velocities
    for (let i = 0; i < positions.length; i++) {
        let acceleration = forces[i].div(particleMass).add(gravity);
        velocities[i] = velocities[i].add(acceleration.mul(dt));
        positions[i] = positions[i].add(velocities[i].mul(dt));
    }

    // Handle collisions with boundaries
    const floor = new Vec3(-1.0, -1.0, -1.0);
    const ceiling = new Vec3(1.0, 1.0, 1.0);

    for (let i = 0; i < positions.length; i++) {
        let pos = positions[i];
        let vel = velocities[i];

        // Check collisions for all axes
        ['x', 'y', 'z'].forEach(axis => {
            if (pos[axis] < floor[axis]) {
                let penetration = floor[axis] - pos[axis];
                pos[axis] += penetration * (1 + restitution);
                vel[axis] *= -restitution;
            } else if (pos[axis] > ceiling[axis]) {
                let penetration = pos[axis] - ceiling[axis];
                pos[axis] -= penetration * (1 + restitution);
                vel[axis] *= -restitution;
            }
        });
    }
}


