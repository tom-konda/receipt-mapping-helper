#!/bin/bash
# PostToolUse hook: AGENT.md 編集時にレビューエージェントの実行を促す
# jq 不要。Git Bash (Windows) / bash (macOS) 両対応。
INPUT=$(cat)

if echo "$INPUT" | grep -q '"file_path".*[/\\]AGENT\.md"'; then
  echo '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"AGENT.md が編集されました。agent-md-reviewer エージェントを実行して、コードを読めば明らかに分かる冗長な記述がないかチェックしてください。"}}'
fi

exit 0
