/* eslint-disable */
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type List = {
  __typename?: 'List';
  appId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  listItem?: Maybe<ListItem>;
  listItemId?: Maybe<Scalars['String']['output']>;
  listItems?: Maybe<Array<ListItem>>;
  name: Scalars['String']['output'];
  ownerId: Scalars['String']['output'];
  rules?: Maybe<Array<ListSpecRule>>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type ListItem = {
  __typename?: 'ListItem';
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  details?: Maybe<Array<NameValuePair>>;
  id?: Maybe<Scalars['String']['output']>;
  listId?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type ListItemInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  details?: InputMaybe<Array<NameValuePairInput>>;
  name: Scalars['String']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ListSpecRule = {
  __typename?: 'ListSpecRule';
  backing: Scalars['String']['output'];
  backingName: Scalars['String']['output'];
  data?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  prompt: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
  ruleType: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createList?: Maybe<List>;
  createListItem?: Maybe<ListItem>;
  deleteListItem?: Maybe<Scalars['Boolean']['output']>;
  setListRule?: Maybe<Scalars['Boolean']['output']>;
  updateList?: Maybe<Scalars['Boolean']['output']>;
  updateListItem?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationCreateListArgs = {
  listName: Scalars['String']['input'];
};


export type MutationCreateListItemArgs = {
  listId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationDeleteListItemArgs = {
  itemId: Scalars['String']['input'];
  listId: Scalars['String']['input'];
};


export type MutationSetListRuleArgs = {
  backing: Scalars['String']['input'];
  backingName: Scalars['String']['input'];
  data?: InputMaybe<Scalars['String']['input']>;
  listId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  prompt: Scalars['String']['input'];
  required: Scalars['Boolean']['input'];
  ruleType: Scalars['String']['input'];
};


export type MutationUpdateListArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type MutationUpdateListItemArgs = {
  item: ListItemInput;
  itemId: Scalars['String']['input'];
  listId: Scalars['String']['input'];
};

export type NameValuePair = {
  __typename?: 'NameValuePair';
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type NameValuePairInput = {
  name: Scalars['String']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  list?: Maybe<List>;
  listItemById?: Maybe<ListItem>;
  lists?: Maybe<Array<Maybe<List>>>;
  listsById?: Maybe<Array<Maybe<List>>>;
  stats: Scalars['String']['output'];
};


export type QueryListArgs = {
  id: Scalars['String']['input'];
  listItemId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListItemByIdArgs = {
  itemId: Scalars['String']['input'];
  listId: Scalars['String']['input'];
};


export type QueryListsArgs = {
  descending?: InputMaybe<Scalars['Boolean']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListsByIdArgs = {
  ids: Array<Scalars['String']['input']>;
};

export type ListItemsQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ListItemsQuery = { __typename?: 'Query', list?: { __typename?: 'List', id: string, name: string, listItems?: Array<{ __typename?: 'ListItem', id?: string | null, name?: string | null, description?: string | null }> | null } | null };

export type ListsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListsQuery = { __typename?: 'Query', lists?: Array<{ __typename?: 'List', id: string, name: string, listItems?: Array<{ __typename?: 'ListItem', id?: string | null }> | null } | null> | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const ListItemsDocument = new TypedDocumentString(`
    query ListItems($id: String!) {
  list(id: $id) {
    id
    name
    listItems {
      id
      name
      description
    }
  }
}
    `) as unknown as TypedDocumentString<ListItemsQuery, ListItemsQueryVariables>;
export const ListsDocument = new TypedDocumentString(`
    query Lists {
  lists {
    id
    name
    listItems {
      id
    }
  }
}
    `) as unknown as TypedDocumentString<ListsQuery, ListsQueryVariables>;