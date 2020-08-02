import { Joi, Collection, Model  } from 'elzeard'
import { v4 as uuidv4 } from 'uuid';

const ACCESS_TOKEN_VALIDITY_SECOND = 3600 * 24 * 30 //30 days

export class UserModel extends Model {

    static schema = Joi.object({
        id: Joi.number().autoIncrement().primaryKey().group(['todo']),
        email: Joi.string().email().unique().lowercase().required(),
        created_at: Joi.date().default('now').group(['todo']),
        access_token: Joi.string().uuid().unique().default(() => uuidv4()),
        token_expiration: Joi.date().default(() => new Date(Date.now() + (1000 * ACCESS_TOKEN_VALIDITY_SECOND)))
    })

    constructor(initialState: any, options: any){
        super(initialState, UserModel, options)
    }

    ID = () => this.state.id
    tokenExpiration = () => this.state.token_expiration
}

export class UserCollection extends Collection {
    constructor(initialState: any, options: any){
        super(initialState, [UserModel, UserCollection], options)
    }

    fetchByToken = async (token: string) => token ? await this.quick().fetch({access_token: token}) : null
}


export default new UserCollection([], {table: 'users'})