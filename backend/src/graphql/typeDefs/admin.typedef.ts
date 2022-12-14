// import { gql } from "apollo-server-express";
import { gql } from "apollo-server-lambda";

export const adminTypeDef = gql`
    type Admin {
        admin_id: ID!
        name: String!
        email: String!
    }

    type Query {
        getAdminByName(name: String!): Admin!
        getAdmins: [Admin!]!
    }

    type Mutation {
        createAdmin(
            name: String!
            email: String!
        ): Boolean!
        updateAdmin(
            admin_id: ID!
            email: String!
        ): Boolean!
        # Might switch this to delete by name
        removeAdmin(admin_id: ID!): Boolean!
    }
`