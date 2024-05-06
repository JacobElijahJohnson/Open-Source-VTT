let BABYLON = require('babylonjs');
let VIEWER = require('babylonjs-viewer');


document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById("render-canvas");
    const engine = new BABYLON.Engine(canvas, true);

    function createScene(){
        const scene = new BABYLON.Scene(engine);
        let container = new BABYLON.AssetContainer(scene);

        let camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
        camera.inputs.attached.pointers.buttons = [1, 2];
        camera.attachControl(canvas, true);


        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
        container.lights.push(light);

        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);
        ground.isPickable = true;
        container.meshes.push(ground);

        const createRectangle = function(event){
            if(event.button != 0){
                return;
            }
            let ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
            const hit = scene.pickWithRay(ray);
            console.log(hit.pickedPoint)
            if(hit.hit){
                const rectangle =  BABYLON.MeshBuilder.CreateBox("box", {height: 1, width: 0.75, depth: 0.25});
                rectangle.position = hit.pickedPoint;
                rectangle.position._y += 0.5;
                container.meshes.push(rectangle);
                console.log(rectangle.position)
            }
        }

        canvas.addEventListener("pointerdown", createRectangle, false);

        require('electron').ipcRenderer.on('save', function(){
            const serializedScene = BABYLON.SceneSerializer.Serialize(scene);
            const strScene = JSON.stringify(serializedScene);
            require('electron').ipcRenderer.send('saveFile', strScene);
        })

        require('electron').ipcRenderer.on('load', async (event, fileName) => {
            container.removeAllFromScene();
            const assetArrayBuffer = await BABYLON.Tools.LoadFileAsync(fileName, true);
            const assetBlob = new Blob([assetArrayBuffer]);
            const assetUrl = URL.createObjectURL(assetBlob);
            
            await BABYLON.SceneLoader.AppendAsync(assetUrl, undefined, scene, undefined, ".babylon");
            scene.createDefaultLight(true);


        })
        
        return scene;
    }

    const scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });
  });



