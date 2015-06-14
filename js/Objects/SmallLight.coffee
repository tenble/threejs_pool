class @SmallLight extends BaseObject
    constructor: (color, intensity, distance, position, cityInstance) ->
        @paths = []
        @distance = distance
        @cityInstance = cityInstance

        @light = new THREE.PointLight(color, intensity, distance)
        @sphere = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshLambertMaterial(
        	#color: color,
            transparent: true,
            opacity: 0.5
        ))

        @sceneObject = new THREE.Scene()
        @sceneObject.add(@light)
        @sceneObject.add(@sphere)
        @sceneObject.position.set(position.x, position.y, position.z)

        @generateRandomPaths(position)

    generateRandomPaths: (position) ->
        @paths = []

        #TODO set terminating amount rather than constant
        for i in [0..100000]
            from = if i == 0 then position else @paths[i-1].to
            time = 60 + (Math.floor(Math.random()*30)) #number of frames
            dist = (Math.floor(Math.random()*3)+1)*50 #distance travelled

            #work out directional vector
            #can either go forward, left or right
            dirVec = if i == 0 then new THREE.Vector3(1, 0, 0) else @paths[i-1].getMoveVec().clone().normalize()
            rotRadians = (Math.round(Math.random()*2) - 1) * (Math.PI/2)
            x = dirVec.x*Math.cos(rotRadians) - dirVec.z*Math.sin(rotRadians)
            z = dirVec.x*Math.sin(rotRadians) + dirVec.z*Math.cos(rotRadians)
            dirVec.setX(x)
            dirVec.setZ(z)
            dirVec.multiplyScalar(dist)

            #add to previous know vector
            to = from.clone()
            to.add(dirVec)

            @paths[i] = new Path(time, from, to)

            if @cityInstance.isLightOut(to, @distance/2)
                break

    unFade: () ->
        if @light.intensity < 1
            @light.intensity += 0.01
            @sphere.material.opacity += 0.01

    #fades a light, returns true if already maximum faded or false otherwise
    fade: () ->
        if @light.intensity > 0
            @sphere.material.opacity -= 0.01
            @light.intensity -= 0.01
            return false

        return true

    getDirection: () ->
        return @paths[0].vec

    getSceneObject: () ->
        return @sceneObject

    renderSceneObject: () ->
        path = @paths[0]
        path.advance(@getSceneObject())
        if path.hasReached and @paths.length > 1
            @paths.splice(0, 1)


class Path
    constructor: (time, from, to) ->
        @to = to
        @from = from
        @hasReached = false
        @vec = to.clone()
        @vec.sub(from)
        @vec.divideScalar(time)

        @hasReached = THREE.MyHelper.checkVec(from, to)

    advance: (threeObj) ->
        threeObj.position.add(@vec)
        @hasReached = THREE.MyHelper.checkVec(threeObj.position, this.to)

    getMoveVec: () ->
        return @vec