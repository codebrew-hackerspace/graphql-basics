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

let students = {
  1: {
    id: "1",
    name: "Annika",
    teacherId: "1"
  },
  2: {
    id: "2",
    name: "Cammie",
    teacherId: "2"
  }
};

const schema = gql`
  type Query {
    me: Teacher
    teacher(id: ID!): Teacher
    teachers: [Teacher!]
    students: [Student!]!
    student(id: ID!): Student!
  }
  type Teacher {
    id: ID!
    name: String!
  }
  type Student {
    id: ID!
    name: String!
    teacher: Teacher!
  }
`;

const resolvers = {
  Query: {
    me: (parent, args, { me }) => {
      return me;
    },
    teacher: (parents, { id }) => {
      return teachers[id];
    },
    teachers: () => {
      return Object.values(teachers);
    },
    students: () => {
      return Object.values(students);
    },
    student: (parent, { id }) => {
      return students[id];
    }
  },
  Student: {
    teacher: student => {
      return teachers[student.teacherId];
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
