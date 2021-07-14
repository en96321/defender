import * as BABYLON from 'babylonjs'

export default {
  create: function (canvas) {
    const engine = new BABYLON.Engine(canvas, true)
    engine.setHardwareScalingLevel(1 / window.devicePixelRatio)
    const scene = new BABYLON.Scene(engine)
    scene.actionManager = new BABYLON.ActionManager(scene)
    canvas.setAttribute('oncontextmenu', 'return false')
    window.addEventListener('resize', () => { engine.resize() })
    return {
      scene: scene,
      engine: engine
    }
  }
}
