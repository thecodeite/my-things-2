export type MetaDefault = Record<string, string>;

export interface WithMetadata<M> {
  value: string;
  meta: M;
}

export type IsEditable<M> =
  | string
  | WithMetadata<M>
  | string[]
  | WithMetadata<M>[];

export type CanMakeEditable<M> = Record<string, IsEditable<M>>;

interface EditableField<M> {
  t: "f";
  value: string;
  meta?: M;
}

interface EditableFieldF<T, M> extends EditableField<M> {
  setValue: (newValue: string) => AsEditableRootF<T, M>;
}

interface EditableListItem<M> {
  t: "li";
  value: string;
  id: symbol;
  meta?: M;
}

interface EditableListItemF<T, M> extends EditableListItem<M> {
  setValue: (newValue: string) => AsEditableRootF<T, M>;
  remove: () => AsEditableRootF<T, M>;
}

const hasMetadataFlag = Symbol("hasMetadataFlag");

export interface EditableList<M> {
  t: "l";
  list: Array<EditableListItem<M>>;
  [hasMetadataFlag]: boolean;
}

export interface EditableListF<T, M> extends EditableList<M> {
  list: Array<EditableListItemF<T, M>>;
  addValue: (newValue: string) => AsEditableRootF<T, M>;
  swapByIndex: (index1: number, index2: number) => AsEditableRootF<T, M>;
  swapById: (id1: symbol, id2: symbol) => AsEditableRootF<T, M>;
}

type AsEditable<T, M> = {
  [K in keyof T]: T[K] extends
    | Array<string>
    | Array<WithMetadata<M>>
    | []
    | readonly []
    ? EditableList<M>
    : EditableField<M>;
};

export type AsEditableF<T, M> = {
  [K in keyof T]: T[K] extends
    | Array<string>
    | Array<WithMetadata<M>>
    | []
    | readonly []
    ? EditableListF<T, M>
    : EditableFieldF<T, M>;
};

export const iterationId = Symbol("iterationId");

const rootKey = Symbol("rootKey");
const onChangeHandlersKey = Symbol("onChangeHandlersKey");
const __isProxy = Symbol("__isProxy");

type AsEditableRoot<T, M> = AsEditable<T, M> & {
  [iterationId]: number;
  [onChangeHandlersKey]: Array<OnChangeHandler<T, M>>;
  [__isProxy]: false;
};

type OnChangeHandler<T, M> = (newData: AsEditableRootF<T, M>) => void;

export type AsEditableRootF<T, M> = AsEditableF<T, M> & {
  [iterationId]: number;
  [rootKey]: AsEditableRoot<T, M>;
  [onChangeHandlersKey]: Array<OnChangeHandler<T, M>>;
  [__isProxy]: true;
};

type EditableItem<M> = EditableList<M> | EditableField<M>;

function IsDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function getEditableItem<M>(isEditable: IsEditable<M>): EditableItem<M> {
  if (typeof isEditable === "string") {
    const field: EditableField<M> = {
      t: "f",
      value: isEditable,
    };
    return field;
  }
  if (typeof isEditable === "object" && isEditable !== null) {
    if ("value" in isEditable && "meta" in isEditable) {
      const field: EditableField<M> = {
        t: "f",
        value: isEditable.value,
        meta: isEditable.meta,
      };
      return field;
    }
  }
  if (Array.isArray(isEditable)) {
    if (isEditable.every((item) => typeof item === "string")) {
      const field: EditableList<M> = {
        t: "l",
        [hasMetadataFlag]: false,
        list: isEditable.map((item) => ({
          t: "li",
          value: item,
          id: Symbol(),
        })),
      };
      return field;
    }
    if (isEditable.every((item) => typeof item === "object" && item !== null)) {
      const field: EditableList<M> = {
        t: "l",
        [hasMetadataFlag]: true,
        list: isEditable.map((item) => ({
          t: "li",
          value: item.value,
          id: Symbol(),
          meta: item.meta,
        })),
      };
      return field;
    }
  }
  throw new Error(`Unsupported editable type: ${isEditable}`);
}

export function makeEditable<T extends CanMakeEditable<M>, M = MetaDefault>(
  target: T,
): AsEditableRootF<T, M> {
  const entries = Object.entries(target) as [string, IsEditable<M>][];
  const entriesAsData: [string, EditableItem<M>][] = entries.map(
    ([key, value]) => {
      const editableItem = getEditableItem(value);
      return [key, editableItem] as [string, EditableItem<M>];
    },
  );

  const withExtras = [
    ...entriesAsData,
    [iterationId, 0] as [typeof iterationId, number],
    [onChangeHandlersKey, []] as [
      typeof onChangeHandlersKey,
      Array<OnChangeHandler<T, M>>,
    ],
    [__isProxy, false] as const,
  ];

  const data = Object.fromEntries(withExtras) as AsEditableRoot<T, M>;

  return makeRootProxy<T, M>(data);
}

