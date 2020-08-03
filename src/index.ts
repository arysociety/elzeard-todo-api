import { initServer } from './init'
import {initRoutes} from './routes'

const PORT = 3500

initServer().then((server) => {
    console.log('Server started ')

    initRoutes(server)

    server.listen(PORT, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${PORT}`)
    })

})
