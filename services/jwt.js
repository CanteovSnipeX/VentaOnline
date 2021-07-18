'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'LxV3MTV2';

exports.createToken = (dato)=>{
    var payload = {
        sub: dato._id,
        name: dato.name,
        lastname: dato.lastname,
        username: dato.username,
        role: dato.role,
        iat: moment().unix(),
        exp: moment().add(1, 'hours').unix()
    }
    return jwt.encode(payload, secretKey);
};
