PRs are welcome. There is no formal code of conduct yet but please be a kind and reasonable person.

If you make a significant change, update the changelog (duh!). Edit `changelog.yaml` then run:

```bash
changelog gen -y changelog.yaml -o changelog.md
```

If you make a change to the types in `types.ts`, you must regenerate the `schema.json` file:

```
npm run schemagen > schema.json
```
