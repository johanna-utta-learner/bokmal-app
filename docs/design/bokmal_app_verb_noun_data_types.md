# Bokmål App — Verb and Noun Data Types

## Noun data type

```ts
type NounItem = {
  id: string;
  type: "noun";
  theme: string;
  german: string;
  bokmalSingular: string;
  bokmalSingularDefinite: string;
  bokmalPlural: string;
  bokmalPluralDefinite: string;
};
```

## Verb data type

```ts
type VerbItem = {
  id: string;
  type: "verb";
  theme: string;
  german: string;
  bokmalInfinitive: string;
  bokmalPresent: string;
  bokmalPast: string;
};
```

