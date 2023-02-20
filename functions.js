/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

/**
 * @param {Ray} ray
 * @param {Vector3} light
 * @param {Array} objects
 */
function castRays(ray, light, objects) {
    let minIt = 99999;
    let n = new Vector3();

    objects.forEach((object) => {
        let intersection = object.intersection(ray);

        if (intersection.intersection > 0 && intersection.intersection < minIt) {
            minIt = intersection.intersection;
            n = intersection.normal;
        }
    });

    let diffuse = Math.max(0, Vector3.dot(n, light));
    let reflected = Vector3.substract(ray.direction, Vector3.multiplyNumber(n, (2 * Vector3.dot(n, ray.direction))));
    let specular = Math.max(0, Vector3.dot(reflected, light));
    diffuse *= specular;

    return diffuse;
}

/**
 * @param {number} diff
 * @returns {string}
 */
function colorPixel(diff) {
    const gradient = ["\u{2007}", ".", ":", "!", "/", "r", "(", "l", '1', "Z", '4', "H", "9", "W", "8", "$", "@"];
    const grLength = gradient.length - 1;

    let color = Math.floor(clamp(diff, 0, grLength));
    return gradient[color];
}

/**
 * @param {Vector3} a
 * @param {number} angle
 * @returns {Vector3}
 */
function rotateY(a, angle)
{
    let b = a;
    b.x = a.x * Math.cos(angle) - a.z * Math.sin(angle);
    b.z = a.x * Math.sin(angle) + a.z * Math.cos(angle);
    return b;
}

/**
 * @param {Vector3} a
 * @param {number} angle
 * @returns {Vector3}
 */
function rotateZ(a, angle)
{
    return new Vector3(
        a.x * Math.cos(angle) - a.y * Math.sin(angle),
        a.x * Math.sin(angle) + a.y * Math.cos(angle),
           a.z
    );
}