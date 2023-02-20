document.addEventListener("DOMContentLoaded", function(event) {
    const outputElement = document.getElementById('output');
    const screen = new Screen(outputElement);

    const cols = screen.cols;
    const rows = screen.rows;
    const lightIntensity = 10;

    const objects = {
        sphere: new Sphere(new Vector3(0, 0,0), 1),
        box: new Box(new Vector3(1, 1, 1))
    };
    let currentObject = objects.sphere

    let t = 0;
    setInterval(function () {
        let symbols = [];
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let uv = new Vector3(i, j);
                uv = Vector3.devide(uv, new Vector3(cols, rows, 0));
                uv = Vector3.multiplyNumber(uv,2);
                uv = Vector3.substractNumber(uv, 1);
                uv.x *= screen.screenRatio * symbolRatio;

                let camera = new Vector3(-3, 0 ,0);
                let ray = new Ray(camera, new Vector3(1, uv.x, uv.y));
                let light = new Vector3( -1, -2 ,  -1 );

                light = Vector3.norm(light);
                ray.origin = rotateY(ray.origin, 0);
                ray.direction = rotateY(ray.direction, 0);
                ray.origin = rotateZ(ray.origin, t * 0.01);
                ray.direction = rotateZ(ray.direction, t * 0.01);

                let p = new Plane(new Vector3(0, 0, -1));

                let color = castRays(ray, light, [p, currentObject]) * lightIntensity;
                symbols[i + j * cols] = colorPixel(color);
            }
        }
        screen.printSymbols(symbols);
        t++;
    }, 100);

    const controls = Array.from(document.getElementsByClassName('control'));

    controls.forEach((control) => {
        control.addEventListener("click", function(event){
            let self = event.target;
            let objectKey = self.getAttribute('id');

            controls.forEach((control) => {
                control.classList.remove('active');
            });

            currentObject = objects[objectKey];
            self.classList.add('active');
        });
    });
});
