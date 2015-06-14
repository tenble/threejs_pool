class @FlatTerrain extends BaseObject

    mainObject: null

    constructor: () ->
        geometry = new THREE.BoxGeometry(1000, 0.2, 1000)
        texture = THREE.ImageUtils.loadTexture('images/Asphalt256x256.jpg')
        texture.repeat.set(500, 500)
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        mat = new THREE.MeshPhongMaterial( 
            color: 0xFFFFFF
            map: texture
        )
        @mainObject = new THREE.Mesh(geometry, mat)
    getSceneObject: () ->
        return @mainObject
    renderSceneObject: () ->