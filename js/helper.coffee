THREE.MyHelper = 
    checkVec: (vec1, vec2) ->
        EPSILON = 0.00001 

        diff = vec2.clone()
        diff.sub(vec1)

        if Math.abs(diff.x) < EPSILON and Math.abs(diff.y) < EPSILON and Math.abs(diff.z) < EPSILON
            return true

        return false