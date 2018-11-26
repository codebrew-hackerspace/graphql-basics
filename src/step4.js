const express = require("express");
const cors = require("cors");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();

app.use(cors());

const teachers = {
  1: {
    id: "1",
    name: "Aria"
  },
  2: {
    id: "2",
    name: "Emily"
  }
};

const schema = gql`
  type Query {
    me: Teacher
    teacher(id: ID!): Teacher
    teachers: [Teacher!]
  }
  type Teacher {
    id: ID!
    name: String!
  }
`;

const resolvers = {
  Query: {
    me: (parent, args, { me }) => {
      return me;
    },
    teacher: (parents, {id}) => {
      return teachers[id];
    },
    teachers: () => {
      return Object.values(teachers);
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: teachers[1]
  }
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
