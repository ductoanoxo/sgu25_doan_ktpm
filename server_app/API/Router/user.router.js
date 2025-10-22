var express = require('express')

var router = express.Router()

const Users = require('../Controller/user.controller')

router.get('/', Users.index)

router.get('/:id', Users.user)

router.put('/', Users.update_user)

router.get('/detail/login', Users.detail)

router.post('/', Users.post_user)

router.post('/change-password', Users.change_password)

module.exports = router