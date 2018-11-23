const express = require("express");
const cors = require("cors");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();

app.use(cors());


const students = {
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
      me: Student
      student(id: ID!): Student
    }
  
    type Student {
      id: ID!
      name: String!
    }
  `;
  
  const resolvers = {
    Query: {
      me: () => {
        return students[1];
      },
      student: (parents, {id}) => {
        return students[id];
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
  