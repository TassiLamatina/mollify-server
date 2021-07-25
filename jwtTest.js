const jwt = require('jsonwebtoken')

const jwtTest = () => {
    try{
        // user login process:

        // create the data payload
        const payload = {
            name: 'Tassi',
            id: 3
        }

        // signing the jwt
        const token = jwt.sign(payload, 'This is my secret', { expiresIn: 60 * 60 })
        console.log(token)

        // requests to server:

        // decode the incoming jwt
        const decoded = jwt.verify(token, 'This is my secret')
        console.log(decoded)

    } catch (err) {
        console.log(err)
    }
}

jwtTest() 
