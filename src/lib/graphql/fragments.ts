import { gql } from '@apollo/client';

// Fragment for Comment fields - reusable across queries and mutations
export const COMMENT_FIELDS = gql`
  fragment CommentFields on Comment {
    id
    body
    user {
      name
      email
    }
    votes {
      value
      user {
        id
      }
    }
  }
`;

// Fragment for nested replies (which are also Comments)
export const COMMENT_WITH_REPLIES = gql`
  fragment CommentWithReplies on Comment {
    ...CommentFields
    replies {
      ...CommentFields
    }
  }
  ${COMMENT_FIELDS}
`;

// Fragment for Post fields
export const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    title
    body
    user {
      name
      email
    }
    votes {
      value
      user {
        id
      }
    }
    comments {
      ...CommentWithReplies
    }
  }
  ${COMMENT_WITH_REPLIES}
`;

// Fragment for Subbluedit fields
export const SUBBLUEDIT_FIELDS = gql`
  fragment SubblueditFields on Subbluedit {
    id
    name
    description
    user {
      name
      email
    }
    posts {
      ...PostFields
    }
  }
  ${POST_FIELDS}
`;
