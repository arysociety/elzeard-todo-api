import express from 'express'
import { initServer } from './init'
import todos from './models/todo'
import users, {UserModel} from './models/user'
import {initRoutes} from './routes'

const PORT = 3500

export const checkAndGetUserWithAccessToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { access_token } = req.headers
    const user = await users.fetchByToken(access_token as string) as UserModel
    if (!user){
        res.status(401)
        res.json({error: `This access token doesn't exist.`})
        return
    }
    if (user.tokenExpiration() < new Date()){
        res.status(401)
        res.json({error: `The access token is expired.`})
        return
    }
    res.locals.user = user
    next()
}


const todoRoutes = (server: express.Express) => {

    const { schemaValidator } = todos.expressTools().middleware()
    const { postHandler, putHandler } = todos.expressTools().request()

    server.post('/todo', schemaValidator(), checkAndGetUserWithAccessToken, (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const user = res.locals.user as UserModel
        req.body = Object.assign(req.body, {user: user.ID()})
        next()
    }, postHandler(['content', 'user'], 'todo'))

    server.put('/todo/:id', schemaValidator, putHandler(['content'], 'todo'))

    server.get('/todo', async (req, res) => {
        const list = await todos.quick().pull()
        res.json(list.local().to().plain())
    })

    server.get('/todo/:id', async (req, res) => {
        const m = await todos.quick().fetch(req.params.id)
        if (!m)
            res.sendStatus(404)
        else 
            res.json(m.to().plain())
    })

    server.delete('/todo/:id', async (req, res) => {
        todos.quick().remove(req.params.id)
        res.sendStatus(200)
    })
}

initServer().then((server) => {
    console.log('Server started ')

    initRoutes(server)
    todoRoutes(server)

    server.listen(PORT, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${PORT}`)
    })

})