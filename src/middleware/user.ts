import express from 'express'
import users, {UserModel} from '../models/user'

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