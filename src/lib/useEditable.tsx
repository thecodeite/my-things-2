import { useEffect, useState } from "react";
import {
  type CanMakeEditable,
  attachOnChange,
  makeEditable,
} from "./makeEditable";

export function useEditable<T extends CanMakeEditable>(target: T) {
  const [editable, setEditable] = useState(() => makeEditable(target));

  useEffect(() => {
    const detach = attachOnChange(editable, (newData) => {
      setEditable(newData);
    });

    return () => {
      detach();
    };
  }, [editable]);

  return editable;
}
