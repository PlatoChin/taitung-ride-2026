#!/usr/bin/env bash
# 把網站、維運 .md、SKILL 備份到 Google Cloud Storage。
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

# 網站檔案（不含 .git）
gcloud storage rsync "$ROOT" "$BUCKET/projects/taitung-ride-2026" \
  --recursive --delete-unmatched-destination-objects --exclude='^\.git/'
# SKILL
gcloud storage rsync "$ROOT/.claude/skills" "$BUCKET/skills" --recursive
# .md 維運文件
gcloud storage cp "$ROOT/CLAUDE.md" "$BUCKET/docs/taitung-ride-2026/CLAUDE.md"

gcloud storage ls "$BUCKET"
