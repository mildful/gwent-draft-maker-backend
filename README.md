## GET /drafts
```js
{
  drafts: [
    {
      id: 123,
      // ...
      links: [
        // ... see links below
      ]
    }
  ],
  links: [
    { rel: "list-drafts", method: "GET", href: "/drafts" },
    {
      rel: "create-draft",
      method: "POST",
      href: "/drafts",
      schema: {
        type: "object",
        properties: {
          name: { type: "string" },
          availableFactions: { type: "array", items: { type: "string" } },
          // ...
        },
        required: ["name", "availableFactions"]
      }
    },
  ]
}
```

## POST /drafts
```js
{
  id: 123,
  name: "my draft",
  inventory: [],
  decks: [],
  // ...
  links: [
    { rel: "self", method: "GET", href: "/drafts/123" },
    { rel: "list-drafts", method: "GET", href: "/drafts" },
    // + createDraft (voir au dessus)
    { rel: "get-current-keg", method: "GET", href: "/drafts/123/keg" }, // only current keg exists
    { rel: "open-keg", method: "POST", href: "/drafts/123/keg" }, // only if remainingKegs > 0 and no current keg
    {
      rel: "create-new-deck",
      method: "POST",
      href: "/drafts/123/decks",
      schema: {
        type: "object",
        properties: {
          name: { type: "string" },
          leaderCardId: { type: "string" }  //TODO: how to get the leaderList?
        },
        required: ["name", "leaderCardId"]
      }
    },
  ]
}
```

## POST /drafts/123/keg
```js
{
  staticCards: [],
  choiceCards: [],
  links: [
    { rel: "self", method: "GET", href: "/drafts/123/keg" },
    {
      rel: "confirm-cards-choice",
      method: "PATCH",
      href: "/drafts/123/keg/confirm-choice",
      schema: {
        type: "object",
        cardIds: { type: "array", items: { type: "number" }},
      }
    },
  ]
}
```
## POST /drafts/123/decks?faction=MO
```js
{
  id: 1,
  name: "mon deck",
  leaderCard: {
    // ...
  },
  cards: [
    name: 'Geralt',
    // ...
    links: [
      { rel: "remove-from-deck", method: "DELETE", href: "/drafts/123/decks/1/cards/654" },
    ]
  ],
  availableCards: [
    name: 'Ciri',
    // ...
    links: [
      { rel: "add-to-deck", method: "PATCH", href: "/drafts/123/decks/1/cards/433" },
    ]
  ],
  availableLeaders: [
    name: 'Precision Striker',
    // ...
    links: [
      { rel: "update-leader", method: "PATCH", href: "/drafts/123/decks/1/leader/100" },
    ]
  ],
  availableStratagems: [
    name: 'Tactical Advantage',
    // ...
    links: [
      { rel: "update-stratagem", method: "PATCH", href: "/drafts/123/decks/1/stratagem/500" },
    ]
  ],
  // ...
  links: [
    { rel: "self", method: "GET", href: "/draft/123/decks/1" },
    { rel: "delete-deck", method: "DELETE", href: "/drafts/123/decks/1" },
  ]
}
```

