import { initServer } from './init'
import {initRoutes} from './routes'

const PORT = 3500

initServer().then((server) => {
    initRoutes(server)

    server.listen(PORT)
})
