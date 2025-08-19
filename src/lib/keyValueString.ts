export function toKeyValueString(record: Record<string, string>) {
  const entries = Object.entries(record);
  return entries
    .map(([key, val]) => `${escapeStr(key)}=${escapeStr(val)}`)
    .join(";");
}

function escapeStr(str: string) {
  return str.replace(/[=;&]/g, (subStr) => {
    if (subStr === "=") return "&eq";
    if (subStr === ";") return "&sc";
    if (subStr === "&") return "&am";
    return subStr;
  });
}

export function fromKeyValueString(kvs: string) {
  const entries = kvs
    .split(";")
    .map((x) => x.split("="))
    .filter(([k]) => k)
    .map(([k, v]) => [unescapeStr(k), unescapeStr(v)]);

  return Object.fromEntries(entries);
}

function unescapeStr(str?: string) {
  if (typeof str === "undefined") return undefined;

  return str.replace(/&eq|&sc|&am/g, (subStr) => {
    if (subStr === "&eq") return "=";
    if (subStr === "&sc") return ";";
    if (subStr === "&am") return "&";
    return subStr;
  });
}
