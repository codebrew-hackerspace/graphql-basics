# Graphql

GraphQL is query language, a middle layer that defines the API between the front end and backend. It is a way of querying the data you need in a concise, clean manner.

# Motivation

A web api is a protocol for interfacing between the client and the server. The current most-commonly used protocol today is REST, in which theyre a multiple types of requests such as get, put, post, and delete which contain headers and a body. This allows it to send and recieve the necessary information for the client and server to interface and send eachother the necessary information.

As the application scales though, the API needs to accomodate many requests that all do very specific things. Developers dealt with this with two ways:

1. Having many very specific routes, but makes the code difficult to maintain as the api evolves and the client and servr side both have to stay in sync.

2. Having general endpoints that can be used for multipl purposes, but send and recieve more data than necessary.

Graphql is a protocol that solves this my deisgning a query language that allows you to pprecisely describe what you wanted to do. It also provides a single endpoint in which the clinet can communicate easily what it needs to do.

## Defining the Schema

The schema is a model of the data that describes the structure of the data and the relationships in between them.

For instance, if we wanted to define a student with a name, we would define it as a type.

```javascript
const schema = gql`
  type Teacher {
    name: String!
  }
`;
```

The exclamation mark after `String` above means that it is nonullable, and the `gql` tag in the beginning allows it to be parsed as graphql.

## Interacting with the schema

There are three types of interactions: querries, mutations, and subscirptions.

### Querries

Inside of schema, along with teh type definitions

The schema consists of type definitions and a top level query type for reading the data. This defines the type of querries you can make to get data. For every query listed, there is a corresponding resolver that defines how it should be parsed.

#### Example 1 Basic Query

For instance, in the example below there is a query called me which resolves to a student type, which has to have a name field. In the resolver. it is set to resolve the Student to `Aria Malkani`.

```javascript
const schema = gql`
  type Query {
    me: Teacher
  }

  type Teacher {
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
```

##### Running Example 1

Running Instructions: `npm run step1`
Example code: step1.js

Query to be executed

```graphql
{
  me {
    name
  }
}
```

#### Example 2 Query with arguments

We can also have querries with arguments. For instance,

```Javascript
const schema = gql`
  type Query {
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
```

In this case, the resolved for student can parse arguments passed into the query, which allows you to query a specific id. This allows you to query for specific stdents pased on unique identifiers.

In this case, we are also assuming the "me" is the first student in the list, and so we return just that one. As long as what is returned matches the Student type, graphql can compile and execute the query.

##### Running Example 2

Running Instructions: `npm run step2`
Example code: step2.js

Query to be executed

```graphql
{
  teacher(id: "2") {
    name
  }
  me {
    name
  }
}
```

#### Example 3: Query with multiple values returned

By setting the return type as `[Student!]` we are expeting a list of student types where none of the students are null. The resolver takes the list of students and returns it in this format.

```Javascript
const schema = gql`
  type Query {
    teachers: [Teacher!]
  }
  type Teacher {
    id: ID!
    name: String!
  }
`;

const resolvers = {
  Query: {
    teachers: () => {
      return Object.values(teachers);
    },
  }
};
```

##### Running Example 3

Running Instructions: `npm run step3`
Example code: step3.js

Query to be executed

```graphql
{
  teachers {
    id
    name
  }
}
```

#### Example 4: Using context

In the server definition we can give it context, and use that in the querries. In the query resolver, you can access data from four possible places `(parent, args, context, info) => { ... }`. We can define the context when we set up the server, and then access values from there.

```Javascript
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: teachers[1],
  },
});

const resolvers = {
  Query: {
    me: (parent, args, { me }) => {
      return me;
    },
  },
};

```

##### Running Example 4

Running Instructions: `npm run step4`
Example code: step4.js

Query to be executed

```graphql
{
  me {
    name
    id
  }
}
```

## Example 5 Type Relationships 

We can write a resolver so that every teacher has an associated Student. We do this by creating a messgae type in which one of the fields is a STudent. The resolver currently goes to the teacher, looks at the students id, and gets the correspodning student. When you run teh example query, it is now able to map to a student object with all of it's fields. 

```Javascript
const schema = gql`
  type Query {
    me: Teacher
  }
  type Teacher {
    id: ID!
    name: String!
  }
  type Student {
    id: ID!
    text: String!
    teacher: Teacher!
  }
`;

const resolvers = {
  Student: {
    teacher: student => {
      return teachers[student.id];
    },
  },
};  
```

##### Running Example 5

Running Instructions: `npm run step5`
Example code: step5.js

Query to be executed

```graphql
{
  message(id: "1") {
    id
    text
    student {
      id
      name
    }
  }
}
```


## Example 6 Two way type relationships

We can also have each student have a list of associated messages. By adding a list of message ids to the student type, where each message id corresponds to a message, we can access the message object. 

```Javascript 
const schema = gql`
  type Query {
    me: Student
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
  Student: {
    messages: student => {
      return Object.values(messages).filter(
        message => message.studentId === student.id,
      );
    },
  },
};
```


##### Running Example 6

Running Instructions: `npm run step6`
Example code: step6.js

Query to be executed

```graphql
{
  me {
    name
    id
    messages {
      id
      text
      student {
        name
      }
    }
  }
}
```


## Example 6 Mutations


Currently we have gone over querries, which allow you to access the data. Mutations, on the other hand, allow you to modify the data. In this example, we are going to write mutations to add and delete students. 


```Javascript
const schema = gql`
  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }
`;
const resolvers = {
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
};

```

##### Running Example 7

Running Instructions: `npm run step7`
Example code: step7.js

To query the student
```graphql
{
  me {
     name
    messages {
      text
      id
    }
  }
}
```

To create a message 
```graphql
mutation m {
  createMessage(text:"hi") {
    text
    student {
      name
    }
  }
}
```

To delete a message, but instead change the id to the id of the correct message you want to delete
```graphql
mutation m {
  deleteMessage(id:"48608df0-6c11-43b5-bc98-26cd7e586e4b") 
}
```