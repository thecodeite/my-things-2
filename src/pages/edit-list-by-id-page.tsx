import { JsonDebug } from "@/components/JsonDebug";
import { LoadingBanner } from "@/components/LoadingBanner";
import { NavBar } from "@/components/NavBar";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { graphql } from "@/graphql";
import { execute, queryClient } from "@/graphql/execute";
import type {
  EditListWithItemsQuery,
  SetListRuleMutationVariables,
  UpdateListMutationVariables,
} from "@/graphql/graphql";
import type { WithMetadata } from "@/lib/makeEditable";
import { useEditable } from "@/lib/useEditable";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";

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

const UpdateListPageMutation = graphql(/* GraphQL */ `
  mutation UpdateList(
      $listId: String!
      $name: String!
      $description: String!
      $tags: [String]!
    ) {
      updateList(
        id: $listId
        name: $name
        description: $description
        tags: $tags
      )
    }
`);

const SetListRulePageMutation = graphql(/* GraphQL */ `
    mutation SetListRule(
      $listId: String!
      $name: String!
      $prompt: String!
      $required: Boolean!
      $backing: String!
      $ruleType: String!
      $backingName: String!
      $data: String!
    ) {
      setListRule(
        listId: $listId
        name: $name
        prompt: $prompt
        required: $required
        backing: $backing
        ruleType: $ruleType
        backingName: $backingName
        data: $data
      )
    }
  `);

interface EditListByIdPageProps {
  list: NonNullable<EditListWithItemsQuery["list"]>;
}

export function EditListByIdPage({ list }: EditListByIdPageProps) {
  const listId = list.id;

  const ruleList: WithMetadata[] = (list.rules || []).map((rule) => ({
    value: ruleToSemiColonSeparatedString(rule),
    meta: {
      name: rule.name,
    },
  }));

  const prompts = Object.fromEntries(
    list.rules?.map((rule) => [rule.name, rule.prompt]) ?? [],
  );

  const [editableList, getList] = useEditable({
    name: list.name,
    description: list.description ?? "",
    tags: (list.tags ?? []).join(", "),
    rules: ruleList,
  });

  // rules: Object.fromEntries(
  //   list?.rules?.map((r) => [r.name, ruleToSemiColonSeparatedString(r)]) ??
  //     [],
  // ),

  const saveDetails = useMutation(
    {
      mutationFn: (variables: UpdateListMutationVariables) =>
        execute(UpdateListPageMutation, variables),
    },
    queryClient,
  );

  const saveRule = useMutation({
    mutationFn: (variables: SetListRuleMutationVariables) =>
      execute(SetListRulePageMutation, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`list:${listId}`] });
      console.log("Rule saved successfully. Invalidated:", `list:${listId}`);
    },
  });

  //[`list:${listId}`],

  const onSave = () => {
    const data = getList();
    console.log("Saving changes:", data);
    saveDetails.mutate({
      listId: list?.id ?? "",
      name: data.name,
      description: data.description,
      tags: data.tags.split(",").map((tag) => tag.trim()),
    });

    data.rules.forEach((rule, index) => {
      const existingRule = ruleList[index];
      if (existingRule.value !== rule.value) {
        const parsedRule = semiColonSeparatedStringToRule(
          existingRule.meta.name,
          rule.value,
        );
        if (parsedRule) {
          console.log("Rule saved: ", parsedRule.name);
          saveRule.mutate({
            listId: list.id,
            name: parsedRule.name,
            prompt: parsedRule.prompt,
            required: parsedRule.required,
            backing: parsedRule.backing,
            ruleType: parsedRule.ruleType,
            backingName: parsedRule.backingName,
            data: parsedRule.data ?? "",
          });
        } else {
          console.error(
            `Failed to parse rule for ${existingRule.meta.name}: ${rule.value}`,
          );
        }
      }
    });
  };

  if (!list) {
    return <div className="text-red-500">List not found</div>;
  }

  return (
    <PageContainer>
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

      <fieldset className="mt-4 border p-4 rounded-lg">
        <legend className="text-lg font-semibold">Rules</legend>
        <div>
          <strong>Format:</strong>{" "}
          <p>
            <sub>prompt; required; backing; ruleType; backingName; data</sub>
          </p>
        </div>
        {editableList.rules.list.map((rule) => (
          <div
            className="grid w-full max-w-sm items-center gap-2"
            key={rule.meta.name}
          >
            <Label
              htmlFor={`list-rule-${rule.meta.name}-id`}
              className="font-bold"
            >
              {prompts[rule.meta.name]}
            </Label>

            <Input
              className="w-full ml-2"
              type="text"
              id={`list-rule-${rule.meta.name}-id`}
              value={rule.value}
              onChange={(e) => rule.setValue(e.target.value)}
              // onChange={(e) => onChange(`rules.${index}`, e.target.value)}
            />
          </div>
        ))}
      </fieldset>

      <JsonDebug data={list} />
      <JsonDebug data={editableList} />
      <div className="sticky bottom-16 bg-transparent z-10 pt-4">
        <Button className="mt-4 w-full" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </PageContainer>
  );
}

type ListSpecRule = NonNullable<
  NonNullable<EditListWithItemsQuery["list"]>["rules"]
>[number];

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
