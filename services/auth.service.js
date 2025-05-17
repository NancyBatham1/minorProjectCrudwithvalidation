import User from "../models/user.model.js"

export const userFindAll = (findOptions = {}) => {
    return User.findAll(findOptions);
}


export const userCreate = (createValues) => {
    return User.create(createValues);
}

export const getUser = (findOptions) => {
    return User.findOne(findOptions);
}

export const updateOtp = (updateValues, findOptions) => {

    return User.update(updateValues,findOptions);
}