"""
Prompt module for Localizer backend.
Each scenario has its own specialized prompt for optimal translations.
"""

from .app_store_aso import get_app_store_prompt
from .marketing_social import get_marketing_social_prompt
from .website_seo import get_website_seo_prompt
from .software_strings import get_software_strings_prompt
from .general_bulk import get_general_bulk_prompt
from .quality_assurance import get_quality_assurance_prompt

# Scenario ID to prompt function mapping
PROMPT_MAP = {
    'app-store': get_app_store_prompt,
    'marketing': get_marketing_social_prompt,
    'website': get_website_seo_prompt,
    'software': get_software_strings_prompt,
    'general': get_general_bulk_prompt,
}

def get_prompt_for_scenario(scenario_id, text, lang, location=""):
    """
    Get the appropriate prompt (system_prompt, user_prompt) for a given scenario.
    
    Args:
        scenario_id: One of 'app-store', 'marketing', 'website', 'software', 'general'
        text: The text to translate
        lang: Target language
        location: Optional context/location hint
        
    Returns:
        Tuple of (system_prompt, user_prompt)
    """
    prompt_func = PROMPT_MAP.get(scenario_id, get_general_bulk_prompt)
    return prompt_func(text, lang, location)

def get_qa_prompt(entries, lang, scenario="general"):
    """
    Helper to build QA verification prompts for a batch.
    entries: list of {source, translation}
    """
    return get_quality_assurance_prompt(entries, lang, scenario)

__all__ = [
    'get_app_store_prompt',
    'get_marketing_social_prompt', 
    'get_website_seo_prompt',
    'get_software_strings_prompt',
    'get_general_bulk_prompt',
    'get_prompt_for_scenario',
    'get_qa_prompt',
    'PROMPT_MAP',
]
