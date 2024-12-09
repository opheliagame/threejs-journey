import * as THREE from 'three';

class Raycaster {
  constructor(scene, camera) {    
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.scene = scene
    this.camera = camera
    this.intersects = []
    this.hovered = {}
    this.initEvents()
  }

  initEvents() {
    const width = window.innerWidth
    const height = window.innerHeight

    // events
    window.addEventListener('pointermove', (e) => {
      this.mouse.set((e.clientX / width) * 2 - 1, -(e.clientY / height) * 2 + 1)
      this.raycaster.setFromCamera(this.mouse, this.camera)
      this.intersects = this.raycaster.intersectObjects(this.scene.children, true)

      // If a previously hovered item is not among the hits we must call onPointerOut
      Object.keys(this.hovered).forEach((key) => {
        const hit = this.intersects.find((hit) => hit.object.uuid === key)
        if (hit === undefined) {
          const hoveredItem = this.hovered[key]
          if (hoveredItem.object.onPointerOver) hoveredItem.object.onPointerOut(hoveredItem)
          delete this.hovered[key]
        }
      })

      this.intersects.forEach((hit) => {
        // If a hit has not been flagged as hovered we must call onPointerOver
        if (!this.hovered[hit.object.uuid]) {
          this.hovered[hit.object.uuid] = hit
          if (hit.object.onPointerOver) hit.object.onPointerOver(hit)
        }
        // Call onPointerMove
        if (hit.object.onPointerMove) hit.object.onPointerMove(hit)
      })
    })

    window.addEventListener('click', (e) => {
      this.intersects.forEach((hit) => {
        // Call onClick
        if (hit.object.onClick) hit.object.onClick(hit)
      })
    })
  }
}

export default Raycaster