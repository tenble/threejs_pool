class @Floor extends BaseObject

    floor: undefined

    constructor: () ->
        geometry = new THREE.PlaneBufferGeometry( 512, 512, 32 )
        material = new THREE.MeshBasicMaterial( 
            color: 0xffff00
            side: THREE.DoubleSide
        )
        @floor = new Physijs.BoxMesh(geometry, material, 0)
        @floor.rotation.set(Math.PI/2, 0, 0);

    getSceneObject: () ->
        return @floor

    renderSceneObject: () ->