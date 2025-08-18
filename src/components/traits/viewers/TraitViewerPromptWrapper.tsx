interface TraitViewerPromptWrapper {
  prompt: React.ReactNode;
  children: React.ReactNode;
}

export function TraitViewerPromptWrapper({
  prompt,
  children,
}: TraitViewerPromptWrapper) {
  return (
    <div className="flex flex-row flex-wrap items-end">
      <h2 className="text-lg font-bold mr-2">{prompt}:</h2>
      <p className="text-gray-500">{children}</p>
    </div>
  );
}
