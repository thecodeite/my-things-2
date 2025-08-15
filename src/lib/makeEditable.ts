export interface WithMetadata {
  value: string;
  meta: Record<string, string>;
}

export type IsEditable = string | string[] | WithMetadata[];

export type CanMakeEditable = Record<string, IsEditable>;

interface EditableField {
  t: "f";
  value: string;
}

interface EditableFieldF<T> extends EditableField {
  setValue: (newValue: string) => AsEditableRootF<T>;
}

interface EditableListItem {
  t: "li";
  value: string;
  id: symbol;
  meta: Record<string, string>;
}

interface EditableListItemF<T> extends EditableListItem {
  setValue: (newValue: string) => AsEditableRootF<T>;
  remove: () => AsEditableRootF<T>;
}

const hasMetadataFlag = Symbol("hasMetadataFlag");

export interface EditableList {
  t: "l";
  list: Array<EditableListItem>;
  [hasMetadataFlag]: boolean;
}

export interface EditableListF<T> extends EditableList {
  list: Array<EditableListItemF<T>>;
  addValue: (newValue: string) => AsEditableRootF<T>;
  swapByIndex: (index1: number, index2: number) => AsEditableRootF<T>;
  swapById: (id1: symbol, id2: symbol) => AsEditableRootF<T>;
}

const noMetadata = {};

type AsEditable<T> = {
  [K in keyof T]: T[K] extends Array<string> | Array<WithMetadata>
    ? EditableList
    : EditableField;
};

type AsEditableF<T> = {
  [K in keyof T]: T[K] extends Array<string> | Array<WithMetadata>
    ? EditableListF<T>
    : EditableFieldF<T>;
};

export const iterationId = Symbol("iterationId");

const rootKey = Symbol("rootKey");
const onChangeHandlersKey = Symbol("onChangeHandlersKey");

type AsEditableRoot<T> = AsEditable<T> & {
  [iterationId]: number;
  [onChangeHandlersKey]: Array<OnChangeHandler<T>>;
  __isProxy: false;
};

type OnChangeHandler<T> = (newData: AsEditableRootF<T>) => void;

export type AsEditableRootF<T> = AsEditableF<T> & {
  [iterationId]: number;
  [rootKey]: AsEditableRoot<T>;
  [onChangeHandlersKey]: Array<OnChangeHandler<T>>;
  __isProxy: true;
};

type EditableItem = EditableList | EditableField;

function IsDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function makeEditable<T extends CanMakeEditable>(
  target: T,
): AsEditableRootF<T> {
  const entries = Object.entries(target) as [string, IsEditable][];
  const entriesAsData: [string, EditableItem][] = entries.map(
    ([key, value]) => {
      if (typeof value === "string") {
        const field: EditableField = {
          t: "f",
          value,
        };
        return [key, field];
      }

      if (
        Array.isArray(value) &&
        value.every((item) => typeof item === "string")
      ) {
        const list: EditableList = {
          t: "l",
          [hasMetadataFlag]: false,
          list: value.map((item) => ({
            t: "li",
            value: item,
            id: Symbol(),
            meta: noMetadata,
          })),
        };
        return [key, list];
      }

      if (
        Array.isArray(value) &&
        value.every((item) => typeof item === "object" && item !== null)
      ) {
        const list: EditableList = {
          t: "l",
          [hasMetadataFlag]: true,
          list: value.map((item) => ({
            t: "li",
            value: item.value,
            id: Symbol(),
            meta: item.meta,
          })),
        };
        return [key, list];
      }

      throw new Error(`Unsupported type for key "${key}": ${typeof value}`);
    },
  );

  const withExtras = [
    ...entriesAsData,
    [iterationId, 0] as [typeof iterationId, number],
    [onChangeHandlersKey, []] as [
      typeof onChangeHandlersKey,
      Array<OnChangeHandler<T>>,
    ],
    ["__isProxy", false] as const,
  ];

  const data = Object.fromEntries(withExtras) as AsEditableRoot<T>;

  return makeRootProxy<T>(data);
}

