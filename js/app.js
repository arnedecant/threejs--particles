'use strict'

class App {

	constructor(amount) {

		// set properties
		this.amount = amount || 1000
		this.mouse = { x: 0, y: 0 }

		// init
		this.init()

		// particles
		this.particles()

		// render scene
		this.renderer.render(this.scene, this.camera)

	}

	init() {

		// skip if there's no THREE
		if (!THREE) return

		// set scene and camera
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(120, 16 / 9, 1, 3000)
		this.camera.position.z = 500

		// set renderer
		this.renderer = new THREE.WebGLRenderer()
		document.body.appendChild(this.renderer.domElement)

		// set events
		window.addEventListener('resize', this.resize.bind(this))
		window.addEventListener('mousemove', this.mouseMove.bind(this))
		window.addEventListener('mousewheel', this.scroll.bind(this), { passive: true })

		// resize and render
		this.resize()

	}

	particles() {

		// define material
		const material = new THREE.PointsMaterial({
			size: 5,
      		vertexColors: THREE.VertexColors
		})

		// set geometry
		this.geometry = new THREE.Geometry()

		// add an amount of particles
		for (let i = 0; i < this.amount; i++) {

			let x = (Math.random() * 800) - 400,
				y = (Math.random() * 800) - 400,
				z = (Math.random() * 800) - 400;

			this.geometry.vertices.push(new THREE.Vector3(x, y, z))
			this.geometry.colors.push(new THREE.Color(Math.random(), Math.random(), Math.random()))

		}

		// create new point cloud
		const pointCloud = new THREE.Points(this.geometry, material)

		// add point cloud to the scene
		this.scene.add(pointCloud)

	}

	setCamera(x, y, z) {

		// set new positions
		this.camera.position.x += (this.mouse.x - this.camera.position.x) * 0.05
        this.camera.position.y += (-this.mouse.y - this.camera.position.y) * 0.05

        // update camera
        this.camera.lookAt(this.scene.position)

	}

	scroll(e) {

		// get new camera position
		const z = this.camera.position.z - e.deltaY

		// apply position if it's above threshold
		this.camera.position.z = (z > 0) ? z : 0

	}

	mouseMove(e) {

		this.mouse.x = e.clientX - (this.width / 2)
		this.mouse.y = e.clientY - (this.height / 2)

	}

	resize() {

		// set canvas dimensions
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		// set renderer dimensions
		this.renderer.setSize(this.width, this.height)

		// set camera
		this.camera.aspect = this.width / this.height
		this.camera.updateProjectionMatrix()

		// render
		this.render()

	}

	render() {

		// add self to the requestAnimationFrame
		window.requestAnimationFrame(this.render.bind(this))

		// set camera positions
		this.setCamera()

		// check if there's geometry
		if (!this.geometry) return

		// loop particles and update their position
		this.geometry.vertices.map((particle, index) => {

			let dX = Math.random() * 2 - 1,
				dY = Math.random() * 2 - 1,
				dZ = Math.random() * 2 - 1

			particle.add(new THREE.Vector3(dX, dY, dZ))

			this.geometry.colors[index] = new THREE.Color(Math.random(), Math.random(), Math.random())

		})

		// tell geometry to update vertices and colors
		this.geometry.verticesNeedUpdate = true;
		this.geometry.colorsNeedUpdate = true;

		// render
  		this.renderer.render(this.scene, this.camera);

	}

}