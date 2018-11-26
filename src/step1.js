const express = require("express");
const cors = require("cors");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();

app.use(cors());

const schema = gql`
  type Query {
    me: Student
  }

  type Student {
    name: String!
  }
`;

const resolvers = {
  Query: {
    me: () => {
      return {
        name: "Aria Malkani"
      };
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