export function unmakeEditable<T extends CanMakeEditable>(
  editable: AsEditableRootF<T> | AsEditableRoot<T>,
): T {
  const root = editable.__isProxy ? editable[rootKey] : editable;

  // if (root === editable) {
  //   console.log("Using root directly:", root, root.__isProxy);
  // } else {
  //   console.log("Using root from editable:", root, root.__isProxy);
  // }

  const entries = Object.entries(root) as [string, EditableItem][];

  const mappedEntries = entries
    .map(([key, value]) => {
      if (value.t === "f") {
        return [key, value.value] as [string, string];
      }
      if (value.t === "l") {
        if (value[hasMetadataFlag]) {
          return [
            key,
            value.list.map((item) => ({
              value: item.value,
              meta: item.meta,
            })),
          ] as [string, WithMetadata[]];
        }
        // If no metadata, return just the values
        return [key, value.list.map((item) => item.value)] as [
          string,
          string[],
        ];
      }
    })
    .filter(IsDefined);

  return Object.fromEntries(mappedEntries);
}

export function attachOnChange<T>(
  editable: AsEditableRootF<T>,
  callback: (newData: AsEditableRootF<T>) => void,
): () => void {
  const root = editable[rootKey];
  //console.log("root:", root);
  const handlers = root[onChangeHandlersKey];
  if (!handlers) {
    throw new Error("No onChange handlers found on the editable object.");
  }
  handlers.push(callback);

  return () => {
    const index = handlers.indexOf(callback);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  };
}

function makeRootProxy<T extends CanMakeEditable>(
  root: AsEditableRoot<T>,
): AsEditableRootF<T> {
  const handler: ProxyHandler<AsEditableRootF<T>> = {
    get(_, prop) {
      if (prop === iterationId) {
        return root[iterationId];
      }
      if (prop === rootKey) {
        return root;
      }
      if (prop === onChangeHandlersKey) {
        throw new Error(
          `Accessing "${String(onChangeHandlersKey)}" directly is not allowed. Use attachOnChange instead.`,
        );
      }

      if (typeof prop === "symbol") {
        return root[prop as keyof AsEditableRoot<T>];
      }

      if (prop === "__isProxy") {
        return true;
      }

      if (prop === "toJSON") {
        return () => unmakeEditable<T>(root);
      }

      const key = prop as keyof AsEditableF<T>;
      const lookup = root[key];
      if (lookup === undefined) {
        throw new Error(
          `Property "${String(prop)}" does not exist on target object.`,
        );
      }

      if (lookup.t === "f") {
        return new Proxy(
          lookup as EditableField,
          makePropertyProxyHandler(root, key),
        ) as EditableFieldF<T>;
      }

      if (lookup.t === "l") {
        return new Proxy(
          lookup as EditableList,
          makeListProxyHandler(root, key),
        );
      }

      throw new Error(
        `Unsupported type for key "${String(prop)}": ${String((lookup as { t: string })?.t)}`,
      );
    },
  };

  const access = new Proxy(root as unknown as AsEditableRootF<T>, handler);

  const handlers = root[onChangeHandlersKey] || [];

  for (const handler of handlers) {
    handler(access);
  }

  return access;
}

function makePropertyProxyHandler<T extends CanMakeEditable>(
  root: AsEditableRoot<T>,
  path: keyof AsEditable<T>,
): ProxyHandler<EditableFieldF<T>> {
  return {
    get(target, prop) {
      // console.log(`Accessing property: ${String(prop)}`);

      if (prop === "value") {
        return target.value;
      }

      if (prop === "setValue") {
        return (newValue: string) => {
          // console.log(`Setting value at path ${String(path)} to: ${newValue}`);

          const newRoot = {
            ...root,
            [path]: {
              ...target,
              value: newValue,
            },
            [iterationId]: root[iterationId] + 1,
          } as AsEditableRoot<T>;

          return makeRootProxy(newRoot);
        };
      }
    },
  };
}

