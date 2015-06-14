class @Ball extends BaseObject

    ball: undefined

    constructor: () ->
        geometry = new THREE.SphereGeometry( 32, 32, 32 )
        material = new THREE.MeshBasicMaterial( 
            color: 0xff00ff
            side: THREE.DoubleSide
        )
        @ball = new Physijs.SphereMesh(geometry, material, 12)
        @ball.position.set(0, 1000, 0)

    getSceneObject: () ->
        return @ball

    renderSceneObject: () ->