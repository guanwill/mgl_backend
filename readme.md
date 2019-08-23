# Passport boilerplate
This app includes APIs for basic auth functionality. Beyond auth functionality, it also has APIs to perform CRUD on user's games.

## AUTH
**REGISTER**
```
POST /api/v1/auth/register
```

Body:
```
"data": {
    "username": "test@test.com",
    "password": "test"
}
```

**LOGIN**
```
POST /api/v1/auth/login
```

Body:
```
"data": {
    "username": "test@test.com",
    "password": "test"
}
```

**FORGOT PASSWORD**
```
POST /api/v1/auth/forgot_password
```

Body:
```
"data": {
    "username": "test@test.com",
}
```

**RESEND VERIFICATION EMAIL**
```
POST /api/v1/auth/resend_verification_email
```

Body:
```
"data": {
    "username": "test@test.com",
}
```

**VERIFY ACCOUNT**
```
GET /api/v1/auth/verify_account/:token
```

Params:
```
req.params.token
```

## USER
**UPDATE USER**
```
POST /api/v1/user/:id
```

Params:
```
req.params.id
```

Body:
```
"data": {
    "name": "newtest",
    "password: "newpassword"
}
```

**GET ACCOUNT**
```
GET /api/v1/user/:id
```

Params:
```
req.params.id
```

## GAMES
**ADD GAME**
```
POST /api/v1/games/user/:id
```

Params:
```
req.params.id
```

Body:
```
"data": {
    "title": "newgame",
}
```

**UPDATE GAME**
```
POST /api/v1/games/:game_id
```

Params:
```
req.params.game_id
```

Body:
```
"data": {
    "title": "newgame",
}
```

**DELETE GAME**
```
DELETE /api/v1/games/:game_id/user/:user_id
```

Params:
```
req.params.game_id;
req.params.user_id;
```