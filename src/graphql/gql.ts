/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query AllLists {\n    lists {\n      id\n      name\n      listItems {\n        id\n        name\n      }\n    }\n  }\n": typeof types.AllListsDocument,
    "\n  query ListWithItems($id: String!) {\n    list(id: $id) {\n      id\n      name\n      listItems {\n        id\n        name\n      }\n    }\n  }\n": typeof types.ListWithItemsDocument,
    "\n  query SingleListItem($listId: String!, $itemId: String!) {\n    list(id: $listId, listItemId: $itemId) {\n      id\n      name\n      rules {\n        backing\n        backingName\n        data\n        name\n        prompt\n        required\n        ruleType\n      }\n      listItem {\n        id\n        name\n        tags\n        details {\n          name\n          value\n        }\n      }\n    }\n  }\n": typeof types.SingleListItemDocument,
};
const documents: Documents = {
    "\n  query AllLists {\n    lists {\n      id\n      name\n      listItems {\n        id\n        name\n      }\n    }\n  }\n": types.AllListsDocument,
    "\n  query ListWithItems($id: String!) {\n    list(id: $id) {\n      id\n      name\n      listItems {\n        id\n        name\n      }\n    }\n  }\n": types.ListWithItemsDocument,
    "\n  query SingleListItem($listId: String!, $itemId: String!) {\n    list(id: $listId, listItemId: $itemId) {\n      id\n      name\n      rules {\n        backing\n        backingName\n        data\n        name\n        prompt\n        required\n        ruleType\n      }\n      listItem {\n        id\n        name\n        tags\n        details {\n          name\n          value\n        }\n      }\n    }\n  }\n": types.SingleListItemDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AllLists {\n    lists {\n      id\n      name\n      listItems {\n        id\n        name\n      }\n    }\n  }\n"): typeof import('./graphql').AllListsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListWithItems($id: String!) {\n    list(id: $id) {\n      id\n      name\n      listItems {\n        id\n        name\n      }\n    }\n  }\n"): typeof import('./graphql').ListWithItemsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SingleListItem($listId: String!, $itemId: String!) {\n    list(id: $listId, listItemId: $itemId) {\n      id\n      name\n      rules {\n        backing\n        backingName\n        data\n        name\n        prompt\n        required\n        ruleType\n      }\n      listItem {\n        id\n        name\n        tags\n        details {\n          name\n          value\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').SingleListItemDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
