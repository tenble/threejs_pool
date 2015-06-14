class @Building extends FlatTerrain

    sourceObject: null

    constructor: (posX, posY, posZ, sizeX, sizeY, sizeZ) ->
        geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ)

        #change pivot point to bottom of matrix
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation( 0, sizeY/2, 0 ))

        #remove bottom face for optimisation
        #geometry.faces.splice( 3, 1 )

        #UV mapping???
        #geometry.faceVertexUvs[0][2][0].set(0, 0)
        #geometry.faceVertexUvs[0][2][1].set(0, 0)
        #geometry.faceVertexUvs[0][2][2].set(0, 0)
        #geometry.faceVertexUvs[0][2][3].set(0, 0)

        texture = THREE.ImageUtils.loadTexture('images/BuildingGlass128x128.jpg')
        texture.repeat.set(5*1, 5*sizeY/sizeX)
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping

        material    = new THREE.MeshPhongMaterial({
            ambient     : 0x444444,
            color       : 0xFFFFFF,
            shininess   : 150, 
            specular    : 0x888888,
            shading     : THREE.SmoothShading,
            map     : texture
        })

        @sourceObject = new THREE.Mesh(geometry, material)
        @sourceObject.position.x = posX
        @sourceObject.position.y = posY
        @sourceObject.position.z = posZ

    getSceneObject: () ->
        return @sourceObject

    renderSceneObject: () ->
