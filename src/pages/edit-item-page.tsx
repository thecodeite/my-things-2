import {
  editItemLink,
  viewItemLink,
  viewListLink,
} from "@/components/CommonNavLinks";
import { JsonDebug } from "@/components/JsonDebug";
import { NavBar } from "@/components/NavBar";
import { PageContainer } from "@/components/PageContainer";
import { TraitEditor } from "@/components/traits/TraitEditor";
import { TraitViewer } from "@/components/traits/TraitViewer";
import type { TraitProps } from "@/components/traits/trait-types";
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

type EditList = NonNullable<SingleListItemQuery["list"]>;
type EditListItem = NonNullable<EditList["listItem"]>;

interface EditItemPageProps {
  list: EditList;
  listItem: EditListItem;
}

export function EditItemPage({ list, listItem }: EditItemPageProps) {
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
        mode: "edit",
        value,

        prompt: rule.prompt,
      };

      const props: TraitProps = {
        trait,
        rule: {
          ruleType: rule.ruleType,
          data: rule.data ?? undefined,
        },
        onChange: makeOnChange(rule.name),
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
      onChange: makeOnChange("description"),
    },
    ...allFieldsWithoutDescription,
  ];

  const backLink = viewItemLink("Back to Item", list.id, itemId);

  return (
    <PageContainer>
      <NavBar backLink={backLink} forwardLink={undefined}>
        <h2>{list.name}</h2>
        <h1 className="text-2xl font-bold mb-4">{listItem.name}</h1>
      </NavBar>
      <Card>
        <CardContent className="space-y-4 flex flex-col ">
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
    </PageContainer>
  );
}
