class @World

    #properties
    WIDTH: $('body').width()
    HEIGHT: $('body').height()
    VIEW_ANGLE: 45
    NEAR: 0.1
    FAR: 10000
    '$container': $('body')

    clock: new THREE.Clock()

    renderer: undefined
    camera: undefined
    mainScene: undefined
    mainSceneObjects: []

    constructor: ()->
        @renderer = new THREE.WebGLRenderer()
        @camera = new THREE.PerspectiveCamera(@VIEW_ANGLE, @WIDTH/@HEIGHT, @NEAR, @FAR)
        @mainScene = new Physijs.Scene()

        @setPrimaryView()

        #controls
        controls = new THREE.FirstPersonControls(@camera)
        controls.movementSpeed = 1000
        controls.lookSpeed = 0.1
        controls.target = new THREE.Vector3(0, 0, 0)
        @camera.lookAt(controls.target)

        @mainScene.add(@camera)

        @renderer.setSize(@WIDTH, @HEIGHT)
        @$container.append(@renderer.domElement)

        floor = new Floor()
        @mainSceneObjects.push(floor)
        @mainScene.add(floor.getSceneObject())
        ball = new Ball()
        @mainSceneObjects.push(ball)
        @mainScene.add(ball.getSceneObject())

        #TEST LIGHT
        light = new THREE.AmbientLight(0x404040)
        @mainScene.add(light)

        objRef = this
        render = () ->
            requestAnimationFrame(render)

            #render objects
            for object in objRef.mainSceneObjects
                object.renderSceneObject()

            #controls
            controls.update(objRef.clock.getDelta())

            #physics simulate
            objRef.mainScene.simulate()

            objRef.renderer.render(objRef.mainScene, objRef.camera)

        render()

        @addListeners()

    setPrimaryView: () ->
        @camera.position.x = 0
        @camera.position.y = 100
        @camera.position.z = 0
        @camera.lookAt(new THREE.Vector3(0, 0, 0))

    addListeners: () ->
        objRef = this
        $('body').keypress((ev) ->
            if (ev.which == 118) #v key
                if objRef.city.cameraFollow
                    objRef.city.setCameraFollow(false)
                    objRef.setPrimaryView()
                else
                    objRef.city.setCameraFollow(true)
        )