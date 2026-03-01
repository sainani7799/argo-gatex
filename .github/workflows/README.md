# GitHub Actions Deployment Pipeline

## Overview

This repository uses a **4-workflow deployment pipeline** with manual promotion gates for releasing Docker images. This approach works for all GitHub plans and doesn't require environment protection rules.

## 🚨 Prerequisites

**IMPORTANT:** Before using these workflows, you must set up a Personal Access Token:

1. **Why:** Team-based authorization requires a token with `read:org` scope
2. **Create PAT:** GitHub Settings → Developer settings → Personal access tokens (classic)
3. **Required scope:** `read:org` (Read org and team membership)
4. **Add as secret:** Repository Settings → Secrets → New secret → Name: `ORG_READ_TOKEN`

See [SETUP.md](./SETUP.md#1-create-organization-read-token-required) for detailed instructions.

## Workflow Structure

The deployment is split into 4 separate workflows that you manually trigger in sequence:

1. **1. Build DEV Images** - Automatic on push/release
2. **2. Promote to ALPHA** - Manual trigger
3. **3. Promote to RC** - Manual trigger
4. **4. Promote to PRODUCTION** - Manual trigger

## Pipeline Stages

### 1️⃣ Development (Automatic)
**Workflow:** `1. Build DEV Images`  
**Trigger:** Push to `main` branch OR GitHub Release created  
**Image Tag:** `x.x.x-dev`  
**Behavior:** Automatically builds and pushes images with `-dev` suffix

### 2️⃣ Alpha Release (Manual)
**Workflow:** `2. Promote to ALPHA`  
**Trigger:** Manual - you click "Run workflow" in Actions tab  
**Image Tag:** `x.x.x-alpha`  
**Input Required:** DEV version (e.g., `1.0.5-dev`)  
**Behavior:** Retags the existing dev image to `-alpha` suffix

### 3️⃣ Release Candidate (Manual)
**Workflow:** `3. Promote to RC`  
**Trigger:** Manual - you click "Run workflow" in Actions tab  
**Image Tag:** `x.x.x-rc`  
**Input Required:** DEV version (e.g., `1.0.5-dev`)  
**Behavior:** Retags the existing alpha image to `-rc` suffix

### 4️⃣ Production (Manual)
**Workflow:** `4. Promote to PRODUCTION`  
**Trigger:** Manual - you click "Run workflow" in Actions tab  
**Image Tag:** `x.x.x-prod` and `latest`  
**Input Required:** DEV version (e.g., `1.0.5-dev`)  
**Behavior:** Retags the existing alpha image to `-prod` suffix and `latest`

## Why Separate Workflows?

This approach provides manual "approval" gates without requiring GitHub environment protection rules, which are:
- ❌ Not available on GitHub Free for private repositories
- ✅ This solution works for all GitHub plans (Free, Pro, Team, Enterprise)
- ✅ Works for both public and private repositories
- ✅ Provides clear separation and control over each promotion stage

## Deployment Workflow

### For Development Releases

```bash
# Merge changes to main branch
git checkout main
git merge feature-branch
git push origin main

# Images are automatically built with -dev tag
# Example: 1.0.5-dev
```

### For Production Releases

```bash
# Step 1: Merge to main or create a GitHub release
git checkout main
git merge feature-branch
git push origin main
# OR create a GitHub release

# Step 2: DEV images are automatically built
# Check Actions tab for "1. Build DEV Images" workflow
# Note the version created (e.g., 1.2.3-dev)

# Step 3: Manually promote to ALPHA
# Go to Actions tab
# Click on "2. Promote to ALPHA" workflow (left sidebar)
# Click "Run workflow" button (top right)
# Enter the DEV version: 1.2.3-dev
# Click "Run workflow"
# Wait for it to complete → creates 1.2.3-alpha

# Step 4: Manually promote to RC
# Go to Actions tab
# Click on "3. Promote to RC" workflow
# Click "Run workflow"
# Enter the DEV version: 1.2.3-dev
# Click "Run workflow"
# Wait for it to complete → creates 1.2.3-rc

# Step 5: Manually promote to PRODUCTION
# Go to Actions tab
# Click on "4. Promote to PRODUCTION" workflow
# Click "Run workflow"
# Enter the DEV version: 1.2.3-dev
# Click "Run workflow"
# Wait for it to complete → creates 1.2.3-prod and latest
```

## Versioning Strategy

The version number is determined from:
1. **package.json** `version` field (if exists)
2. **Fallback:** `1.0.<run-number>` format

### Example Version Progression

```
Push to main              → 1.2.3-dev (automatic)
                          
Manual: Run "2. Promote to ALPHA" 
  with version 1.2.3-dev  → 1.2.3-alpha
                          
Manual: Run "3. Promote to RC"
  with version 1.2.3-dev  → 1.2.3-rc
                          
Manual: Run "4. Promote to PRODUCTION"
  with version 1.2.3-dev  → 1.2.3-prod + latest
```

## Access Control

### Who Can Trigger Workflows?

The workflows have **built-in authorization checks** that restrict who can run each promotion:

#### 2. Promote to ALPHA
**Allowed Users:** Developers, QA Lead, Team Lead, DevOps Lead
- Edit allowed users in: `.github/workflows/promote-to-alpha.yml` (line ~14)
- Default: `developer1 developer2 qa-lead team-lead devops-lead`

#### 3. Promote to RC
**Allowed Users:** QA Team, Team Lead, DevOps Lead  
- Edit allowed users in: `.github/workflows/promote-to-rc.yml` (line ~14)
- Default: `qa-lead qa-engineer devops-lead team-lead`

#### 4. Promote to PRODUCTION
**Allowed Users:** Senior DevOps, Team Lead, CTO (most restrictive)
- Edit allowed users in: `.github/workflows/promote-to-production.yml` (line ~14)
- Default: `devops-lead team-lead cto`

### How Authorization Works

1. User clicks "Run workflow"
2. Workflow starts with `check_authorization` job
3. Checks if `${{ github.actor }}` is in the allowed list
4. If **authorized**: Proceeds with promotion ✅
5. If **NOT authorized**: Workflow fails immediately ❌

### Updating Allowed Users

Edit the `ALLOWED_USERS` variable in each workflow file:

```yaml
# Example: Add your GitHub username
ALLOWED_USERS="devops-lead team-lead your-username another-user"
```

**Important:** Use actual GitHub usernames (not display names)

### Additional Security Layers

1. **Repository Permissions**
   - Settings → Collaborators
   - Assign appropriate roles:
     - **Write:** Can trigger all workflows
     - **Triage:** Cannot trigger workflows
     - **Read:** View only

2. **CODEOWNERS File**
   - Created at `.github/CODEOWNERS`
   - Requires approval to modify workflow files
   - Prevents unauthorized users from adding themselves to allowed lists
   - Enable in: Settings → Branches → Branch protection → Require review from Code Owners

3. **Branch Protection Rules**
   - Settings → Branches → Add rule for `main`
   - Enable "Require pull request reviews before merging"
   - Enable "Require review from Code Owners"
   - This prevents anyone from bypassing authorization by editing workflow files

4. **Team Permissions** (for Organizations)
   - Create teams: dev-team, qa-team, ops-team
   - Assign repository access levels per team
   - Only ops-team gets write access

4. **Process Guidelines**
   - Document who should trigger each workflow
   - Use PR reviews to approve code before merging
   - Use audit logs to track who ran which workflows
### Setting Up Full Access Control (Recommended)

**Step 1: Enable Branch Protection**
```
Settings → Branches → Add rule
Branch name: main
☑ Require a pull request before merging
☑ Require review from Code Owners
☑ Do not allow bypassing the above settings
Save changes
```

**Step 2: Update CODEOWNERS**
```
Edit .github/CODEOWNERS
Replace placeholder usernames with real GitHub usernames
Example: @devops-lead → @john-doe
```

**Step 3: Update Allowed Users in Workflows**
```
Edit promote-to-alpha.yml - Line ~14
Edit promote-to-rc.yml - Line ~14  
Edit promote-to-production.yml - Line ~14
Replace placeholder usernames with actual GitHub usernames
```

**Step 4: Test Authorization**
```
1. Have an unauthorized user try to run a workflow
2. Verify it fails with authorization error
3. Have an authorized user run the same workflow
4. Verify it succeeds
```

This creates multiple layers of protection:
- Level 1: Repository write access required
- Level 2: Workflow authorization check blocks unauthorized users
- Level 3: CODEOWNERS prevents users from adding themselves
- Level 4: Branch protection prevents bypassing CODEOWNERS
## Services

The pipeline builds and manages 17 microservices:

- gatex-ui
- gatex-be

## Monitoring Deployments

### View Pipeline Status

1. Go to **Actions** tab in GitHub
2. You'll see 4 workflow categories on the left:
   - ✅ 1. Build DEV Images
   - 🔄 2. Promote to ALPHA
   - 🔄 3. Promote to RC
   - 🔄 4. Promote to PRODUCTION
3. Click on any workflow to see its runs
4. Click on a specific run to see detailed logs
5. Each matrix job shows individual service builds

### View Images

All images are published to GitHub Container Registry:
```
ghcr.io/schemax-pte-ltd/xapparel/<service-name>:<tag>
```

Browse packages: https://github.com/orgs/schemax-pte-ltd/packages

## Rollback Strategy

If you need to rollback to a previous version:

### Method 1: Promote an Old Version

```bash
# 1. Find the old DEV version you want to rollback to
#    Example: 1.2.2-dev (currently 1.2.3-prod is live)

# 2. Re-run the promotion workflows with the old version
#    a) Run "2. Promote to ALPHA" with version: 1.2.2-dev
#    b) Run "3. Promote to RC" with version: 1.2.2-dev  
#    c) Run "4. Promote to PRODUCTION" with version: 1.2.2-dev

# 3. This will retag:
#    1.2.2-dev → 1.2.2-alpha → 1.2.2-rc → 1.2.2-prod + latest
```

### Method 2: Manual Retagging (Fast)

```bash
# Use crane to directly retag an old prod version as latest
# (Requires crane CLI installed locally)

crane copy \
  ghcr.io/schemax-pte-ltd/gatex/gatex-ui:1.2.2-prod \
  ghcr.io/schemax-pte-ltd/gatex/gatex-ui:latest

# Repeat for all 17 services
```

### Method 3: Redeploy from Old Code

```bash
# 1. Checkout the old release tag
git checkout v1.2.2

# 2. Create a new hotfix release
#    Go to Releases → Create new release → Tag: v1.2.2-hotfix

# 3. DEV images will build automatically (1.2.2-hotfix-dev)

# 4. Follow normal promotion flow
```

## Troubleshooting

### Cannot see "Run workflow" button
- Ensure you have **write access** to the repository
- Check that you're logged into GitHub
- Make sure you're viewing the workflow in the Actions tab
- The button appears on the right side after selecting a workflow

### "Image not found" error during promotion
- Ensure the DEV image exists before promoting to ALPHA
- Ensure ALPHA image exists before promoting to RC
- Check the version format (must include `-dev` suffix)
- Verify images in GitHub Packages container registry

### Wrong version promoted
- Always use the same DEV version for all promotions
- Example: If you built `1.2.3-dev`, use `1.2.3-dev` for ALPHA, RC, and PROD
- The workflow automatically transforms the tag suffix

### How to track who ran workflows
1. Go to Actions tab
2. Click on a workflow run
3. Top right shows "triggered by @username"
4. Use repository audit logs for detailed tracking:
   - Settings → Logs → Audit log (requires admin access)

### Rollback to previous version
```bash
# Option 1: Manually retag an old version as latest
# Go to Packages → Select service → Tags → Copy old tag
# Run promotion workflow with old version

# Option 2: Trigger a new release from old code
# Checkout old tag → Create new release → Follow normal flow
```

### Build fails on main branch
- Check Dockerfile syntax
- Verify all required .env files exist
- Review build logs in Actions tab

## Security Notes

- Only approved team members can trigger workflows (repository write access required)
- All workflow runs are logged and auditable
- GITHUB_TOKEN is automatically scoped per workflow
- Images are stored in private GitHub Container Registry
- Use branch protection to control what gets merged to `main`

## Quick Reference

### Workflow Trigger Locations

| Workflow | Location in Actions Tab | When to Use |
|----------|------------------------|-------------|
| 1. Build DEV Images | Left sidebar | Automatic on push/release |
| 2. Promote to ALPHA | Left sidebar | After DEV build completes |
| 3. Promote to RC | Left sidebar | After ALPHA promotion |
| 4. Promote to PRODUCTION | Left sidebar | After RC promotion |

### Version Format

- DEV: `1.2.3-dev`
- ALPHA: `1.2.3-alpha`
- RC: `1.2.3-rc`
- PROD: `1.2.3-prod`
- LATEST: `latest` (points to current prod)

### Common Commands

```bash
# View all tags for a service
gh api /orgs/schemax-pte-ltd/packages/container/gatex%2Fgatex-ui/versions

# Check if image exists
docker manifest inspect ghcr.io/schemax-pte-ltd/gatex/gatex-ui:1.2.3-dev

# Pull a specific version locally
docker pull ghcr.io/schemax-pte-ltd/gatex/gatex-ui:1.2.3-prod
```

## Support

For issues or questions about the deployment pipeline:
1. Check this README first
2. Review workflow logs in Actions tab
3. Contact DevOps team
4. Check GitHub Container Registry for image availability

