import * as BABYLON from 'babylonjs'

let isTrigger = false
export default {
  registControl: function (scene, player) {
    scene.onPointerUp = function (evt, pickResult) {
      isTrigger = false
      // pointer up
    }
    scene.onPointerDown = function (evt, pickResult) {
      console.log(pickResult.pickedPoint)
      if (evt.which === 3) { // move
        const p = pickResult.pickedPoint
        p.y = 0
        player.moveToPoint(p)
        const s = getParticles(scene)
        s.emitter = new BABYLON.Vector3(p.x, 0, p.z)
        s.start()
        isTrigger = true
      }
      if (evt.which === 1) {
        // click
        player.emit(pickResult)
      }
    }
    scene.onPointerMove = function (evt, pickResult) {
      if (isTrigger) {
        const p = scene.pick(scene.pointerX, scene.pointerY).pickedPoint
        p.y = 0
        player.moveToPoint(p)
      }
    }
  }
}

function getParticles (scene) {
  const particleSystem = new BABYLON.ParticleSystem('clickParticles', 50, scene)
  particleSystem.particleTexture = new BABYLON.Texture('./assets/textures/flare.png', scene)
  particleSystem.layerMask = 2
  particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0)
  particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0)
  particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0)
  particleSystem.emitter = new BABYLON.Vector3(0, 2, 0) // the starting location
  particleSystem.minSize = 0.1
  particleSystem.maxSize = 0.1
  particleSystem.minLifeTime = 0.1
  particleSystem.maxLifeTime = 0.3
  particleSystem.emitRate = 20
  particleSystem.targetStopDuration = 0.3
  particleSystem.createPointEmitter(new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 1, 0))
  // Speed
  particleSystem.minEmitPower = 1
  particleSystem.maxEmitPower = 3
  return particleSystem
}