export function unmakeEditable<T extends CanMakeEditable<M>, M>(
  editable: AsEditableRootF<T, M> | AsEditableRoot<T, M>,
): T {
  const root = editable[__isProxy] ? editable[rootKey] : editable;

  // if (root === editable) {
  //   console.log("Using root directly:", root, root.__isProxy);
  // } else {
  //   console.log("Using root from editable:", root, root.__isProxy);
  // }

  const entries = Object.entries(root) as [string, EditableItem<M>][];

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
          ] as [string, WithMetadata<M>[]];
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

export function attachOnChange<T, M>(
  editable: AsEditableRootF<T, M>,
  callback: (newData: AsEditableRootF<T, M>) => void,
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

function makeRootProxy<T extends CanMakeEditable<M>, M>(
  root: AsEditableRoot<T, M>,
): AsEditableRootF<T, M> {
  const handler: ProxyHandler<AsEditableRootF<T, M>> = {
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
      if (prop === __isProxy) {
        return true;
      }

      if (typeof prop === "symbol") {
        return root[prop as keyof AsEditableRoot<T, M>];
      }

      if (prop === "toJSON") {
        return () => unmakeEditable<T, M>(root);
      }

      const key = prop as keyof AsEditableF<T, M>;
      const lookup = root[key];
      if (lookup === undefined) {
        throw new Error(
          `Property "${String(prop)}" does not exist on target object.`,
        );
      }

      if (lookup.t === "f") {
        return new Proxy(
          lookup as EditableField<M>,
          makePropertyProxyHandler(root, key),
        ) as EditableFieldF<T, M>;
      }

      if (lookup.t === "l") {
        return new Proxy(
          lookup as EditableList<M>,
          makeListProxyHandler(root, key),
        );
      }

      throw new Error(
        `Unsupported type for key "${String(prop)}": ${String((lookup as { t: string })?.t)}`,
      );
    },
  };

  const access = new Proxy(root as unknown as AsEditableRootF<T, M>, handler);

  const handlers = root[onChangeHandlersKey] || [];

  for (const handler of handlers) {
    handler(access);
  }

  return access;
}

function makePropertyProxyHandler<T extends CanMakeEditable<M>, M>(
  root: AsEditableRoot<T, M>,
  path: keyof AsEditable<T, M>,
): ProxyHandler<EditableFieldF<T, M>> {
  return {
    get(target, prop) {
      // console.log(`Accessing property: ${String(prop)}`);

      if (prop === "value") {
        return target.value;
      }

      if (prop === "meta") {
        return target.meta;
      }

      if (prop === "toJSON") {
        return target.value;
      }

      if (prop === "t") {
        return target.t;
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
          } as AsEditableRoot<T, M>;

          return makeRootProxy(newRoot);
        };
      }
      console.trace(
        `Accessing property "${String(prop)}" on a value field is unusual.`,
      );

      return Reflect.get(target, prop);
    },
  };
}

function makeListProxyHandler<T extends CanMakeEditable<M>, M>(
  root: AsEditableRoot<T, M>,
  path: keyof AsEditable<T, M>,
): ProxyHandler<EditableListF<T, M>> {
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
          } as AsEditableRoot<T, M>;

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
          } as AsEditableRoot<T, M>;

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
          } as AsEditableRoot<T, M>;

          return makeRootProxy(newRoot);
        };
      }

      throw new Error(`Unsupported operation: ${String(prop)}`);
    },
  };
}

function makeListItemProxyHandler<T extends CanMakeEditable<M>, M>(
  root: AsEditableRoot<T, M>,
  path: keyof AsEditable<T, M>,
): ProxyHandler<EditableListItemF<T, M>> {
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

          const oldListContainer = root[path] as EditableListF<T, M>;
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
          } as AsEditableRoot<T, M>;

          return makeRootProxy(newRoot);
        };
      }

      if (prop === "remove") {
        return () => {
          // console.log(`Removing item at path ${String(path)}[${index}]`);

          const oldListContainer = root[path] as EditableListF<T, M>;
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
          } as AsEditableRoot<T, M>;

          return makeRootProxy(newRoot);
        };
      }

      // throw new Error(`Unsupported operation: ${String(prop)}`);

      console.trace(
        `Accessing property "${String(prop)}" on a ListItem is unusual.`,
      );

      return Reflect.get(target, prop);
    },
  };
}
