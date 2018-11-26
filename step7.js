const express = require("express");
const cors = require("cors");
const { ApolloServer, gql } = require("apollo-server-express");
const uuid = require("uuid");

const app = express();

app.use(cors());

const schema = gql`
  type Query {
    me: Student
  }
  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
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

let students = {
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

const me = students[1];

let messages = {
  1: {
    id: "1",
    text: "Hello",
    studentId: "1"
  },
  2: {
    id: "2",
    text: "Hello",
    studentId: "2"
  }
};

const resolvers = {
  Query: {
    me: (parent, args, { me }) => {
      return me;
    }
  },

  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuid();
      const message = {
        id,
        text,
        studentId: me.id
      };
      messages[id] = message;
      students[me.id].messageIds.push(id);
      return message;
    },
    deleteMessage: (parent, { id }) => {
      const { [id]: message, ...otherMessages } = messages;
      if (!message) {
        return false;
      }
      messages = otherMessages;
      return true;
    }
  },

  Student: {
    messages: student => {
      return Object.values(messages).filter(
        message => message.studentId === student.id
      );
    }
  },

  Message: {
    student: message => {
      return students[message.studentId];
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
