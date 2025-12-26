"""
Quality Assurance Prompt for Post-Localization Verification

Ensures:
- Consistency of repeated terms across the batch
- Numbers, units, and placeholders preserved correctly
- Pluralization and grammar correctness for target language
- Consistent translation for similar patterns (e.g., "1 photo", "2 photo")
- No accidental switch between languages (e.g., mix of Spanish and English)
- No changes to keys or source strings

Output strictly as JSON list of objects with keys:
[{"source": "...", "translation": "...", "notes": ["...optional"]}]
No extra text.
"""

# Editable system prompt for QA. Change this string to customize behavior.
QAprompt = (
    "You are a meticulous localization QA expert."
    " Review the batch of translations in the target language and correct issues.\n\n"
    "Return ONLY JSON with the corrected translations, preserving order. No explanations outside JSON.\n\n"
    "QA Rules (apply in order):\n"
    "1) Preserve placeholders/variables exactly ({name}, %d, %s, {{var}}).\n"
    "2) Preserve numbers and their formatting exactly (1, 2, 3, 10).\n"
    "3) Ensure consistent term translation across the batch ('photo' vs 'foto'):\n"
    "   - If a term appears multiple times, pick the most appropriate consistent translation for the language and context, then apply consistently.\n"
    "4) Fix grammar/pluralization per target language (e.g., Spanish: '1 foto', '2 fotos'; NOT '2 foto').\n"
    "5) Preserve technical acronyms and file formats (AI, JPEG, MP4).\n"
    "6) Maintain punctuation and capitalization style as appropriate for UI strings.\n"
    "7) Do NOT add marketing phrases, emojis, hashtags, exclamations, or calls-to-action.\n"
    "8) Keep tone concise and functional (UI/UX labels), avoid paraphrasing the meaning.\n"
    "9) If the translation is much longer than the source (over ~1.5x words), compress while preserving meaning.\n"
    "10) Keep conceptual safety: translate function, not problematic literal terms (e.g., 'AI Headshot' → 'AI Portrait').\n"
    "11) Never modify the 'source' text.\n\n"
    "Output format: A JSON array of objects with keys: source, translation, and optional notes."
)

def get_quality_assurance_prompt(entries, lang, scenario="general"):
    """
    Build system and user prompts for QA verification.

    entries: List[Dict] with keys {"source", "translation"}
    lang: Target language name (e.g., "Spanish")
    scenario: Scenario id for context (optional)
    """
    # Base QA prompt
    system_prompt = QAprompt

    # Build a concise user prompt with entries
    lines = []
    for item in entries:
        src = str(item.get("source", ""))
        trn = str(item.get("translation", ""))
        lines.append({"source": src, "translation": trn})

    import json
    entries_json = json.dumps(lines, ensure_ascii=False)

    # Scenario-specific guidance: restrict expansions for non-marketing contexts
    scenario_rules = []
    if scenario in ("software", "website", "app-store", "general"):
        scenario_rules.append(
            "Context is not marketing. Remove emojis, hashtags, and promotional language. Keep short UI-style phrases."
        )
        scenario_rules.append(
            "Prefer literal, natural equivalents over creative synonyms."
        )
    elif scenario == "marketing":
        scenario_rules.append(
            "Marketing context: allow brief persuasive tone, but avoid emojis/hashtags unless absolutely standard."
        )

    rules_text = "\n".join(scenario_rules)

    user_prompt = (
        f"Target language: {lang}\n"
        f"Scenario: {scenario}\n"
        f"Specific rules: {rules_text}\n\n"
        "Here is the batch to verify and correct. Return corrected JSON only.\n"
        f"Entries: {entries_json}"
    )

    return system_prompt, user_prompt
