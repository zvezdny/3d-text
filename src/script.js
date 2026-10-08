import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
const axesHelper = new THREE.AxesHelper(5);
const gui = new GUI();
const debugObject = {
  count: 100
}



// const loader = new TTFLoader();
// loader.load('/Potta_One/PottaOne-Regular.ttf', (font) => {
//   const json = await loader.loadAsync( '/Potta_One/PottaOne-Regular.ttf'   );
//   const font = new Font(json);
//   const TextGeometry = new TextGeometry(
//     '私のことを置いてもいいですか?',
//     {
//       font: font,
//       size: 0.5,
//       depth: 0.2,
//       curveSegments: 12,
//       bevelEnabled: true,
//       bevelThickness: 0.03,
//       bevelSize: 0.02,
//       bevelOffset: 0,
//       bevelSegments: 5
//     }
//   )
// });


const loader = new TTFLoader();
const json = await loader.loadAsync( '/Potta_One/PottaOne-Regular.ttf' );
const font = new Font(json);

const textGeometry = new TextGeometry('大きなペニス', {
  font: font,
  size: 0.5,
  depth: 0.2,
  curveSegments: 12,
  bevelEnabled: true,
  bevelThickness: 0.03,
  bevelSize: 0.02,
  bevelOffset: 0,
  bevelSegments: 5
});

// textGeometry.computeBoundingBox()
// console.log(textGeometry.boundingBox)

// textGeometry.translate(
//     - textGeometry.boundingBox.max.x * 0.5,
//     - textGeometry.boundingBox.max.y * 0.5,
//     - textGeometry.boundingBox.max.z * 0.5
// )
textGeometry.center()

/**
 * Base
 */
// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// const ambientLight = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambientLight)
//
// const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/7.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

const material = new THREE.MeshMatcapMaterial()
material.map = matcapTexture
/**
 * Object
 */
const cube = new THREE.Mesh(
    textGeometry,
    material
)

scene.add(cube)
// cube.position.set(-2, 0, 0);
// scene.add(axesHelper);

const count = 100
const spread = 5



gui.add(debugObject, 'count' , 10 , 1000 , 1).onChange(() => {
    buildDonut()
  })


let donut = null

function buildDonut() {
  if (donut) {
    donut.donutGeometry.dispose()
    scene.remove(donut)
  }
  const donutGeometry = new THREE.TorusGeometry(0.1, 0.08, 20, 45)
  const donutMaterial = new THREE.MeshMatcapMaterial({ map: matcapTexture })
  for (let i = 0; i < debugObject.count; i++) {

    const donut = new THREE.Mesh(donutGeometry, donutMaterial)
    scene.add(donut)

    donut.position.x = (Math.random() - 0.5) * spread
    donut.position.y = (Math.random() - 0.5) * spread
    donut.position.z = (Math.random() - 0.5) * spread

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.set(scale, scale, scale)

  }
}
buildDonut()


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
  cube.rotation.y = elapsedTime

  cube.position.y = Math.abs(Math.sin(elapsedTime * 0.2) * 2)
  // cube.position.y = Math.abs(Math.sin(elapsedTime * 0.002) * 100)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
