export type IsEditable = string | string[] | { [key: string]: string };

export type CanMakeEditable = Record<string, IsEditable>;

interface EditableField<T> {
  t: "f";
  value: string;
}

interface EditableFieldF<T> extends EditableField<T> {
  setValue: (newValue: string) => AsEditableRootF<T>;
}

interface EditableListItem<T> {
  t: "li";
  value: string;
  id: symbol;
}

interface EditableListItemF<T> extends EditableListItem<T> {
  setValue: (newValue: string) => AsEditableRootF<T>;
  remove: () => AsEditableRootF<T>;
}

export interface EditableList<T> {
  t: "l";
  list: Array<EditableListItem<T>>;
}

export interface EditableListF<T> extends EditableList<T> {
  list: Array<EditableListItemF<T>>;
  addValue: (newValue: string) => AsEditableRootF<T>;
  swapByIndex: (index1: number, index2: number) => AsEditableRootF<T>;
  swapById: (id1: symbol, id2: symbol) => AsEditableRootF<T>;
}

interface EditableObject<T> {
  t: "o";
  keys: string[];
  value: Record<string, string>;
}

interface EditableObjectF<T> extends EditableObject<T> {
  addField: (key: string, value: string) => AsEditableRoot<T>;
  removeField: (key: string) => AsEditableRoot<T>;
  setField: (key: string, value: string) => AsEditableRoot<T>;
}

type AsEditable<T> = {
  [K in keyof T]: T[K] extends Array<string>
    ? EditableList<T>
    : T[K] extends Record<string, string>
      ? EditableObject<T>
      : EditableField<T>;
};

type AsEditableF<T> = {
  [K in keyof T]: T[K] extends Array<string>
    ? EditableListF<T>
    : T[K] extends Record<string, string>
      ? EditableObjectF<T>
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

type EditableItem<T> = EditableList<T> | EditableObject<T> | EditableField<T>;

function IsDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function makeEditable<T extends CanMakeEditable>(
  target: T,
): AsEditableRootF<T> {
  // const editable: AsData<T> = Object.entries(target).reduce((acc, [key, value]) => {
  //   if (typeof value === 'string') {
  const entries = Object.entries(target) as [string, IsEditable][];
  const entriesAsData: [string, EditableItem<T>][] = entries.map(
    ([key, value]) => {
      if (typeof value === "string") {
        const field: EditableField<T> = {
          t: "f",
          value,
        };
        return [key, field];
        // return [key, { value }];
      }

      if (
        Array.isArray(value) &&
        value.every((item) => typeof item === "string")
      ) {
        const list: EditableList<T> = {
          t: "l",
          list: value.map((item) => ({
            t: "li",
            value: item,
            id: Symbol(),
          })),
        };
        return [key, list];
      }

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const obj: EditableObject<T> = {
          t: "o",
          keys: Object.keys(value),
          value: { ...value },
        };
        return [key, obj];
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
  // console.log("editable.__isProxy:", editable.__isProxy);

  const root = editable.__isProxy ? editable[rootKey] : editable;

  // if (root === editable) {
  //   console.log("Using root directly:", root, root.__isProxy);
  // } else {
  //   console.log("Using root from editable:", root, root.__isProxy);
  // }

  const entries = Object.entries(root) as [string, EditableItem<T>][];
  // console.log("entries:", entries);
  const mappedEntries = entries
    .map(([key, value]) => {
      if (value.t === "f") {
        return [key, value.value] as [string, string];
      }
      if (value.t === "l") {
        return [key, value.list.map((item) => item.value)] as [
          string,
          string[],
        ];
      }
      if (value.t === "o") {
        return [key, value.value] as [string, Record<string, string>];
      }
      // throw new Error(`Unsupported type for key "${key}": ${String((value as any)?.t)}`);
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
          lookup as EditableField<T>,
          makePropertyProxyHandler(root, key),
        ) as EditableFieldF<T>;
      }

      if (lookup.t === "l") {
        return new Proxy(
          lookup as EditableList<T>,
          makeListProxyHandler(root, key),
        );
      }

      if (lookup.t === "o") {
        return lookup;
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
            const index = Number(itemProp);
            if (!Number.isNaN(index)) {
              return new Proxy(
                list[index],
                makeListItemProxyHandler(root, path, index),
              );
            }
            const item = list[index];
            if (item) {
              return new Proxy(
                item,
                makeListItemProxyHandler(root, path, index),
              );
            }
            return undefined;
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
  index: number,
): ProxyHandler<EditableListItemF<T>> {
  return {
    get(target, prop) {
      // console.log(`Accessing property: ${String(prop)}`);

      if (prop === "value") {
        return target.value;
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
