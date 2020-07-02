const { buildSchema } = require('graphql');

const latestGamesSchema = buildSchema(`
  type Image {
    icon_url: String,
    medium_url: String,
    screen_url: String
  },
  type Platform {
    name: String
  },
  type LatestGame {
    id: String!,
    name: String,
    image: Image,
    site_detail_url: String,
    original_release_date: String,
    platforms: [Platform],
    deck: String
  },
  type Query {
    latestGames: [LatestGame]    
  }
`);

//  const latestGamesSchema = buildSchema(`
//   type Product {
//     name: String,
//     id: Int
//   },
//   type Query {
//     hello: String,
//     products: [Product]
//   }
// `);

module.exports = latestGamesSchema;
