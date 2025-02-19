import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      user {
        name
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($name: String!, $email: String!) {
    insert_users(objects: { name: $name, email: $email }) {
      returning {
        id
        name
        email
      }
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($user_id: uuid!, $title: String!, $content: String!) {
    insert_posts(
      objects: { user_id: $user_id, title: $title, content: $content }
    ) {
      returning {
        id
        title
        content
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: uuid!) {
    delete_users(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: uuid!) {
    delete_posts(where: { id: { _eq: $id } }) {
      returning {
        id
      }
    }
  }
`;

export const USER_SUBSCRIPTION = gql`
  subscription UserSubscription {
    users {
      id
      name
      email
    }
  }
`;

export const POST_SUBSCRIPTION = gql`
  subscription PostSubscription {
    posts {
      id
      title
      content
      user {
        name
      }
    }
  }
`;