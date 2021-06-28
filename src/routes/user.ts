import express from 'express'
import users, { UserModel } from '../models/user' 
import { checkAndGetUserWithAccessToken } from '../middleware/user'

export default (server: express.Express) => {
    const { schemaValidator } = users.expressTools().middleware()
    const { postHandler, putHandler } = users.expressTools().request()

    server.post('/user', schemaValidator, postHandler(['email']))

    server.put('/user', checkAndGetUserWithAccessToken, schemaValidator, putHandler(['email']))

    server.delete('/user', checkAndGetUserWithAccessToken, (req, res) => {
        const user = res.locals.user as UserModel
        user.destroy()
        res.sendStatus(200)
    })

    server.get('/user', checkAndGetUserWithAccessToken, async (req, res) => {
        const user = res.locals.user as UserModel
        res.json(user.to().plain())
    })
}