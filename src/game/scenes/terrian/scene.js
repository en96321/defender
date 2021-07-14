import * as BABYLON from 'babylonjs'

let shadow = null
let camera = null
export default {
  load: function (scene, onSuccess) {
    BABYLON.SceneLoader.Append('', './assets/maps/terrain.babylon', scene, () => {
      scene.executeWhenReady(() => {
        // light
        const dlight = new BABYLON.DirectionalLight('dir01', new BABYLON.Vector3(0.2, -1, 0), scene)
        dlight.position = new BABYLON.Vector3(0, 20, 0)
        // camera
        camera = new BABYLON.ArcRotateCamera(
          'Camera',
          0,
          0,
          0,
          new BABYLON.Vector3(0, 20, 10),
          scene
        )
        // make camera controllable
        // this.game.camera.attachControl(this.$refs.game, false)
        // set camera
        scene.activeCamera = camera
        scene.collisionsEnabled = true
        // enable shadow
        shadow = new BABYLON.ShadowGenerator(4096, dlight)
        // scene mesh to shadow
        scene.meshes.forEach(m => {
          m.receiveShadows = true
          if (m.id !== 'Plane') {
            m.checkCollisions = true
            m.isPickable = false
          }
          shadow.addShadowCaster(m)
        })
        onSuccess(shadow, camera, scene.meshes)
      })
    })
  }
}
