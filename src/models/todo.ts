import { Joi, Collection, Model  } from 'elzeard'

export class TodoModel extends Model {

    static schema = Joi.object({
        id: Joi.number().autoIncrement().primaryKey(),
        content: Joi.string().min(1).max(400).default(''),
        created_at: Joi.date().default(() => new Date()),
        user: Joi.number().foreignKey('users', 'id', 'todo').deleteCascade()
    })

    constructor(initialState: any, options: any){
        super(initialState, TodoModel, options)
    }

    content = () => this.state.content
    ID = () => this.state.id
    createdAt = () => this.state.created_at
}

export class TodoCollection extends Collection {
    constructor(initialState: any, options: any){
        super(initialState, [TodoModel, TodoCollection], options)
    }
}

export default new TodoCollection([], {table: 'todos'})