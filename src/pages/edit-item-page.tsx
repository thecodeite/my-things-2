import { viewItemLink } from "@/components/CommonNavLinks";
import { JsonDebug } from "@/components/JsonDebug";
import { NavBar } from "@/components/NavBar";
import { PageContainer } from "@/components/PageContainer";
import { TraitEditor } from "@/components/traits/TraitEditor";
import type { Trait, TraitRule } from "@/components/traits/trait-types";
import { Card, CardContent } from "@/components/ui/card";
import { graphql } from "@/graphql";
import type { SingleListItemQuery } from "@/graphql/graphql";
import { useEditable } from "@/lib/useEditable";

export const singleListItemPageQuery = graphql(/* GraphQL */ `
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

type EditList = NonNullable<SingleListItemQuery["list"]>;
type EditListItem = NonNullable<EditList["listItem"]>;

const traitRuleForDescription: TraitRule = {
  ruleType: "text",
  data: "multi-line",
};

interface EditItemPageProps {
  list: EditList;
  listItem: EditListItem;
}

interface Meta {
  trait: Trait;
  traitRule: TraitRule;
}

export function EditItemPage({ list, listItem }: EditItemPageProps) {
  const itemId = listItem?.id ?? "";

  const [{ description }] = useEditable({
    description: listItem.description ?? "",
  });

  const [fieldsObject] = useEditable<Meta>(() => {
    const fields = (list?.rules ?? []).map((rule) => {
      let value = "";

      if (rule.backing === "tag") {
        value = listItem?.tags?.find((tag) => tag === rule.backingName) ?? "";
      } else if (rule.backing === "detail") {
        value =
          listItem?.details?.find((detail) => detail.name === rule.backingName)
            ?.value ?? "";
      }

      const key = `rule:${rule.name}`;

      const meta: Meta = {
        trait: {
          id: key,
          prompt: rule.prompt,
          value,
        },
        traitRule: {
          ruleType: rule.ruleType,
          data: rule.data ?? "",
        },
      };

      return {
        value,
        meta,
      };
    });

    const entries = fields.map((field) => [field.meta.trait.id, field]);

    return Object.fromEntries(entries);
  });

  const fields = Object.entries(fieldsObject);

  const backLink = viewItemLink("Back to Item", list.id, itemId);

  return (
    <PageContainer>
      <NavBar backLink={backLink} forwardLink={undefined}>
        <h2>{list.name}</h2>
        <h1 className="text-2xl font-bold mb-4">{listItem.name}</h1>
      </NavBar>
      <Card>
        <CardContent className="space-y-4 flex flex-col ">
          Fields: {fields.length}
          <TraitEditor
            trait={{
              id: "description",
              prompt: "Description",
              value: description.value,
            }}
            rule={traitRuleForDescription}
            onChange={description.setValue}
          />
          {fields.map(([key, field]) => {
            const meta = field.meta;
            if (!meta) return "no meta";

            return (
              <div key={key}>
                <TraitEditor
                  trait={meta.trait}
                  rule={meta.traitRule}
                  onChange={field.setValue}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>
      <div>
        <JsonDebug data={list.listItem?.tags} title="Tags" />
        <JsonDebug data={list.listItem?.details} title="Details" />
        <JsonDebug data={fields} title="Fields" />
        <JsonDebug data={list} title="List" />
      </div>
    </PageContainer>
  );
}
