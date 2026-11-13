#!/usr/bin/env bash
# 把 Git 儲存庫（含完整歷史）、網站、維運 .md、SKILL 備份到 Google Cloud Storage。
# 用法：ops/sync-to-gcs.sh            （需先 gcloud auth login）
set -euo pipefail
PROJECT=caude-project-514509
BUCKET=gs://caude-project-514509-claude
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if ! gcloud storage buckets describe "$BUCKET" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud storage buckets create "$BUCKET" --project="$PROJECT" --location=asia-east1 \
    --uniform-bucket-level-access --public-access-prevention
  gcloud storage buckets update "$BUCKET" --versioning
fi

# Git 儲存庫：打包成 bundle（含所有分支與歷史），可直接 git clone
REPO=taitung-ride-2026
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
git -C "$ROOT" fetch -q --unshallow 2>/dev/null || true
git -C "$ROOT" bundle create "$TMP/$REPO.bundle" --all
git -C "$ROOT" bundle verify "$TMP/$REPO.bundle" >/dev/null
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
gcloud storage cp "$TMP/$REPO.bundle" "$BUCKET/repos/$REPO/$REPO.bundle"
gcloud storage cp "$TMP/$REPO.bundle" "$BUCKET/repos/$REPO/history/$REPO-$STAMP.bundle"

# 網站檔案（不含 .git）
gcloud storage rsync "$ROOT" "$BUCKET/projects/taitung-ride-2026" \
  --recursive --delete-unmatched-destination-objects --exclude='^\.git/'
# SKILL
gcloud storage rsync "$ROOT/.claude/skills" "$BUCKET/skills" --recursive
# .md 維運文件
gcloud storage cp "$ROOT/CLAUDE.md" "$BUCKET/docs/taitung-ride-2026/CLAUDE.md"

gcloud storage ls "$BUCKET"
