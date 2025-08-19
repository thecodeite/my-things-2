import { useEffect, useState } from "react";
import {
  type CanMakeEditable,
  attachOnChange,
  makeEditable,
  unmakeEditable,
} from "./makeEditable";

export function useEditable<
  M = Record<string, string>,
  T extends CanMakeEditable<M> = CanMakeEditable<M>,
>(target: T | (() => T)) {
  const [editable, setEditable] = useState(() => {
    if (typeof target === "function") {
      const value = target();
      return makeEditable<T, M>(value);
    }
    return makeEditable<T, M>(target);
  });

  useEffect(() => {
    const detach = attachOnChange(editable, (newData) => {
      setEditable(newData);
    });

    return () => {
      detach();
    };
  }, [editable]);

  function getData() {
    return unmakeEditable(editable);
  }

  return [editable, getData] as const;
}
