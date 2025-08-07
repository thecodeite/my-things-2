import { JsonDebug } from "@/components/JsonDebug";
import { NavLink } from "@/components/NavLink";
import { TraitEditor, type TraitProps, TraitViewer } from "@/components/Trait";
import { Card, CardContent } from "@/components/ui/card";
import { graphql } from "@/graphql";
import type { SingleListItemQuery } from "@/graphql/graphql";

export const SingleListItemPageQuery = graphql(/* GraphQL */ `
  query SingleListItem($listId: String!, $itemId: String!) {
    list(id: $listId, listItemId: $itemId) {
      id
      name
      rules {
        backing
        backingName
        data
        name
        prompt
        required
        ruleType
      }
      listItem {
        id
        name
        description
        tags
        details {
          name
          value
        }
      }
    }
  }
`);

interface ItemByIdProps {
  result?: SingleListItemQuery;
  mode: "view" | "edit";
}

export function ItemByIdPage({ result, mode }: ItemByIdProps) {
  const { list } = result ?? {};
  const { listItem } = list ?? {};

  const listId = list?.id ?? "";
  const itemId = listItem?.id ?? "";

  const makeOnChange = (name: string) => (newValue: string) => {
    // Handle trait change logic here if needed
    console.log(`Trait ${name} changed to: ${newValue}`);
  };

  const allFieldsWithoutDescription: TraitProps[] = (list?.rules ?? []).map(
    (rule) => {
      let value = "";

      if (rule.backing === "tag") {
        value = listItem?.tags?.find((tag) => tag === rule.backingName) ?? "";
      } else if (rule.backing === "detail") {
        value =
          listItem?.details?.find((detail) => detail.name === rule.backingName)
            ?.value ?? "";
      }
      const trait = {
        id: `trait:${rule.name}`,
        mode,
        value,

        prompt: rule.prompt,
      };

      const props: TraitProps = {
        trait,
        rule: {
          ruleType: rule.ruleType,
          data: rule.data ?? undefined,
        },
        ...(mode === "edit"
          ? {
              onChange: makeOnChange(rule.name),
            }
          : {}),
      };
      return props;
    },
  );

  const descriptionAsTrait = {
    id: "description",
    value: listItem?.description ?? "",
    prompt: "Description",
  };

  const allFields: TraitProps[] = [
    {
      trait: descriptionAsTrait,
      rule: { ruleType: "text", data: "multi-line" },
      ...(mode === "edit"
        ? {
            onChange: makeOnChange("description"),
          }
        : { onChange: undefined }),
    },
    ...allFieldsWithoutDescription,
  ];

  if (!list || !listItem) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4 max-w-128">
      <div className="grid grid-cols-[1fr_auto_1fr] items-start space-y-4 w-full">
        <NavLink direction="back" to={"/list/$listId"}>
          Back to List
        </NavLink>

        <div className="flex flex-col items-center justify-between">
          <h2>{list.name}</h2>
          <h1 className="text-2xl font-bold mb-4">{listItem.name}</h1>
        </div>

        <NavLink
          direction="forward"
          to={"/list/$listId/item/$itemId/edit"}
          params={{ listId, itemId }}
        >
          Edit Item
        </NavLink>
      </div>
      <Card>
        <CardContent className="space-y-4 flex flex-col gap-4">
          {listItem.description && <p>{listItem.description}</p>}
          {allFields.map((field) =>
            field.onChange ? (
              <TraitEditor
                key={field.trait.id}
                trait={field.trait}
                rule={field.rule}
                onChange={field.onChange}
              />
            ) : (
              <TraitViewer
                key={field.trait.id}
                trait={field.trait}
                rule={field.rule}
                onChange={undefined}
              />
            ),
          )}
        </CardContent>
      </Card>
      <div>
        <JsonDebug data={list.listItem?.tags} title="Tags" />
        <JsonDebug data={list.listItem?.details} title="Details" />
        <JsonDebug data={allFields} title="Fields" />
        <JsonDebug data={list} title="List" />
      </div>
    </div>
  );
}
