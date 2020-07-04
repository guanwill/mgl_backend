const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Image {
    icon_url: String,
    medium_url: String,
    screen_url: String
  },
  type Platform {
    name: String
  },
  type GamesResponse {
    id: String!,
    name: String,
    image: Image,
    site_detail_url: String,
    original_release_date: String,
    platforms: [Platform],
    deck: String
  },
  type Query {
    latestGames: [GamesResponse],
    searchGames(query: String!): [GamesResponse]
  }
`);

module.exports = schema;