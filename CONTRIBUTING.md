# Contributing Guidelines

Thank you for contributing to **BudgetFlow**! To maintain code quality, security, and project history clarity, we follow a strict **Feature Branching & PR Merge Strategy**.

---

## 🌿 Git Branching Strategy

Our repository uses **`main`** as the primary production branch. Direct commits to `main` are strictly prohibited.

### Branch Naming Conventions
Always create a descriptive branch from `main` using one of the following prefixes:

- **`feature/`**: For new features, components, or UI additions.
  - Example: `feature/goals-progress-chart`, `feature/csv-export`
- **`fix/`**: For bug fixes or defect corrections.
  - Example: `fix/dropdown-positioning`, `fix/transaction-calculation`
- **`refactor/`**: For code cleanups, performance improvements, or structural changes without feature alterations.
  - Example: `refactor/zustand-persistence`
- **`docs/`**: For documentation updates.
  - Example: `docs/api-guide`

---

## 🔄 Workflow Steps

### 1. Pull Latest `main`
```bash
git checkout main
git pull origin main
```

### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Commit Changes
Use clear, imperative commit messages:
```bash
git add .
git commit -m "feat: add goal creation modal and progress tracking"
```

### 4. Push Branch to Origin
```bash
git push -u origin feature/your-feature-name
```

### 5. Open a Pull Request (PR)
- Open a Pull Request targeting `main`.
- Fill in the PR description template detailing:
  - What was changed
  - How to test / verify the change
- All GitHub Actions CI checks (`Type Check`, `Build Validation`) must pass before merge.
- Merges must use **Squash and Merge** or **Rebase and Merge** to maintain a clean linear `main` history.

---

## ⚡ Code Quality & Verification

Before submitting a PR, verify your changes locally:

```bash
# 1. Type Check
npx tsc --noEmit

# 2. Production Build Check
npm run build
```
