
import { gql } from "apollo-server-core";
import createApolloServer from "../../graphql/createApolloServer";
import { getAdminByName, createAdmin, updateAdmin, removeAdmin  } from "../mock-data/adminData";



it("Get an admin by name", async () => {
    const apolloServer = createApolloServer();

    const res = await apolloServer.executeOperation({
        query: gql`
            query GetAdminByName($name: String!) {
                getAdminByName(name: $name) {
                    name
                    email
                }
            }
        `,
        variables: getAdminByName
    });
    expect(res.data?.getAdminByName.name).toEqual(getAdminByName.name);
    expect(res.errors).toBeUndefined(); 
    apolloServer.stop();
})

it("Create an admin", async () => {
    const apolloServer = createApolloServer();

    const res = await apolloServer.executeOperation({
        query: gql`
            mutation CreateAdmin($name: String!, $email: String!) {
                createAdmin(name: $name, email: $email)
            }
        `,
        variables: createAdmin
    });
    expect(res.data?.createAdmin).toEqual(true);
    expect(res.errors).toBeUndefined();
    apolloServer.stop();
});

it("Update an admin", async () => {
    const apolloServer = createApolloServer();

    const res = await apolloServer.executeOperation({
        query: gql`
            mutation UpdateAdmin($adminId: ID!, $name: String!, $email: String!) {
                updateAdmin(admin_id: $adminId, name: $name, email: $email)
            }
        `,
        variables: updateAdmin
    });
    expect(res.data?.updateAdmin).toEqual(true);
    expect(res.errors).toBeUndefined();
    apolloServer.stop();
});

it("Remove an admin", async () => {
    const apolloServer = createApolloServer();

    const res = await apolloServer.executeOperation({
        query: gql`
            mutation RemoveAdmin($adminId: ID!) {
                removeAdmin(admin_id: $adminId)
            }
        `,
        variables: removeAdmin
    });
    expect(res.data?.removeAdmin).toEqual(true);
    expect(res.errors).toBeUndefined();
    apolloServer.stop();
});