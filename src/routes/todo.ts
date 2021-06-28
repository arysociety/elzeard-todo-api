import express from 'express'
import { UserModel } from '../models/user' 
import todos from '../models/todo'
import { checkAndGetUserWithAccessToken } from '../middleware/user'


export default (server: express.Express) => {

    const { schemaValidator } = todos.expressTools().middleware()
    const { postHandler, putHandler } = todos.expressTools().request()

    server.post('/todo', schemaValidator, checkAndGetUserWithAccessToken, (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const user = res.locals.user as UserModel
        req.body = Object.assign(req.body, {user: user.ID()})
        next()
    }, postHandler(['content', 'user'], 'todo'))

    server.put('/todo/:id', schemaValidator, putHandler(['content'], 'todo'))


    server.get('/todo', async (req, res) => {
        const collection = await todos.quick().pull().run()
        res.json(
            collection.local().
            orderBy(['created_at'], ['desc']).
            local().
            to().
            filterGroup('todo').plain()
        )
    })

    server.get('/todo/:id', async (req, res) => {
        const m = await todos.quick().find(req.params.id)
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