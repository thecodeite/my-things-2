import { useEffect, useState } from "react";
import {
  type CanMakeEditable,
  attachOnChange,
  makeEditable,
  unmakeEditable,
} from "./makeEditable";

export function useEditable<T extends CanMakeEditable>(target: T | (() => T)) {
  const [editable, setEditable] = useState(() => {
    if (typeof target === "function") {
      return makeEditable(target());
    }
    return makeEditable(target);
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
