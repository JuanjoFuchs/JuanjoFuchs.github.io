"""Extract user-typed prompts from Claude Code session logs.

Usage:
    python scripts/extract_prompts.py [--project PATTERN] [--min-words N] [--output FILE]

Scans C:\\Users\\jfuchs\\.claude\\projects\\ for .jsonl session files,
extracts only genuine user-typed prompts (not tool results, not meta),
and writes them to a JSONL file for analysis.
"""

import json
import glob
import os
import argparse
from pathlib import Path
from datetime import datetime

CLAUDE_DIR = Path.home() / ".claude" / "projects"


def is_user_prompt(record: dict) -> bool:
    """Filter for genuine user-typed prompts."""
    if record.get("type") != "user":
        return False
    if record.get("isMeta", False):
        return False
    if record.get("isSidechain", False):
        return False
    content = record.get("message", {}).get("content")
    # Real prompts are strings, tool results are arrays
    if not isinstance(content, str):
        return False
    # Skip empty or very short prompts (like "y", "yes", "no")
    if len(content.strip()) < 5:
        return False
    return True


def extract_from_file(filepath: str) -> list[dict]:
    """Extract user prompts from a single .jsonl session file."""
    prompts = []
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                continue
            if is_user_prompt(record):
                prompts.append({
                    "text": record["message"]["content"],
                    "timestamp": record.get("timestamp", ""),
                    "session": record.get("sessionId", ""),
                    "slug": record.get("slug", ""),
                    "project": os.path.basename(os.path.dirname(filepath)),
                    "word_count": len(record["message"]["content"].split()),
                })
    return prompts


def main():
    parser = argparse.ArgumentParser(description="Extract user prompts from Claude Code logs")
    parser.add_argument("--project", default="*", help="Project folder pattern (default: all)")
    parser.add_argument("--min-words", type=int, default=10, help="Minimum word count to include (default: 10)")
    parser.add_argument("--output", default="prompts_extracted.jsonl", help="Output file path")
    parser.add_argument("--stats", action="store_true", help="Print statistics only, don't write file")
    args = parser.parse_args()

    pattern = str(CLAUDE_DIR / args.project / "*.jsonl")
    files = glob.glob(pattern)
    print(f"Found {len(files)} session files matching '{args.project}'")

    all_prompts = []
    for filepath in files:
        all_prompts.extend(extract_from_file(filepath))

    # Filter by minimum word count
    all_prompts = [p for p in all_prompts if p["word_count"] >= args.min_words]

    # Sort by timestamp
    all_prompts.sort(key=lambda p: p["timestamp"])

    # Stats
    total_words = sum(p["word_count"] for p in all_prompts)
    projects = set(p["project"] for p in all_prompts)
    sessions = set(p["session"] for p in all_prompts)

    print(f"\nExtracted {len(all_prompts)} prompts")
    print(f"Total words: {total_words:,}")
    print(f"Average words per prompt: {total_words / len(all_prompts):.1f}" if all_prompts else "")
    print(f"Projects: {len(projects)}")
    print(f"Sessions: {len(sessions)}")
    print(f"\nWord count distribution:")
    brackets = [(10, 25), (25, 50), (50, 100), (100, 200), (200, 500), (500, float("inf"))]
    for low, high in brackets:
        count = sum(1 for p in all_prompts if low <= p["word_count"] < high)
        label = f"{low}-{high-1}" if high != float("inf") else f"{low}+"
        print(f"  {label} words: {count} prompts")

    if not args.stats:
        with open(args.output, "w", encoding="utf-8") as f:
            for prompt in all_prompts:
                f.write(json.dumps(prompt, ensure_ascii=False) + "\n")
        print(f"\nWritten to {args.output}")


if __name__ == "__main__":
    main()
