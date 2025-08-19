import { editItemLink, viewListLink } from "@/components/CommonNavLinks";
import { NavBar } from "@/components/NavBar";
import { PageContainer } from "@/components/PageContainer";
import { TraitViewer } from "@/components/traits/TraitViewer";
import type { TraitProps } from "@/components/traits/trait-types";
import { Card, CardContent } from "@/components/ui/card";
import { graphql } from "@/graphql";
import type { SingleListItemQuery } from "@/graphql/graphql";

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

type List = NonNullable<SingleListItemQuery["list"]>;
type ListItem = NonNullable<List["listItem"]>;
interface ViewItemPageProps {
  list: List;
  listItem: ListItem;
}

export function ViewItemPage({ list, listItem }: ViewItemPageProps) {
  const listId = list.id ?? "";
  const itemId = listItem.id ?? "";

  const allFieldsWithoutDescription: TraitProps[] = (list.rules ?? []).map(
    (rule) => {
      let value = "";

      if (rule.backing === "tag") {
        value = listItem.tags?.find((tag) => tag === rule.backingName) ?? "";
      } else if (rule.backing === "detail") {
        value =
          listItem.details?.find((detail) => detail.name === rule.backingName)
            ?.value ?? "";
      }

      const trait = {
        id: `trait:${rule.name}`,
        mode: "view",
        value,
        prompt: rule.prompt,
      };

      const props: TraitProps = {
        trait,
        rule: {
          ruleType: rule.ruleType,
          data: rule.data ?? undefined,
        },
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
    },
    ...allFieldsWithoutDescription,
  ];

  const backLink = viewListLink("Back to List", list.id);
  const forwardLink = editItemLink("Edit Item", listId, itemId);

  return (
    <PageContainer>
      <NavBar backLink={backLink} forwardLink={forwardLink}>
        <h2>{list.name}</h2>
        <h1 className="text-2xl font-bold mb-4">{listItem.name}</h1>
      </NavBar>
      <Card>
        <CardContent className="space-y-4 flex flex-col ">
          {listItem.description && <p>{listItem.description}</p>}
          {allFields.map((field) => (
            <TraitViewer
              key={field.trait.id}
              trait={field.trait}
              rule={field.rule}
              onChange={undefined}
            />
          ))}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
