# Passport boilerplate (For MGL)
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

---

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

---

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

---

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

---

**VERIFY ACCOUNT**
```
GET /api/v1/auth/verify_account/:token
```

Params:
```
req.params.token
```

---

## USER

**UPDATE ACCOUNT**
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

---

**GET ACCOUNT**
```
GET /api/v1/user/:id
```

Params:
```
req.params.id
```

---

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

---

**UPDATE GAME**
```
POST /api/v1/games/:game_id/user/:user_id
```

Params:
```
req.params.user_id
req.params.game_id
```

Body:
```
"data": {
    "title": "newgame",
}
```

---

**DELETE GAME**
```
DELETE /api/v1/games/:game_id/user/:user_id
```

Params:
```
req.params.game_id;
req.params.user_id;
```

---

**LATEST GAMES**
```
POST /mgl_graphql
```

Query:
```
{
  latestGames {
    id
    name,
    image {
      icon_url
      medium_url
      screen_url
    }
    site_detail_url,
    original_release_date,
    platforms {
      name
    }
    deck,
    pictures {
      original_url
    }
    moreInfo {
      genres {
        name
      }
      developers {
        name
      }
    }
  }
}
```

**SEARCH GAMES**
```
POST /mgl_graphql
```

Arguments:
```
query: String!
```

Query:
```
query Query($query: String!) {
  searchGames(query: $query) {
    id,
    guid,
    name,
    image {
      icon_url
      medium_url
      screen_url
    }
    site_detail_url,
    original_release_date,
    platforms {
      name
    }
    deck,
    pictures {
      original_url
    },
    moreInfo {
      genres {
        name
      },
      developers {
        name
      }
    }
  }
}
```