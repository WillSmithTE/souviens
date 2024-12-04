# migrations

```

npx wrangler d1 migrations create souviens-2 add_goals_sites_usages

npx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0004_add_goal_time.sql

npx wrangler d1 migrations apply souviens-2 --local

npx wrangler d1 migrations apply souviens-2 --remote

npx prisma generate

```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.
