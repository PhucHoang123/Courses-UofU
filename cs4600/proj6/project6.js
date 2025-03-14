var raytraceFS = `
struct Ray {
	vec3 pos;
	vec3 dir;
};

struct Material {
	vec3  k_d;	// diffuse coefficient
	vec3  k_s;	// specular coefficient
	float n;	// specular exponent
};

struct Sphere {
	vec3     center;
	float    radius;
	Material mtl;
};

struct Light {
	vec3 position;
	vec3 intensity;
};

struct HitInfo {
	float    t;
	vec3     position;
	vec3     normal;
	Material mtl;
};

uniform Sphere spheres[ NUM_SPHERES ];
uniform Light  lights [ NUM_LIGHTS  ];
uniform samplerCube envMap;
uniform int bounceLimit;

bool IntersectRay( inout HitInfo hit, Ray ray );

// Shades the given point and returns the computed color.
vec3 Shade( Material mtl, vec3 position, vec3 normal, vec3 view )
{
	vec3 color = vec3(0,0,0);
	for ( int i=0; i<NUM_LIGHTS; ++i ) {
		 vec3 lightDir = normalize(lights[i].position - position);

        // Shadow ray
        Ray shadowRay;
        shadowRay.pos = position + normal * 0.001; // Avoid self-intersection
        shadowRay.dir = lightDir;

        HitInfo shadowHit;
        if (!IntersectRay(shadowHit, shadowRay)) {
            // Diffuse component
            float diff = max(dot(normal, lightDir), 0.0);
            color += diff * mtl.k_d * lights[i].intensity;

            // Specular component (Blinn-Phong model)
            vec3 halfDir = normalize(lightDir + view);
            float spec = pow(max(dot(normal, halfDir), 0.0), mtl.n);
            color += spec * mtl.k_s * lights[i].intensity;
        }
	}
	return color;
}

// Intersects the given ray with all spheres in the scene
// and updates the given HitInfo using the information of the sphere
// that first intersects with the ray.
// Returns true if an intersection is found.
bool IntersectRay( inout HitInfo hit, Ray ray )
{
    // Initialize the closest hit distance to a large value
    hit.t = 1e30;
    bool foundHit = false;

    // Normalize the ray direction to ensure consistent calculations
    ray.dir = normalize(ray.dir);

    // Loop through all spheres in the scene
    for (int i = 0; i < NUM_SPHERES; ++i) {
        // Calculate b and c for the quadratic equation
        float b = dot(ray.dir, ray.pos - spheres[i].center); // Project ray direction onto the sphere center
        float c = dot(ray.pos - spheres[i].center, ray.pos - spheres[i].center) 
                  - spheres[i].radius * spheres[i].radius; // Distance from ray origin to sphere surface

        // Compute the discriminant (delta) of the quadratic equation
        float delta = b * b - c;

        // If the discriminant is positive, the ray intersects the sphere
        if (delta > 0.0) {
            // Calculate the nearest intersection distance (t)
            float t = -b - sqrt(delta); // Closest intersection point

            // Check if this intersection is closer than any previously found
            if (t > 0.0001 && t < hit.t) { // Ignore intersections behind the ray origin or farther than the closest
                foundHit = true; // Mark that a hit has been found
                hit.t = t; // Update the closest hit distance

                // Compute the intersection position
                hit.position = ray.pos + t * ray.dir;

                // Compute the surface normal at the intersection point
                hit.normal = normalize(hit.position - spheres[i].center);

                // Store the material properties of the sphere
                hit.mtl = spheres[i].mtl;
            }
        }
    }

    // Return whether a hit was found
    return foundHit;
}

// Given a ray, returns the shaded color where the ray intersects a sphere.
// If the ray does not hit a sphere, returns the environment color.
vec4 RayTracer(Ray ray) {
    HitInfo hit;
    if (IntersectRay(hit, ray)) {
        vec3 view = normalize(-ray.dir);
        vec3 clr = Shade(hit.mtl, hit.position, hit.normal, view);

        // Compute reflections
        vec3 k_s = hit.mtl.k_s;
        for (int bounce = 0; bounce < MAX_BOUNCES; ++bounce) {
            if (bounce >= bounceLimit) break;
            if (k_s.r + k_s.g + k_s.b <= 0.0) break;

            // Initialize the reflection ray
            Ray r;
            r.dir = reflect(ray.dir, hit.normal); // Reflect ray direction
            r.pos = hit.position + r.dir * 0.001; // Offset to avoid self-intersection

            HitInfo h; // Reflection hit info
            if (IntersectRay(h, r)) {
                // Shade the hit point for the reflection
                vec3 reflectionColor = Shade(h.mtl, h.position, h.normal, normalize(-r.dir));
                clr += k_s * reflectionColor;

                // Update loop variables for next reflection
                k_s *= h.mtl.k_s; // Attenuate reflection coefficient
                ray = r;           // Continue tracing the reflected ray
                hit = h;           // Update hit information
            } else {
                // Reflection ray does not intersect anything, use the environment color
                clr += k_s * textureCube(envMap, r.dir.xzy).rgb;
                break; // No more reflections
            }
        }
		// Return the accumulated color, including reflections
        return vec4(clr, 1); 
    } else {
        // Return the environment color with full alpha
        return vec4(textureCube(envMap, ray.dir.xzy).rgb, 1.0);
    }
}
`;