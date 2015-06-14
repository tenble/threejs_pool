#abstract class which every object extends

class @BaseObject

    #returns an THREE object
    getSceneObject: () ->
        console.warn(@name + ": getObject not overriden.")

    #rendering loop function for the specific object
    renderSceneObject: () ->
        console.warn(@name + ": renderObject not overidden.")
