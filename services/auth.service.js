import User from "../models/user.model.js"

export let userFindAll = (findOptions = {}) => {
    return User.findAll(findOptions);
}


export let userCreate = (createValues) => {
    return User.create(createValues);
}

export let getUser = (findOptions) => {
    return User.findOne(findOptions);
}