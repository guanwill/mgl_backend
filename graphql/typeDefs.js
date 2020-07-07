const typeDefs = `
  type Image {
    icon_url: String,
    medium_url: String,
    screen_url: String
  },
  type Platform {
    name: String
  },
  type Picture {
    original_url: String,
  }
  type Genre {
    name: String,
  }
  type Developer {
    name: String,
  }
  type MoreInfo {
    genres: [Genre],
    developers: [Developer]
  }
  type GamesResponse {
    id: String!,
    guid: String,
    name: String,
    image: Image,
    site_detail_url: String,
    original_release_date: String,
    platforms: [Platform],
    deck: String,
    pictures: [Picture],
    moreInfo: MoreInfo
  },
  type Query {
    latestGames: [GamesResponse],
    searchGames(query: String!): [GamesResponse]
  }
`;

module.exports = typeDefs;
