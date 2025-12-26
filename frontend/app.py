import streamlit as st
import pandas as pd
import json
from datetime import datetime
from enum import Enum
from typing import List, Dict

# ==================== PAGE CONFIG ====================
st.set_page_config(
    page_title="Localization Tool",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ==================== CONSTANTS ====================

SCENARIOS = {
    'app-store': {
        'title': 'App Store & ASO',
        'icon': '📱',
        'description': 'Optimized for Play Store & App Store. Enforces character limits for Titles and Short Descriptions.',
        'color': '#0EA5E9'
    },
    'marketing': {
        'title': 'Marketing & Social',
        'icon': '📢',
        'description': 'Focus on persuasive tone. Generate variations (witty, urgent) for ads and posts.',
        'color': '#A855F7'
    },
    'website-seo': {
        'title': 'Website & SEO',
        'icon': '🌐',
        'description': 'Preserves HTML tags. Protects keywords and generates meta tags.',
        'color': '#10B981'
    },
    'dev-strings': {
        'title': 'Software Strings',
        'icon': '⚙️',
        'description': 'Handles variables ({name}, %s) and key-value pairs for JSON/XML.',
        'color': '#6B7280'
    },
    'general': {
        'title': 'General / Bulk',
        'icon': '📄',
        'description': 'Utility tool for large documents or spreadsheets without specific constraints.',
        'color': '#F97316'
    }
}

LANGUAGES = [
    {'code': 'es', 'name': 'Spanish'},
    {'code': 'fr', 'name': 'French'},
    {'code': 'de', 'name': 'German'},
    {'code': 'ja', 'name': 'Japanese'},
    {'code': 'pt-br', 'name': 'Portuguese (Brazil)'},
    {'code': 'pt-pt', 'name': 'Portuguese (Portugal)'},
    {'code': 'it', 'name': 'Italian'},
    {'code': 'ru', 'name': 'Russian'},
    {'code': 'zh', 'name': 'Chinese'},
]

# ==================== SESSION STATE INITIALIZATION ====================

if 'view' not in st.session_state:
    st.session_state.view = 'landing'  # 'landing' or 'workspace'

if 'selected_scenario' not in st.session_state:
    st.session_state.selected_scenario = None

if 'selected_languages' not in st.session_state:
    st.session_state.selected_languages = ['es']

if 'input_text' not in st.session_state:
    st.session_state.input_text = ''

if 'input_mode' not in st.session_state:
    st.session_state.input_mode = 'text'

if 'results' not in st.session_state:
    st.session_state.results = None

if 'table_data' not in st.session_state:
    st.session_state.table_data = []

if 'settings' not in st.session_state:
    st.session_state.settings = {
        'enforce_limit': True,
        'preserve_html': True,
        'tone': 'Professional',
        'protected_keywords': ''
    }

# ==================== HELPER FUNCTIONS ====================

def mock_translate(text: str, lang_code: str) -> str:
    """Mock translation function"""
    lang_names = {'es': 'Spanish', 'fr': 'French', 'de': 'German', 'ja': 'Japanese', 'pt-br': 'Portuguese (Brazil)', 'pt-pt': 'Portuguese (Portugal)', 'it': 'Italian'}
    return f"[{lang_names.get(lang_code, lang_code).upper()}] {text}"

def generate_table_data(text: str, scenario_id: str, lang_code: str) -> List[Dict]:
    """Generate table data from input text"""
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    data = []
    for idx, line in enumerate(lines):
        warning = None
        if scenario_id == 'app-store' and len(line) > 80:
            warning = '⚠️ Source exceeds 80 chars'
        
        data.append({
            'ID': idx + 1,
            'Source (English)': line,
            'Target (First Language)': mock_translate(line, lang_code),
            'Status': '✅ Ready' if len(line) > 0 else '⏳ Empty',
            'Warning': warning if warning else ''
        })
    return data

def export_to_csv(data: List[Dict]) -> str:
    """Convert data to CSV format"""
    df = pd.DataFrame(data)
    return df.to_csv(index=False)

def export_to_json(data: List[Dict]) -> str:
    """Convert data to JSON format"""
    return json.dumps(data, indent=2)

# ==================== STYLING ====================

st.markdown("""
<style>
    .main {
        padding: 0rem;
    }
    .scenario-card {
        padding: 1.5rem;
        border-radius: 0.75rem;
        border: 2px solid #e2e8f0;
        background-color: white;
        transition: all 0.2s;
        cursor: pointer;
    }
    .scenario-card:hover {
        border-color: #0EA5E9;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-4px);
    }
    .stTabs [data-baseweb="tab-list"] button {
        font-size: 14px;
        font-weight: 600;
    }
    .result-table {
        width: 100%;
        border-collapse: collapse;
    }
    .result-table th {
        background-color: #f8fafc;
        color: #64748b;
        font-weight: 600;
        padding: 12px;
        text-align: left;
        font-size: 12px;
        border-bottom: 1px solid #e2e8f0;
    }
    .result-table td {
        padding: 12px;
        border-bottom: 1px solid #f1f5f9;
    }
    .result-table tr:hover {
        background-color: #fafbfc;
    }
    .header-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        border-bottom: 1px solid #e2e8f0;
        background-color: white;
    }
    .success-box {
        background-color: #ecfdf5;
        border: 1px solid #d1fae5;
        border-radius: 0.75rem;
        padding: 2rem;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# ==================== LANDING VIEW ====================

if st.session_state.view == 'landing':
    # Header
    col1, col2 = st.columns([1, 4])
    with col1:
        st.markdown("### 🌐 Localization Tool")
    with col2:
        st.write("")

    st.markdown("---")
    
    # Hero Section
    st.markdown("""
    <div style="text-align: center; padding: 2rem 0;">
        <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">
            What are we localizing today?
        </h1>
        <p style="font-size: 1.1rem; color: #64748b; max-width: 700px; margin: 0 auto;">
            Select a context below to ensure the perfect tone, format, and technical constraints for your translation project.
        </p>
    </div>
    """, unsafe_allow_html=True)

    st.write("")

    # Scenario Grid (3 columns)
    cols = st.columns(3)
    
    scenario_list = list(SCENARIOS.items())
    for idx, (scenario_id, scenario_data) in enumerate(scenario_list):
        with cols[idx % 3]:
            if st.button(
                f"{scenario_data['icon']} **{scenario_data['title']}**\n\n{scenario_data['description']}",
                key=f"scenario_{scenario_id}",
                use_container_width=True
            ):
                st.session_state.selected_scenario = scenario_id
                st.session_state.view = 'workspace'
                st.session_state.results = None
                st.session_state.input_text = ''
                st.rerun()

# ==================== WORKSPACE VIEW ====================

else:
    scenario_id = st.session_state.selected_scenario
    scenario = SCENARIOS[scenario_id]

    # Header with Back Button
    col1, col2, col3 = st.columns([1, 3, 1])
    with col1:
        if st.button("← Back", use_container_width=True):
            st.session_state.view = 'landing'
            st.rerun()
    
    with col2:
        st.markdown(f"### {scenario['icon']} {scenario['title']} Project")
    
    with col3:
        col_a, col_b = st.columns(2)
        with col_a:
            st.button("Save Draft", use_container_width=True)
        with col_b:
            st.button("Export", use_container_width=True)

    st.markdown("---")

    # Main Layout - Sidebar + Content
    col_sidebar, col_main = st.columns([1, 3])

    # ==================== SIDEBAR ====================
    with col_sidebar:
        st.markdown("#### 🎯 Target Languages")
        
        # Language Selection
        for lang in LANGUAGES:
            col_check, col_name = st.columns([0.2, 0.8])
            with col_check:
                is_selected = st.checkbox(
                    label=" ",
                    value=lang['code'] in st.session_state.selected_languages,
                    key=f"lang_{lang['code']}"
                )
            with col_name:
                st.write(lang['name'])
            
            if is_selected and lang['code'] not in st.session_state.selected_languages:
                st.session_state.selected_languages.append(lang['code'])
            elif not is_selected and lang['code'] in st.session_state.selected_languages:
                st.session_state.selected_languages.remove(lang['code'])

        st.markdown("---")

        st.markdown("#### ⚙️ Context Settings")

        # Dynamic Settings based on Scenario
        if scenario_id == 'app-store':
            st.session_state.settings['enforce_limit'] = st.checkbox(
                "Enforce 80 char limit",
                value=st.session_state.settings['enforce_limit']
            )
            st.info("⚠️ Warnings will appear in the table for long strings.")

        elif scenario_id == 'marketing':
            st.session_state.settings['tone'] = st.selectbox(
                "Tone of Voice",
                ["Professional", "Witty / Casual", "Urgent / Sales", "Friendly"],
                index=0
            )
            st.checkbox("Generate Variations", value=True)

        elif scenario_id == 'website-seo':
            st.session_state.settings['preserve_html'] = st.checkbox(
                "Protect HTML Tags",
                value=st.session_state.settings['preserve_html']
            )
            st.session_state.settings['protected_keywords'] = st.text_area(
                "Protected Keywords",
                placeholder="Enter keywords to keep in English (e.g. React, API)...",
                height=80
            )

        else:
            st.caption("Standard localization rules apply. No specific constraints selected.")

        st.markdown("---")

        # Translate Button
        if st.button(
            "🚀 Translate Content",
            use_container_width=True,
            type="primary",
            disabled=not st.session_state.input_text and st.session_state.input_mode == 'text'
        ):
            st.session_state.results = 'processing'

    # ==================== MAIN CONTENT AREA ====================
    with col_main:
        
        # Input Mode Toggle
        input_mode = st.radio(
            "Input Mode",
            ["Type or Paste", "Upload File"],
            horizontal=True,
            label_visibility="collapsed"
        )
        st.session_state.input_mode = 'text' if input_mode == 'Type or Paste' else 'file'

        # ===== INPUT SECTION =====
        if st.session_state.results is None:
            if st.session_state.input_mode == 'text':
                st.markdown("##### 📝 Source Content (English)")
                text_input = st.text_area(
                    label="input_text",
                    placeholder=f"Enter your {scenario['title']} content here.\nEach new line will be treated as a separate entry...",
                    height=350,
                    label_visibility="collapsed"
                )
                st.session_state.input_text = text_input

                # Character Count
                st.caption(f"📊 {len(text_input)} chars • {len([l for l in text_input.split(chr(10)) if l.strip()])} lines")

            else:
                st.markdown("##### 📁 Upload File")
                uploaded_file = st.file_uploader(
                    "Upload a file",
                    type=['csv', 'xlsx', 'json', 'xml', 'txt'],
                    label_visibility="collapsed"
                )
                if uploaded_file:
                    st.success(f"✅ File uploaded: {uploaded_file.name}")
                    st.session_state.input_text = f"[File: {uploaded_file.name}]"

        # ===== PROCESSING STATE =====
        elif st.session_state.results == 'processing':
            with st.spinner("🔄 Analyzing & Localizing..."):
                import time
                progress_bar = st.progress(0)
                for i in range(101):
                    progress_bar.progress(i)
                    time.sleep(0.02)
            
            # Generate Results
            if len(st.session_state.input_text) > 300 or st.session_state.input_mode == 'file':
                st.session_state.results = 'file-success'
            else:
                table_data = generate_table_data(
                    st.session_state.input_text,
                    scenario_id,
                    st.session_state.selected_languages[0]
                )
                st.session_state.table_data = table_data
                st.session_state.results = 'table'
            
            st.rerun()

        # ===== RESULTS: TABLE VIEW =====
        elif st.session_state.results == 'table':
            st.markdown("##### 📋 Localization Results")
            
            col_export1, col_export2, col_export3 = st.columns([2, 1, 1])
            with col_export2:
                csv_data = export_to_csv(st.session_state.table_data)
                st.download_button(
                    label="📥 CSV",
                    data=csv_data,
                    file_name=f"localization_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                    mime="text/csv"
                )
            with col_export3:
                json_data = export_to_json(st.session_state.table_data)
                st.download_button(
                    label="📥 JSON",
                    data=json_data,
                    file_name=f"localization_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                    mime="application/json"
                )

            # Results Table
            df = pd.DataFrame(st.session_state.table_data)
            st.dataframe(
                df,
                use_container_width=True,
                height=400,
                hide_index=True
            )

            st.markdown("---")
            if st.button("🔄 Process Another", use_container_width=True):
                st.session_state.results = None
                st.session_state.input_text = ''
                st.rerun()

        # ===== RESULTS: FILE SUCCESS =====
        elif st.session_state.results == 'file-success':
            st.markdown('<div class="success-box">', unsafe_allow_html=True)
            st.success("✅ **Processing Complete!**")
            st.markdown(f"""
            Your file has been processed for **{len(st.session_state.selected_languages)} languages**.
            
            All constraints for **{scenario['title']}** were applied successfully.
            """)
            
            col_down1, col_down2 = st.columns(2)
            with col_down1:
                st.download_button(
                    label="📦 Download All (.zip)",
                    data="zip_file_content",
                    file_name=f"localization_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip",
                    mime="application/zip"
                )
            with col_down2:
                st.download_button(
                    label="📄 Download Report (.pdf)",
                    data="pdf_report_content",
                    file_name=f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
                    mime="application/pdf"
                )
            
            st.markdown('</div>', unsafe_allow_html=True)

            st.markdown("---")
            if st.button("🔄 Process Another File", use_container_width=True):
                st.session_state.results = None
                st.session_state.input_text = ''
                st.rerun()

    # Footer
    st.markdown("---")
    st.caption(f"© 2025 Localization Tool | Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

# ==================== STYLING ====================

st.markdown("""
<style>
    .main {
        padding: 0rem;
    }
    .card {
        padding: 1.5rem;
        border-radius: 0.75rem;
        border: 1px solid #e0e0e0;
        background-color: white;
        transition: all 0.2s;
    }
    .card:hover {
        border-color: #0ea5e9;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    .section-header {
        font-size: 1.3rem;
        font-weight: 700;
        margin: 1.5rem 0 1rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #f0f0f0;
    }
    .input-section {
        background: #f9f9f9;
        padding: 1.5rem;
        border-radius: 0.5rem;
        border: 1px solid #e0e0e0;
    }
    .button-group {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
</style>
""", unsafe_allow_html=True)

# ==================== HEADER ====================

st.markdown("""
<div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; border-bottom: 1px solid #e0e0e0; background: white; margin: -2rem -2rem 2rem -2rem;">
    <div style="font-size: 1.5rem; font-weight: 700;">🌐 Localization Tool</div>
    <div style="font-size: 0.9rem; color: #666;">Internal CMS</div>
</div>
""", unsafe_allow_html=True)

# ==================== MAIN APP LOGIC ====================

if st.session_state.view == 'home':
    # HOME VIEW
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("<div class='section-header'>📄 Input Options</div>", unsafe_allow_html=True)
        
        input_option = st.radio(
            "Choose input method:",
            ["Single Word", "Paste Multiple Lines", "Upload CSV/Excel"],
            label_visibility="collapsed"
        )
        
        if input_option == "Single Word":
            st.session_state.input_mode = 'word'
            word = st.text_input("Enter a single word or phrase:", placeholder="e.g., AI Duo Video")
            if word:
                st.session_state.input_text = word
                if st.button("Localize Now →", use_container_width=True, type="primary"):
                    st.session_state.view = 'editor'
                    st.session_state.results = None
                    st.rerun()
        
        elif input_option == "Paste Multiple Lines":
            st.session_state.input_mode = 'text'
            text = st.text_area(
                "Paste your content (one item per line):",
                height=200,
                placeholder="Your Plus Subscription will begin and you'll be charged. Cancel anytime before.\nUnlimited Remove Background\nAI Backgrounds\nBatch Edit"
            )
            if text:
                st.session_state.input_text = text
                if st.button("Localize Now →", use_container_width=True, type="primary"):
                    st.session_state.view = 'editor'
                    st.session_state.results = None
                    st.rerun()
        
        else:  # Upload
            st.session_state.input_mode = 'csv'
            uploaded_file = st.file_uploader(
                "Upload CSV or Excel file",
                type=['csv', 'xlsx'],
                label_visibility="collapsed"
            )
            if uploaded_file:
                try:
                    if uploaded_file.name.endswith('csv'):
                        lines = parse_csv_file(uploaded_file)
                    else:
                        lines = parse_excel_file(uploaded_file)
                    
                    st.session_state.input_text = '\n'.join(lines[:50])  # Limit display
                    st.success(f"✅ Loaded {len(lines)} unique strings")
                    if st.button("Localize Now →", use_container_width=True, type="primary"):
                        st.session_state.view = 'editor'
                        st.session_state.results = None
                        st.rerun()
                except Exception as e:
                    st.error(f"Error parsing file: {e}")
    
    with col2:
        st.markdown("<div class='section-header'>🌍 Select Languages</div>", unsafe_allow_html=True)
        
        lang_filter = st.radio(
            "Filter languages:",
            ["Most Used", "All Languages"],
            horizontal=True,
            label_visibility="collapsed"
        )
        
        display_langs = COMMON_LANGUAGES if lang_filter == "Most Used" else ALL_LANGUAGES
        
        # Create language selection
        st.session_state.selected_languages = []
        for lang in display_langs:
            if st.checkbox(f"{lang['flag']} {lang['name']}", key=f"home_lang_{lang['code']}"):
                st.session_state.selected_languages.append(lang['code'])
        
        if not st.session_state.selected_languages:
            st.warning("⚠️ Please select at least one language")
        
        st.markdown("---")
        st.markdown("<div class='section-header'>⚙️ Output Format</div>", unsafe_allow_html=True)
        st.session_state.table_format = st.radio(
            "Table format:",
            list(TABLE_FORMATS.keys()),
            format_func=lambda x: TABLE_FORMATS[x],
            label_visibility="collapsed"
        )

else:
    # EDITOR VIEW
    col_sidebar, col_main = st.columns([1, 3])
    
    with col_sidebar:
        st.markdown("<div class='section-header'>🔧 Settings</div>", unsafe_allow_html=True)
        
        # Change languages
        if st.button("✏️ Change Languages", use_container_width=True):
            st.session_state.view = 'home'
            st.rerun()
        
        st.markdown("**Selected Languages:**")
        for lang_code in st.session_state.selected_languages:
            lang_name = next((l['name'] for l in ALL_LANGUAGES if l['code'] == lang_code), lang_code)
            st.caption(f"✓ {lang_name}")
        
        st.markdown("---")
        
        st.markdown("**Table Format:**")
        st.caption(TABLE_FORMATS[st.session_state.table_format])
        
        st.markdown("**Export Format:**")
        st.session_state.export_format = st.selectbox(
            "Choose export format:",
            list(EXPORT_FORMATS.keys()),
            format_func=lambda x: EXPORT_FORMATS[x],
            label_visibility="collapsed"
        )
        
        st.markdown("---")
        
        # Process Button
        if st.button("🚀 Generate Localizations", use_container_width=True, type="primary"):
            if st.session_state.input_text and st.session_state.selected_languages:
                st.session_state.results = 'processing'
                st.rerun()
    
    with col_main:
        st.markdown("<div class='section-header'>📝 Input Preview</div>", unsafe_allow_html=True)
        
        lines = [line.strip() for line in st.session_state.input_text.split('\n') if line.strip()]
        
        col_info1, col_info2 = st.columns(2)
        with col_info1:
            st.metric("Items", len(lines))
        with col_info2:
            st.metric("Languages", len(st.session_state.selected_languages))
        
        with st.expander("View input content", expanded=False):
            st.text_area("Content:", value=st.session_state.input_text, height=150, disabled=True)
        
        # ===== PROCESSING =====
        if st.session_state.results == 'processing':
            with st.spinner("🔄 Processing localizations..."):
                import time
                progress_bar = st.progress(0)
                for i in range(101):
                    progress_bar.progress(i)
                    time.sleep(0.01)
            
            # Generate data
            if st.session_state.table_format == 'simple':
                data = generate_simple_table_data(lines, st.session_state.selected_languages)
            else:
                data = generate_database_format_data(lines, st.session_state.selected_languages)
            
            st.session_state.table_data = data
            st.session_state.results = 'table'
            st.rerun()
        
        # ===== RESULTS TABLE =====
        if st.session_state.results == 'table' and st.session_state.table_data:
            st.markdown("<div class='section-header'>📊 Results</div>", unsafe_allow_html=True)
            
            # Export buttons
            col_btn1, col_btn2, col_btn3, col_btn4 = st.columns(4)
            
            df = pd.DataFrame(st.session_state.table_data)
            
            with col_btn1:
                if st.session_state.export_format == 'csv':
                    csv_data = export_to_csv_format(st.session_state.table_data)
                    st.download_button(
                        "📥 CSV",
                        data=csv_data,
                        file_name=f"localizations_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                        mime="text/csv"
                    )
            
            with col_btn2:
                if st.session_state.export_format == 'excel':
                    excel_data = export_to_excel_format(st.session_state.table_data)
                    st.download_button(
                        "📥 Excel",
                        data=excel_data,
                        file_name=f"localizations_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx",
                        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    )
            
            with col_btn3:
                if st.session_state.export_format == 'json':
                    json_data = export_to_json_format(st.session_state.table_data)
                    st.download_button(
                        "📥 JSON",
                        data=json_data,
                        file_name=f"localizations_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                        mime="application/json"
                    )
            
            with col_btn4:
                if st.session_state.export_format == 'xml':
                    xml_data = export_to_xml_format(st.session_state.table_data)
                    st.download_button(
                        "📥 XML",
                        data=xml_data,
                        file_name=f"localizations_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xml",
                        mime="application/xml"
                    )
            
            st.markdown("---")
            
            # Display table
            st.dataframe(
                df,
                use_container_width=True,
                height=400,
                hide_index=True
            )
            
            st.markdown("---")
            
            # Copy to clipboard option
            json_output = json.dumps(st.session_state.table_data, ensure_ascii=False, indent=2)
            st.markdown("**Quick Copy (JSON):**")
            st.code(json_output, language="json")
            
            # New localization button
            col_new, col_edit = st.columns(2)
            with col_new:
                if st.button("➕ New Localization", use_container_width=True):
                    st.session_state.view = 'home'
                    st.session_state.input_text = ''
                    st.session_state.results = None
                    st.rerun()
            with col_edit:
                if st.button("✏️ Edit & Reprocess", use_container_width=True):
                    st.session_state.results = None

# ==================== FOOTER ====================
st.markdown("---")
st.caption(f"🌐 Localization Tool | © 2025 Andor | Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")