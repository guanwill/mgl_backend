# Passport boilerplate
This app includes APIs for basic auth functionality. Beyond auth functionality, it also has APIs to perform CRUD on user's games.

## AUTH
**Register**
> POST /api/v1/auth/register

Body:
```
"data": {
    "username": "test@test.com",
    "password": "test"
}
```

**Login**
> POST /api/v1/auth/login

Body:
```
"data": {
    "username": "test@test.com",
    "password": "test"
}
```

**Forgot Password**
> POST /api/v1/auth/forgot_password

Body:
```
"data": {
    "username": "test@test.com",
}
```

**Resend Verification Email**
> POST /api/v1/auth/resend_verification_email

Body:
```
"data": {
    "username": "test@test.com",
}
```

**Verify Account**
> GET /api/v1/auth/verify_account/:token

Params:
```
req.params.token
```

## USER
**Update User**
> POST /api/v1/user/:id

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

**Get Account**
> GET /api/v1/user/:id

Params:
```
req.params.id
```

## GAMES
**Add Game**
> POST /api/v1/games/user/:id

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

**Update Game**
> POST /api/v1/games/:game_id

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

**Delete Game**
> DELETE /api/v1/games/:game_id/user/:user_id

Params:
```
req.params.game_id;
req.params.user_id;
```