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



