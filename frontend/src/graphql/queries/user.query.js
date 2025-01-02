import {gql} from '@apollo/client'

export const GET_AUTHENTICATED_USER = gql `
    query GetAuthenticatedUser {
        authUser{
            _id,
            username,
            name,
            profilePicture
        }
    }
`

export const GET_USER_AND_TRANSACTION = gql `
  query GetUserAndTransactions($userId:ID!){
    user(userId:$userId){
        _id,
        username,
        name,
        profilePicture,
        #relationShips
        transactions{
            _id,
            description,
            paymentType,
            amount,
            category,
            location,
            date
        }
 }
  }
`