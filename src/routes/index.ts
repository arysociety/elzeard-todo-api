import express from 'express'

import userRoutes from './user'
import todoRoutes from './todo'

export const initRoutes = (server: express.Express) => {
    userRoutes(server)
    todoRoutes(server)
}