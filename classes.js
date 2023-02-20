/** character width to height ratio for a monospaced font */
const symbolRatio = 663/1100;

class Screen {
    constructor(element) {
        this.origin = element;
        this.height = element.scrollHeight;
        this.width = element.scrollWidth;
        this.symbolHeight = parseInt(window.getComputedStyle(element).fontSize);
        this.symbolWidth = this.symbolHeight * symbolRatio;
    }

    /**
     * @returns {number}
     */
    get cols() {
        return Math.floor(this.width / this.symbolWidth);
    }

    /**
     * @returns {number}
     */
    get rows() {
        return Math.floor(this.height / this.symbolHeight);
    }

    /**
     * @returns {number}
     */
    get screenRatio() {
        return this.cols / this.rows;
    }

    /**
     * @param {Array} symbols
     */
    printSymbols(symbols) {
        this.origin.value = symbols.join('');
    }
}
class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * @param {Vector3} vector
     * @param {Vector3} other
     * @returns {Vector3}
     */
    static sum(vector, other) {
        return new Vector3(
            vector.x + other.x,
            vector.y + other.y,
            vector.z + other.z
        );
    }

    /**
     * @param {Vector3} vector
     * @param {Vector3} other
     * @returns {Vector3}
     */
    static devide(vector, other) {
        return new Vector3(
            other.x !== 0 ? vector.x / other.x : 0,
            other.y !== 0 ? vector.y / other.y : 0,
            other.z !== 0 ? vector.z / other.z : 0
        );
    }

    /**
     * @param {Vector3} vector
     * @param {Vector3} other
     * @returns {Vector3}
     */
    static multiply(vector, other) {
        return new Vector3(
            vector.x * other.x,
            vector.y * other.y,
            vector.z * other.z
        );
    }

    /**
     * @param {Vector3} vector
     * @param {Vector3} other
     * @returns {Vector3}
     */
    static substract(vector, other) {
        return new Vector3(
            vector.x - other.x,
            vector.y - other.y,
            vector.z - other.z
        );
    }

    /**
     * @param {Vector3} vector
     * @param {number} value
     * @returns {Vector3}
     */
    static multiplyNumber(vector, value) {
        return new Vector3(
            vector.x * value,
            vector.y * value,
            vector.z * value
        );
    }

    /**
     * @param {Vector3} vector
     * @param {number} value
     * @returns {Vector3}
     */
    static substractNumber(vector, value) {
        return new Vector3(
            vector.x - value,
            vector.y - value,
            vector.z - value
        );
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * @param {Vector3} vector
     * @returns {Vector3}
     */
    static norm(vector) {
        return new Vector3(
            vector.x / vector.length(),
            vector.y / vector.length(),
            vector.z / vector.length()
        );
    }

    /**
     * @param {Vector3} vector
     * @param {Vector3} other
     * @returns {number}
     */
    static dot(vector, other) {
        return vector.x * other.x + vector.y * other.y + vector.z * other.z;
    }

    /**
     * @param {Vector3} edge
     * @param {Vector3} x
     * @returns {Vector3}
     */
    static step(edge, x) {
        return new Vector3(
            x.x > edge.x ? 1 : 0,
            x.y > edge.y ? 1 : 0,
            x.z > edge.z ? 1 : 0
        );
    }

    /**
     * @param {Vector3} vector
     * @returns {Vector3}
     */
    static sign(vector) {
        return new Vector3(
            Math.sign(vector.x),
            Math.sign(vector.y),
            Math.sign(vector.z),
        );
    }

    /**
     * @param {Vector3} vector
     * @returns {Vector3}
     */
    static abs(vector) {
        return new Vector3(
            Math.abs(vector.x),
            Math.abs(vector.y),
            Math.abs(vector.z),
        );
    }
}
class Ray {
    /**
     * @param {Vector3} origin
     * @param {Vector3} direction
     */
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = Vector3.norm(direction);
    }
}
class IntersectionNormal {
    /**
     * @param {number} intersection
     * @param {Vector3} normal
     */
    constructor(intersection, normal = new Vector3()) {
        this.intersection = intersection;
        this.normal = normal;
    }
}
class Sphere {
    /**
     * @param {Vector3} center
     * @param {number} radius
     */
    constructor(center, radius) {
        this.center = center;
        this.radius = radius;
    }

    /**
     *
     * @param {Ray} ray
     * @returns {*}
     */
    intersection(ray) {
        let oc = Vector3.substract(ray.origin, this.center);
        let b = Vector3.dot(oc, ray.direction);
        let c = Vector3.dot(oc, oc) - this.radius * this.radius;
        let h = b * b - c;

        if (h < 0.0) {
            return new IntersectionNormal(-1, this.center);
        }

        h = Math.sqrt(h);
        let t = -b - h;

        return new IntersectionNormal(t, Vector3.sum(ray.origin, Vector3.multiplyNumber(ray.direction, t)));
    }
}
class Plane {
    /**
     * @param {Vector3} p
     */
    constructor(p) {
        this.p = p;
    }

    /**
     * @param {Ray} ray
     */
    intersection(ray) {
        let p = Vector3.norm(this.p);
        let a = -(Vector3.dot(ray.origin, p) + 1.0);
        let b = Vector3.dot(ray.direction, p);

        return new IntersectionNormal(a/b, p);
    }
}
class Box {
    /**
     * @param {Vector3} boxSize
     */
    constructor(boxSize) {
        this.boxSize = boxSize;
    }

    /**
     * @param {Ray} ray
     * @returns {IntersectionNormal}
     */
    intersection(ray) {
        let m = Vector3.devide(new Vector3(1, 1, 1), ray.direction);
        let n = Vector3.multiply(m, ray.origin);
        let k = Vector3.multiply(Vector3.abs(m), this.boxSize);
        let t1 = Vector3.substract(Vector3.multiplyNumber(n, -1), k);
        let t2 = Vector3.sum(Vector3.multiplyNumber(n, -1), k);
        let tN = Math.max(Math.max(t1.x, t1.y), t1.z);
        let tF = Math.min(Math.min(t2.x, t2.y), t2.z);

        if (tN > tF || tF < 0.0) return new IntersectionNormal(-1.0, new Vector3());

        let yzx = new Vector3(t1.y, t1.z, t1.x);
        let zxy = new Vector3(t1.z, t1.x, t1.y);

        let outNormal = Vector3.multiply(Vector3.multiply(Vector3.multiplyNumber(Vector3.sign(ray.direction), -1), Vector3.step(yzx, t1)), Vector3.step(zxy, t1));
        return new IntersectionNormal(tN, outNormal);
    }
}