function makeListProxyHandler<T extends CanMakeEditable>(
  root: AsEditableRoot<T>,
  path: keyof AsEditable<T>,
): ProxyHandler<EditableListF<T>> {
  return {
    get(target, prop) {
      // console.log(`Accessing property: ${String(prop)}`);

      if (prop === "list") {
        return new Proxy(target.list, {
          get(list, itemProp) {
            if (itemProp === "length") {
              return list.length;
            }
            // TODO: whats going on here?
            const index = Number(itemProp);
            if (!Number.isNaN(index)) {
              return new Proxy(
                list[index],
                makeListItemProxyHandler(root, path),
              );
            }

            return Reflect.get(list, itemProp);
          },
        });
      }

      if (prop === "addValue") {
        return (newValue: string) => {
          // console.log(`Adding value at path ${String(path)} to: ${newValue}`);

          const newRoot = {
            ...root,
            [path]: {
              ...target,
              list: [
                ...target.list,
                {
                  t: "li",
                  value: newValue,
                  id: Symbol(),
                },
              ],
            },
            [iterationId]: root[iterationId] + 1,
          } as AsEditableRoot<T>;

          return makeRootProxy(newRoot);
        };
      }

      if (prop === "swapByIndex") {
        return (index1: number, index2: number) => {
          // console.log(
          // //   `Swapping items at indices ${index1} and ${index2} at path ${String(path)}`,
          // );

          const newList = [...target.list];
          [newList[index1], newList[index2]] = [
            newList[index2],
            newList[index1],
          ];

          const newRoot = {
            ...root,
            [path]: {
              ...target,
              list: newList,
            },
            [iterationId]: root[iterationId] + 1,
          } as AsEditableRoot<T>;

          return makeRootProxy(newRoot);
        };
      }

      if (prop === "swapById") {
        return (id1: symbol, id2: symbol) => {
          // console.log(
          //   `Swapping items with ids ${id1.toString()} and ${id2.toString()} at path ${String(path)}`,
          // );

          const newList = [...target.list];
          const index1 = newList.findIndex((item) => item.id === id1);
          const index2 = newList.findIndex((item) => item.id === id2);
          [newList[index1], newList[index2]] = [
            newList[index2],
            newList[index1],
          ];

          const newRoot = {
            ...root,
            [path]: {
              ...target,
              list: newList,
            },
            [iterationId]: root[iterationId] + 1,
          } as AsEditableRoot<T>;

          return makeRootProxy(newRoot);
        };
      }

      throw new Error(`Unsupported operation: ${String(prop)}`);
    },
  };
}

function makeListItemProxyHandler<T extends CanMakeEditable>(
  root: AsEditableRoot<T>,
  path: keyof AsEditable<T>,
): ProxyHandler<EditableListItemF<T>> {
  return {
    get(target, prop) {
      // console.log(`Accessing property: ${String(prop)}`);

      if (prop === "value") {
        return target.value;
      }

      if (prop === "meta") {
        return target.meta;
      }

      if (prop === "id") {
        return target.id;
      }

      if (prop === "setValue") {
        return (newValue: string) => {
          // console.log(
          //   `Setting value at path ${String(path)}[${index}] to: ${newValue}`,
          // );

          const oldListContainer = root[path] as EditableListF<T>;
          const newList = oldListContainer.list.map((item) =>
            item.id === target.id ? { ...item, value: newValue } : item,
          );

          const newRoot = {
            ...root,
            [path]: {
              ...oldListContainer,
              list: newList,
            },
            [iterationId]: root[iterationId] + 1,
          } as AsEditableRoot<T>;

          return makeRootProxy(newRoot);
        };
      }

      if (prop === "remove") {
        return () => {
          // console.log(`Removing item at path ${String(path)}[${index}]`);

          const oldListContainer = root[path] as EditableListF<T>;
          const newList = oldListContainer.list.filter(
            (item) => item.id !== target.id,
          );

          const newRoot = {
            ...root,
            [path]: {
              ...oldListContainer,
              list: newList,
            },
            [iterationId]: root[iterationId] + 1,
          } as AsEditableRoot<T>;

          return makeRootProxy(newRoot);
        };
      }

      throw new Error(`Unsupported operation: ${String(prop)}`);
    },
  };
}
