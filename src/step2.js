const express = require("express");
const cors = require("cors");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();

app.use(cors());


const teachers = {
    1: {
      id: '1',
      name: 'Aria',
    },
    2: {
      id: '2',
      name: 'Emily',
    },
  };
  
  const schema = gql`
    type Query {
      me: Teacher
      teacher(id: ID!): Teacher
    }
  
    type Teacher {
      id: ID!
      name: String!
    }
  `;
  
  const resolvers = {
    Query: {
      me: () => {
        return teachers[1];
      },
      teacher: (parents, {id}) => {
        return teachers[id];
      },
    },
  };


const server = new ApolloServer({
    typeDefs: schema,
    resolvers
  });
  
  server.applyMiddleware({ app, path: "/graphql" });
  
  app.listen({ port: 8000 }, () => {
    console.log("Apollo Server on http://localhost:8000/graphql");
  });
  