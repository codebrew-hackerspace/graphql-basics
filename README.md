# Gr

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
  type Student {
    name: String!
  }
`;

```

The exclamation mark after ```String``` above means that it is nonullable, and the ```gql``` tag in the beginning allows it to be parsed as graphql. 

## Interacting with the schema

There are three types of interactions: querries, mutations, and subscirptions. 

### Querries







