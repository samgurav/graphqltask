import express from "express";
import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { quote, data } from "./db.js";
const app = express();

const typeDefs = gql`
  type Query {
    greet: [User]
    user(id: ID!): User
    quote: [Quote]
  }

  type User {
    id: ID!
    name: String
    age: String
    quote: [Quote]
  }
  type Quote {
    name: String
    by: ID
  }
`;

const resolvers = {
  Query: {
    greet: () => data,
    user: (_, args) => data.find((user) => user.id == args.id),
    quote: () => quote,
  },
  User: {
    quote: (ur) => quote.filter((quote) => quote.by == ur.id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then(({ url }) => {
  console.log(`running on ${url}`);
});
