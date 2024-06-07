import React, { useEffect, useState, Suspense } from 'react';
import { useQuery, useSuspenseQuery, gql } from '@apollo/client';

const GET_DATA = gql`
  query GetData {
    me {
        id
        username
    }
    ...  @defer {
        topUserProducts {
            name
            price
            upc
            weight
        }
    }
    ... @defer {
        users {
            id
            username
        }
    }
  }
`;

function App() {
    const result = useQuery(GET_DATA);

    const { data, loading, error, observable } = result;
    const partialLoading = observable.getCurrentResult().partial;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error! {error.message}</div>;

    return (
        <div>
            <h2>Users</h2>
            <ul>
                ID: {data.me?.id}
                User: {data.me?.username}
            </ul>

            <h2>Products</h2>
                {partialLoading && !data.topUserProducts && <div>Loading more data...</div>}
                <table>
                    {data.topUserProducts?.map(product => (
                        <tr key={product.upc}>
                            <td>{product.name}</td>
                            <td>{product.upc}</td>
                            <td>{product.price}</td>
                            <td>{product.weight}</td>
                        </tr>
                    ))}
                </table>
            <h2>Users</h2>
            <table>
                {partialLoading && !data.users && <div>Loading more data...</div>}
                {data.users?.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
}

export default App;
