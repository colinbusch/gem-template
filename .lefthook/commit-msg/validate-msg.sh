#!/usr/bin/env bash
# Enforce Conventional Commits — see gem-template.mdc for format
MSG=$(cat "$1")
PATTERN="^(feat|fix|chore|refactor|style|docs|test)(\(.+\))?: .{1,72}$"
if ! echo "$MSG" | grep -qE "$PATTERN"; then
  echo "❌ Commit message must follow Conventional Commits format:"
  echo "   <type>(<scope>): <description under 72 chars>"
  echo "   Types: feat | fix | chore | refactor | style | docs | test"
  exit 1
fi
