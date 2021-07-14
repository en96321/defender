<template>
  <q-page class="container">
    <canvas class="game" ref='game'>
    </canvas>
  </q-page>
</template>
<style lang="sass" scoped>
  .container
    position: absolute
    display: block
  .game
    position: absolute
    touch-action: none
    width: 100vw
    height: calc(100vh - 50px)
</style>
<script>
// import * as BABYLON from 'babylonjs'
import init from '../game/initial/Init.js'
import terrianScene from '../game/scenes/terrian/scene.js'
// import controller from '../game/controllers/Mouse.js'
import Soldier from '../game/characters/Soldier.js'
// import * as CANNON from '../assets/cannon.js'
import 'babylonjs-loaders'
import io from 'socket.io-client'
export default {
  name: 'Main',
  data () {
    return {
      firstTime: true,
      users: [],
      id: '',
      socket: null,
      game: {
        scene: null,
        soldier: null
      }
    }
  },
  methods: {
    init () {
      const createdScene = init.create(this.$refs.game)
      const { scene, engine } = createdScene
      // load map
      terrianScene.load(scene, (shadow, camera, meshes) => {
        // load soldier
        this.game.soldier = new Soldier({
          scene: scene,
          isPrimary: true
        })
        /* soldier.create(scene, user => {
          shadow.addShadowCaster(user.model)
          camera.setTarget(user.model)
          controller.registControl(scene, user)
          scene.registerBeforeRender(() => {
            user.updatePosition()
          })
          meshes.forEach(m => {
            if (m.name !== 'Plane') user.registCollision(m)
          })
        }) */
        engine.runRenderLoop(() => {
          scene.render()
        })
      })
    },
    onKeyDown (e) {
      switch (e.keyCode) {
        case 38:
        case 87:
          this.controlUser.up = true
          break
        case 40:
        case 83:
          this.controlUser.down = true
          break
        case 37:
        case 65:
          this.controlUser.left = true
          break
        case 39:
        case 68:
          this.controlUser.right = true
          break
      }
    },
    onKeyUp (e) {
      switch (e.keyCode) {
        case 38:
        case 87:
          this.stopMove()
          this.controlUser.up = false
          break
        case 40:
        case 83:
          this.stopMove()
          this.controlUser.down = false
          break
        case 37:
        case 65:
          this.stopMove()
          this.controlUser.left = false
          break
        case 39:
        case 68:
          this.stopMove()
          this.controlUser.right = false
          break
      }
    },
    stopMove () {
      this.socket.emit('stopMove')
    },
    onConnect () {
      this.id = this.socket.id
    },
    onUserConnect (id) {
      if (this.id !== id) {
        const u = {
          id: id,
          position: null
        }
        this.users.push(u)
      }
    },
    onUserDisconnect (id) {
      // const u = this.users.find(u => u.id === id)
    },
    onUserStopMove (id) {
      // const u = this.users.find(u => u.id === id)
    },
    onUserMove (data) {
      // const u = this.users.find(u => u.id === data.id)
    },
    onLogin (data) {
      if (this.firstTime) {
        // createUsers
        this.firstTime = false
      }
    },
    connectServer () {
      this.socket = io('http://120.110.7.112:3000')
      this.socket.on('connect', this.onConnect)
      this.socket.on('userDisconnect', this.onUserDisconnect)
      this.socket.on('userConnect', this.onUserConnect)
      this.socket.on('usermove', this.onUserMove)
      this.socket.on('userStopMove', this.onUserStopMove)
      this.socket.on('locate', this.onLogin)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
