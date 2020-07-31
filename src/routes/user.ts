import express from 'express'
import users, { UserModel } from '../models/user' 
import { checkAndGetUserWithAccessToken } from '../middleware/user'

export default (server: express.Express) => {
    const { schemaValidator } = users.expressTools().middleware()
    const { postHandler, putHandler } = users.expressTools().request()

    server.post('/user', schemaValidator(), postHandler(['email']))

    server.put('/user/:id', checkAndGetUserWithAccessToken, schemaValidator(), putHandler(['email']))

    server.get('/user/:id', checkAndGetUserWithAccessToken, async (req, res) => {
        const user = res.locals.user as UserModel
        res.json(user.to().plain())
    })
}