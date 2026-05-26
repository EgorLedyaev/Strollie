#!/usr/bin/env bash
set -euo pipefail

echo "::group::(Advisory) Android native drift check"

WORKDIR=$(pwd)
TMPDIR=$(mktemp -d)
echo "Creating temp project copy in $TMPDIR" >&2

# Копируем проект, исключая тяжёлые build артефакты
rsync -a \
  --exclude 'android/.gradle' \
  --exclude 'android/**/build' \
  --exclude 'android/**/intermediates' \
  --exclude 'android/local.properties' \
  ./ "$TMPDIR/proj" >/dev/null 2>&1

pushd "$TMPDIR/proj" >/dev/null

echo "Running expo prebuild (android) --no-install --non-interactive" >&2
npx --yes expo prebuild --platform android --no-install --non-interactive >/dev/null 2>&1 || true

# Формируем diff: recursive unified, игнорируем изменяемые runtime каталоги
FILTERED_DIFF=$(diff -ru \
  --exclude=build \
  --exclude=.gradle \
  --exclude=intermediates \
  --exclude=local.properties \
  "$WORKDIR/android" android || true)

if [[ -z "$FILTERED_DIFF" ]]; then
  echo "NO_DRIFT"
  echo "drift=none" >> "$GITHUB_OUTPUT" 2>/dev/null || true
else
  echo "DRIFT_DETECTED"
  echo "drift=detected" >> "$GITHUB_OUTPUT" 2>/dev/null || true
  echo "$FILTERED_DIFF"
fi

popd >/dev/null
echo "Drift check is advisory only (no failure)."
echo "::endgroup::"