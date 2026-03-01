# Workflow Setup Guide

## Quick Start Checklist

### 1. Create Organization Read Token (REQUIRED)

**Why:** The default `GITHUB_TOKEN` doesn't have permission to read organization team memberships. You need a Personal Access Token (PAT) with `read:org` scope.

**Steps:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Give it a name: `GitHub Actions - Team Membership Read`
4. Set expiration (recommended: 90 days, then rotate)
5. Select **only** these scopes:
   - ✅ `read:org` - Read org and team membership, read org projects
6. Click **Generate token** and copy it
7. Go to your repository → Settings → Secrets and variables → Actions
8. Click **New repository secret**
9. Name: `ORG_READ_TOKEN`
10. Value: Paste your PAT
11. Click **Add secret**

**Important:** Keep this token secure. It grants read access to your organization's team structure.

---

### 2. Configure Authorization Lists

Replace placeholder usernames with your actual GitHub usernames:

**File: `.github/workflows/promote-to-alpha.yml` (Line ~14)**
```yaml
ALLOWED_USERS: "developer1 developer2 qa-lead team-lead devops-lead username1"
```
↓ Change to ↓
```yaml
ALLOWED_USERS: "alice bob qa-manager tech-lead ops-manager"
```

**File: `.github/workflows/promote-to-rc.yml` (Line ~14)**
```yaml
ALLOWED_USERS: "qa-lead qa-engineer devops-lead team-lead username1 username2"
```
↓ Change to ↓
```yaml
ALLOWED_USERS: "qa-manager qa-engineer ops-manager tech-lead"
```

**File: `.github/workflows/promote-to-production.yml` (Line ~14)**
```yaml
ALLOWED_USERS: "devops-lead team-lead cto username1 username2"
```
↓ Change to ↓
```yaml
ALLOWED_USERS: "ops-manager cto engineering-director"
```

---

### 3. Configure CODEOWNERS

**File: `.github/CODEOWNERS`**
```
/.github/workflows/ @devops-lead @team-lead
/.github/workflows/promote-to-production.yml @devops-lead @cto
```
↓ Change to ↓
```
/.github/workflows/ @ops-manager @tech-lead
/.github/workflows/promote-to-production.yml @ops-manager @cto
```

---

### 4. Enable Branch Protection

1. Go to: **Settings → Branches → Add rule**
2. Branch name pattern: `main`
3. Enable these settings:
   - ☑ **Require a pull request before merging**
   - ☑ **Require review from Code Owners**
   - ☑ **Do not allow bypassing the above settings**
4. Click **Save changes**

---

### 5. Test the Workflows

#### Test 1: DEV Build (Automatic)
```bash
# Merge a PR to main
git checkout main
git pull
# Verify workflow runs automatically
# Check: Actions tab → "1. Build DEV Images"
```

#### Test 2: Alpha Promotion (Manual)
```bash
# Go to: Actions → "2. Promote to ALPHA"
# Click "Run workflow"
# Enter version: 1.0.0-dev
# Click "Run workflow" button
# Verify it creates: 1.0.0-alpha tags
```

#### Test 3: RC Promotion (Manual)
```bash
# Go to: Actions → "3. Promote to RC (UAT)"
# Click "Run workflow"
# Enter version: 1.0.0-alpha
# Click "Run workflow" button
# Verify it creates: 1.0.0-rc tags
```

#### Test 4: Production Promotion (Manual)
```bash
# Go to: Actions → "4. Promote to PRODUCTION"
# Click "Run workflow"
# Enter version: 1.0.0-alpha
# Click "Run workflow" button
# Verify it creates: 1.0.0-prod and 1.0.0-latest tags
```

#### Test 5: Authorization Check
```bash
# Have an unauthorized user try to run "Promote to PRODUCTION"
# Expected: Workflow fails with error message showing allowed users
# Have an authorized user run the same workflow
# Expected: Workflow succeeds
```

---

## Typical Workflow Execution

### Scenario: Deploying version 2.5.3

1. **Developer merges code to main**
   - Workflow: `1. Build DEV Images` (automatic)
   - Result: Images tagged as `2.5.3-dev`

2. **QA Lead promotes to alpha**
   - Workflow: `2. Promote to ALPHA` (manual)
   - Input: `2.5.3-dev`
   - Result: Images retagged as `2.5.3-alpha`

3. **QA Engineer promotes to RC**
   - Workflow: `3. Promote to RC (UAT)` (manual)
   - Input: `2.5.3-alpha`
   - Result: Images retagged as `2.5.3-rc`
   - Action: Deploy to UAT environment for testing

4. **DevOps Lead promotes to production**
   - Workflow: `4. Promote to PRODUCTION` (manual)
   - Input: `2.5.3-alpha`
   - Result: Images retagged as `2.5.3-prod` and `2.5.3-latest`
   - Action: Deploy to production environment

---

## Security Configuration Matrix

| Workflow | Who Can Trigger | Configuration File | Line # |
|----------|----------------|-------------------|--------|
| Build DEV | Automatic (anyone who merges to main) | docker-build.yml | N/A |
| Promote to Alpha | Developers, QA Lead, Team Lead | promote-to-alpha.yml | ~14 |
| Promote to RC | QA Team, Team Lead | promote-to-rc.yml | ~14 |
| Promote to Prod | DevOps Lead, CTO only | promote-to-production.yml | ~14 |
| Modify Workflows | DevOps team (via CODEOWNERS) | CODEOWNERS | 1-2 |

---

## Troubleshooting

### Issue: "User not authorized" error
**Cause:** Your GitHub username is not in the ALLOWED_USERS list  
**Fix:** Ask a DevOps team member to add your username to the appropriate workflow file

### Issue: Cannot modify workflow files
**Cause:** CODEOWNERS requires approval from DevOps team  
**Fix:** This is intentional. Submit a PR and request review from code owners

### Issue: Workflows not appearing in Actions tab
**Cause:** Workflow files may have syntax errors  
**Fix:** Check for YAML validation errors in your IDE or use yamllint

### Issue: Image not found during promotion
**Cause:** The specified version doesn't exist  
**Fix:** Check available tags: `gh api /orgs/schemax-pte-ltd/packages/container/gatex%2Fgatex-ui/versions`

### Issue: "Resource not accessible by integration" error
**Cause:** GitHub token lacks permissions  
**Fix:** Ensure repository → Settings → Actions → Workflow permissions is set to "Read and write permissions"

---

## Best Practices

1. **Version Numbering**
   - Use semantic versioning: MAJOR.MINOR.PATCH
   - Example: 1.0.0, 1.1.0, 2.0.0
   - Keep package.json version in sync

2. **Promotion Strategy**
   - Always promote from -alpha to RC and PROD
   - Never promote from -dev directly to PROD
   - This ensures all environments use tested images

3. **Access Control**
   - Keep ALLOWED_USERS lists minimal
   - Review and update quarterly
   - Use real names in Git commits for audit trail

4. **Rollback Strategy**
   - Keep previous versions tagged
   - To rollback: Manually deploy previous -prod tag
   - Document rollbacks in incident reports

5. **Testing**
   - Test in -rc (UAT) before promoting to PROD
   - Maintain test environment that mirrors PROD
   - Document test cases for each release

---

## Links

- [Full Documentation](README.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
