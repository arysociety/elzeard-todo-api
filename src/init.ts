import express from 'express'
import formData from 'express-form-data'
import morgan from 'morgan'
import { config } from 'elzeard'

export const initServer = async () => {
    const server = express()
    server.use(express.json());
    server.use(formData.parse())
    server.use(morgan('tiny'))
  
    server.use(function(req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access_token");
      next();
    });

    config.setHistoryDirPath('./history')
    config.setMySQLConfig({
      host: '',
      user: '',
      password: '',
      database: 'todo'
    })
    await config.done()
    return server
}