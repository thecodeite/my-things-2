import { JsonDebug } from "@/components/JsonDebug";
import { LoadingBanner } from "@/components/LoadingBanner";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { graphql } from "@/graphql";
import type { EditListWithItemsQuery } from "@/graphql/graphql";
import { useEditable } from "@/lib/useEditable";
import { Label } from "@radix-ui/react-label";

export const EditListWithItemsPageQuery = graphql(/* GraphQL */ `
  query EditListWithItems($id: String!) {
    list(id: $id) {
      id
      name
      description
      rules {
        backing
        backingName
        data
        name
        prompt
        required
        ruleType
      }
      tags
      
    }
  }
`);

// const CreateListPageQuery = graphql(/* GraphQL */ `
//   mutation CreateList($id: String!) {
//     createList(listName: String!) {
//       id
//     }
//   }
// `);

// export const UpdateListMutation = graphql(/* GraphQL */ `
//   mutation UpdateList($description: String) {
//     updateList(description: $description) {
//     }
//   }
// `);

interface EditListByIdPageProps {
  result?: EditListWithItemsQuery;
}

export function EditListByIdPage({ result }: EditListByIdPageProps) {
  if (!result) {
    return <LoadingBanner />;
  }

  const list = result.list;

  const editableList = useEditable({
    name: list?.name ?? "",
    description: list?.description ?? "",
    tags: list?.tags?.join(", ") ?? "",

    // rules: Object.fromEntries(
    //   list?.rules?.map((r) => [r.name, ruleToSemiColonSeparatedString(r)]) ??
    //     [],
    // ),
  });

  const onSave = () => {
    console.log("Saving changes:", editableList);
  };

  if (!list) {
    return <div className="text-red-500">List not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen p-4 max-w-128">
      <NavBar
        backLink={{
          text: "Back to List",
          link: { to: "/list/$listId", params: { listId: list.id } },
        }}
      >
        <h1 className="text-2xl font-bold mb-4">Edit: {list.name}</h1>
      </NavBar>

      <div className="grid w-full max-w-sm items-center gap-2">
        <Label htmlFor={"list-name-id"} className="font-bold">
          List Name
        </Label>

        <Input
          className="w-full ml-2"
          type="text"
          id={"list-name-id"}
          value={editableList.name.value}
          onChange={(e) => editableList.name.setValue(e.target.value)}
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-2">
        <Label htmlFor={"list-description-id"} className="font-bold">
          Description
        </Label>

        <Input
          className="w-full ml-2"
          type="text"
          id={"list-description-id"}
          value={editableList.description.value}
          onChange={(e) => editableList.description.setValue(e.target.value)}
        />
      </div>

      <div className="grid w-full max-w-sm items-center gap-2">
        <Label htmlFor={"list-tags-id"} className="font-bold">
          Tags
        </Label>

        <Input
          className="w-full ml-2"
          type="text"
          id={"list-tags-id"}
          value={editableList.tags.value}
          onChange={(e) => editableList.tags.setValue(e.target.value)}
        />
      </div>

      {/* <fieldset className="mt-4 border p-4 rounded-lg">
        <legend className="text-lg font-semibold">Rules</legend>
        {Object.entries(editable.rules).map(([ruleName, ruleStr], index) => (
          <div className="grid w-full max-w-sm items-center gap-2" key={index}>
            <Label htmlFor={`list-rule-${index}-id`} className="font-bold">
              {ruleName}
            </Label>

            <Input
              className="w-full ml-2"
              type="text"
              id={`list-rule-${index}-id`}
              value={ruleStr}
              // onChange={(e) => onChange(`rules.${index}`, e.target.value)}
            />
          </div>
        ))}
      </fieldset> */}

      <JsonDebug data={list} />
      <JsonDebug data={editableList} />
      <Button className="mt-4" onClick={onSave}>
        Save Changes
      </Button>
    </div>
  );
}

type ListSpecRule = EditListWithItemsQuery["list"]["rules"][number];

function ruleToSemiColonSeparatedString(rule: ListSpecRule) {
  return `${rule.prompt};${rule.required};${rule.backing};${rule.ruleType};${rule.backingName};${rule.data}`;
}

function semiColonSeparatedStringToRule(
  name: string,
  str: string,
): ListSpecRule | undefined {
  if (!str) return undefined;
  if (str.split(";").length < 5) {
    console.error(
      `Invalid rule string format: "${str}". Expected 5 or 6 parts separated by semicolons.`,
    );
    return undefined;
  }
  const [prompt, required, backing, ruleType, backingName, ...allData] =
    str.split(";");

  const data = allData.join(";");

  if (!prompt || !backing || !ruleType || !backingName) {
    console.error(
      `Invalid rule string format: "${str}". Missing required parts.`,
    );
    return undefined;
  }

  if (!["tag", "detail"].includes(backing)) {
    console.error(
      `Invalid backing type: "${backing}". Expected "tag" or "detail".`,
    );
    return undefined;
  }

  return {
    name,
    prompt,
    required: required === "true",
    backing: backing as "tag" | "detail",
    ruleType,
    backingName,
    data,
  };
}
