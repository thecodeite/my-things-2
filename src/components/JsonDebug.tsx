export function JsonDebug({ data, title }: { data: unknown; title?: string }) {
  return (
    <details className="bg-gray-50 p-4 rounded shadow-md">
      <summary className="font-semibold text-gray-700 cursor-pointer">
        {title ?? "JSON Debug"}
      </summary>
      <pre className="bg-gray-100 p-4 rounded">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </details>
  );
}
