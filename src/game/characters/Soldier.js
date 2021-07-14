import * as BABYLON from 'babylonjs'
import skills from '../skills/skills.js'

export default class soldier {
  constructor (config) {
    this.scene = config.scene
    this.isPrimary = config.isPrimary
    this.animations = {
      run: null,
      idle: null
    }
    this.model = null
    this.user = {
      level: 1,
      skill: {
        q: {
          level: 0,
          info: skills[0]
        },
        w: {
          level: 0,
          info: skills[1]
        },
        e: {
          level: 0,
          info: skills[2]
        },
        r: {
          level: 0,
          info: skills[3]
        }
      }
    }
    this.selectedSkill = null
    // load mesh model
    BABYLON.SceneLoader.ImportMesh('', '', './assets/models/Soldier.glb', this.scene, (result, particleSystems, skeletons, animationGroups) => {
      // create node for walk
      const node = new BABYLON.TransformNode()
      // const box = new BABYLON.MeshBuilder.CreateBox('box', { height: 3, width: 0.9, depth: 0.9 }, scene)
      // box.position = new BABYLON.Vector3(0, 10, 0)
      // box.visibility = 0
      node.visibility = 0
      // set position
      result[0].position = new BABYLON.Vector3(0, -0.2, 0)
      result[0].rotation = new BABYLON.Vector3(0, Math.PI * 2, 0)
      // bind walk node
      result[0].parent = node
      // result[0].parent = box
      // enable collisions
      node.checkCollisions = true
      this.model = node
      // model = box
      // box.actionManager = new BABYLON.ActionManager(s)
      this.animations.run = animationGroups[1] // run animation
      this.animations.idle = animationGroups[0] // idel animation
      // load magic
      // magic
      const mat = new BABYLON.StandardMaterial('magic', this.scene)
      const t = new BABYLON.Texture('./assets/textures/magic-circle.png', this.scene)
      t.hasAlpha = true
      mat.diffuseTexture = t
      mat.useAlphaFromDiffuseTexture = true
      // create magic circle
      this.magicCircle = BABYLON.MeshBuilder.CreateCylinder('magic-circle', { height: 0.01, diameter: 1 }, this.scene, true)
      this.magicCircle.material = mat
      this.magicCircle.visibility = 1
      this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
          this.selectedSkill = this.user.skill[evt.sourceEvent.key]
        }
      ))
      this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
          this.selectedSkill = null
          // skill.use(s, box)
        }
      ))
      this.scene.registerBeforeRender(() => {
        // magic animation
        this.magicCircle.rotation.y -= 0.02
        if (this.selectedSkill) {
          const p = this.scene.pick(this.scene.pointerX, this.scene.pointerY).pickedPoint
          p.y = 0.1
          this.magicCircle.position = p
          this.magicCircle.visibility = 1
          const range = this.selectedSkill.info.range[this.selectedSkill.level]
          this.magicCircle.scaling = new BABYLON.Vector3(range, 1, range)
        } else this.magicCircle.visibility = 0
      })
      if (this.isPrimary) this.scene.activeCamera.setTarget(result[0])
    })
  }
}
