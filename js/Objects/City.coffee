class @City extends BaseObject
    gridX: undefined
    gridZ: undefined
    gridSize: undefined
    camera: undefined
    cameraFollow: false
    sceneObject: null
    lights: []

    constructor: (gridX, gridZ, gridSize, gridMargin, minBSizeX, maxBSizeX, minBSizeY, maxBSizeY, minBSizeZ, maxBSizeZ, camera) ->
        @gridX = gridX
        @gridZ = gridZ
        @gridSize = gridSize
        @camera = camera

        @sceneObject = new THREE.Scene()

        for i in [-gridX/2..gridX/2]
            for j in [-gridZ/2..gridZ/2]
                position = 
                    x: i*gridSize + gridSize/2
                    y: 0
                    z: j*gridSize + gridSize/2
                size =
                    x: minBSizeX + Math.random()*(maxBSizeX-minBSizeX)
                    y: minBSizeY + Math.random()*(maxBSizeY-minBSizeY)
                    z: minBSizeZ + Math.random()*(maxBSizeZ-minBSizeZ)

                #position.x += Math.random()*(gridSize-gridMargin-size.x)
                #position.z += Math.random()*(gridSize-gridMargin-size.z)

                @sceneObject.add(new Building(position.x, position.y, position.z, size.x, size.y, size.z).getSceneObject())

        for i in [0..100]
            @spawnRandomLight()

    getSceneObject: () ->
        return @sceneObject

    isLightOut: (pos, rad) ->
        if pos.x > (@gridX/2) * @gridSize + rad
            return true
        if pos.z > (@gridZ/2) * @gridSize + rad
            return true
        if pos.x < -1 * (@gridX/2) * @gridSize - rad
            return true
        if pos.z < -1 * (@gridZ/2) * @gridSize - rad
            return true

        return false

    CAMERA_HEIGHT_OFFSET: 10
    INTERP_FRAMES: 30
    CAMERA_DIST_BEHIND: 45
    TRANSITION_CURVE: [
        2, 4, 6, 8, 10,
        12, 14, 16, 18, 20,
        22, 24, 26, 28, 30,
        30, 28, 26, 24, 22,
        20, 18, 16, 14, 12,
        10, 8, 6, 4, 2
    ]
    SUM_TRANSITION_CURVE: City.prototype.TRANSITION_CURVE.reduce((a, b) ->
        return a+b
    , 0)
    interpFrames: 0
    prevVec: new THREE.Vector3(0, 0, 0)
    posMoveVec: new THREE.Vector3(0, 0, 0)
    renderSceneObject: () ->
        prevLightMoveVec = @lights[0].getDirection().clone()

        for light in @lights
            light.renderSceneObject()
            if @isLightOut(light.getSceneObject().position, light.distance/4)
                if light.fade()
                    @createRandomLight(light)
            else
                light.unFade()

        if @cameraFollow
            lightPos = @lights[0].getSceneObject().position.clone()
            lightMoveVec = @lights[0].getDirection().clone()
            cameraDistDiff = lightMoveVec.clone().normalize().multiplyScalar(@CAMERA_DIST_BEHIND)

            if @interpFrames == 0 and not THREE.MyHelper.checkVec(lightMoveVec, @prevVec) and not THREE.MyHelper.checkVec(prevLightMoveVec.clone().normalize(), lightMoveVec.clone().normalize())
                @interpFrames = @INTERP_FRAMES
                finalLightPos = lightPos.clone().add(lightMoveVec.clone().multiplyScalar(@INTERP_FRAMES))
                finalLightPos.sub(cameraDistDiff)
                @posMoveVec = finalLightPos.clone().sub(@camera.position).divideScalar(@interpFrames)

            if @interpFrames > 0
                #position
                @camera.position.add(@posMoveVec.clone().multiplyScalar(@INTERP_FRAMES).multiplyScalar(@TRANSITION_CURVE[@interpFrames-1]/@SUM_TRANSITION_CURVE))
                @camera.position.setY(@CAMERA_HEIGHT_OFFSET)

                #direction
                @camera.lookAt(@camera.position.clone().add(
                    @prevVec.clone().multiplyScalar(@interpFrames-1).add(
                        lightMoveVec.clone().multiplyScalar(@INTERP_FRAMES-@interpFrames+1)
                    )
                ))

                @interpFrames--
                if @interpFrames == 0
                    @prevVec = lightMoveVec
            else
                @camera.position.set(lightPos.x, @CAMERA_HEIGHT_OFFSET, lightPos.z)
                @camera.position.sub(cameraDistDiff)

    setCameraFollow: (bool) ->
        @cameraFollow = bool
        if bool
            @prevVec = @lights[0].getDirection().clone()

            lightPos = @lights[0].getSceneObject().position.clone()
            lightMoveVec = @lights[0].getDirection().clone()

            @camera.position.set(lightPos.x, @CAMERA_HEIGHT_OFFSET, lightPos.z)
            @camera.position.sub(lightMoveVec.setY(0).clone().multiplyScalar(60))
            @camera.lookAt(lightPos.clone().setY(@CAMERA_HEIGHT_OFFSET))

    spawnRandomLight: () ->
        newLight = @createRandomLight()
        @lights.push(newLight)
        @sceneObject.add(newLight.getSceneObject())

    getRandomStart: () ->
        vec = new THREE.Vector3(
            @gridSize * (Math.floor(Math.random() * (@gridX-2)) - (@gridX-2)/2),
            0,
            @gridSize * (Math.floor(Math.random() * (@gridZ-2)) - (@gridZ-2)/2),
        )
        return vec

    #reconfigures light if light param is specified
    createRandomLight: (light) ->
        newPos = @getRandomStart()

        if light == undefined
            light = new SmallLight(new THREE.Color(Math.random() * 0xFFFFFF), 1, 2*@gridSize, newPos, @)
            console.log("New light created at " + newPos.x + ", " + newPos.y + ", " + newPos.z + " with " + light.paths.length + " paths")
        else
            light.getSceneObject().position.set(newPos.x, newPos.y, newPos.z)
            light.generateRandomPaths(newPos)

        return light

