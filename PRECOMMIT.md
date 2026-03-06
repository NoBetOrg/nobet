# Pre-commit Hook Setup

This project uses **Husky** and **lint-staged** to automatically format and lint code before each commit.

## What Happens on Commit

When you run `git commit`, the pre-commit hook automatically:

1. ✅ **Formats** your staged files with Biome (fixes quotes, indentation, etc.)
2. ✅ **Lints** your code for errors and best practices
3. ✅ **Organizes imports** automatically
4. ✅ **Blocks the commit** if there are linting errors that can't be auto-fixed

## Files Affected

The hook runs on these file types:
- `*.js`, `*.jsx`, `*.ts`, `*.tsx`
- `*.json`
- `*.css`
- `*.md`

## Configuration

### lint-staged (package.json)
```json
"lint-staged": {
  "*.{js,jsx,ts,tsx,json,css,md}": [
    "biome check --write --no-errors-on-unmatched --files-ignore-unknown=true"
  ]
}
```

### Pre-commit Hook (.husky/pre-commit)
```bash
pnpm exec lint-staged
```

## Bypassing the Hook (Not Recommended)

If you absolutely need to skip the hook:
```bash
git commit --no-verify -m "your message"
```

**Warning:** Only use `--no-verify` in emergencies. The hook exists to maintain code quality.

## Troubleshooting

### Hook doesn't run
1. Make sure `.husky/pre-commit` is executable:
   ```bash
   chmod +x .husky/pre-commit
   ```

2. Verify husky is installed:
   ```bash
   pnpm install
   ```

### Commit blocked by errors
1. Check the error message - it will tell you what's wrong
2. Fix the issues manually or run:
   ```bash
   pnpm run lint:fix
   ```
3. Stage the fixes and commit again

### Hook runs but doesn't format
Make sure you've staged your changes:
```bash
git add .
git commit -m "your message"
```

The hook only runs on **staged files**, not all files in the working directory.

## Manual Commands

You can also run these manually anytime:

```bash
# Format all code
pnpm run format

# Lint and fix all issues
pnpm run lint:fix

# Check without fixing
pnpm run lint
pnpm run format:check
```
