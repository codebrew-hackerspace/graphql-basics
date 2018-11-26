const express = require("express");
const cors = require("cors");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();

app.use(cors());

const students = {
  1: {
    id: "1",
    name: "Aria",
    messageIds: [1]
  },
  2: {
    id: "2",
    name: "Emily",
    messageIds: [2]
  }
};

let messages = {
  1: {
    id: "1",
    text: "Hello World",
    studentId: "1"
  },
  2: {
    id: "2",
    text: "By World",
    studentId: "2"
  }
};

const schema = gql`
  type Query {
    me: Student
    student(id: ID!): Student
    students: [Student!]
    messages: [Message!]!
    message(id: ID!): Message!
  }
  type Student {
    id: ID!
    name: String!
    messages: [Message!]
  }
  type Message {
    id: ID!
    text: String!
    student: Student!
  }
`;

const resolvers = {
  Query: {
    me: (parent, args, { me }) => {
      return me;
    },
    student: (parents, { id }) => {
      return students[id];
    },
    students: () => {
      return Object.values(students);
    },
    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id }) => {
      return messages[id];
    }
  },
  Message: {
    student: message => {
      return students[message.studentId];
    }
  },
  Student: {
    messages: student => {
      return Object.values(messages).filter(
        message => message.studentId === student.id
      );
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: students[1]
  }
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
