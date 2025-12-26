import streamlit as st
import pandas as pd
import json
import time
from io import BytesIO

# ==================== PAGE CONFIG & CSS ====================
st.set_page_config(
    page_title="Andor Localization OS",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS to mimic the React/Tailwind look
st.markdown("""
<style>
    /* General Reset */
    .stApp {
        background-color: #f8fafc;
        font-family: 'Inter', sans-serif;
    }
    
    /* Header */
    .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background: white;
        border-bottom: 1px solid #e2e8f0;
        margin-bottom: 2rem;
    }
    .logo-text {
        font-size: 1.25rem;
        font-weight: 800;
        color: #0f172a;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .logo-box {
        background-color: #2563eb;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }

    /* Scenario Cards */
    .scenario-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
    }
    .scenario-card {
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        padding: 1.5rem;
        transition: all 0.2s ease;
        cursor: pointer;
        text-decoration: none;
        color: inherit;
        display: block;
        height: 100%;
    }
    .scenario-card:hover {
        border-color: #3b82f6;
        transform: translateY(-4px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .icon-box {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        margin-bottom: 1rem;
    }
    .card-title {
        font-weight: 700;
        font-size: 1.1rem;
        color: #1e293b;
        margin-bottom: 0.5rem;
    }
    .card-desc {
        color: #64748b;
        font-size: 0.9rem;
        line-height: 1.5;
    }

    /* Button Styling */
    .stButton > button {
        border-radius: 8px;
        font-weight: 600;
        border: none;
        padding: 0.5rem 1rem;
        transition: all 0.2s;
    }
    /* Primary Action Button */
    div[data-testid="stVerticalBlock"] > div > div[data-testid="stButton"] > button {
        width: 100%;
    }
    
    /* Tables */
    div[data-testid="stDataFrame"] {
        background: white;
        padding: 1rem;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
    }
</style>
""", unsafe_allow_html=True)

# ==================== CONSTANTS ====================
SCENARIOS = {
    'app-store': {
        'title': 'App Store & ASO',
        'icon': '📱',
        'color': '#eff6ff', # blue-50
        'text_color': '#2563eb', # blue-600
        'desc': 'Optimized for Play Store/App Store. Enforces character limits for Titles.'
    },
    'marketing': {
        'title': 'Marketing & Social',
        'icon': '📢',
        'color': '#faf5ff', # purple-50
        'text_color': '#9333ea', # purple-600
        'desc': 'Focus on persuasive tone. Generate witty/urgent variations for ads.'
    },
    'dev-strings': {
        'title': 'Software Strings',
        'icon': '💻',
        'color': '#f1f5f9', # slate-50
        'text_color': '#475569', # slate-600
        'desc': 'Handles variables ({name}, %s) and key-value pairs for JSON/XML.'
    },
    'seo': {
        'title': 'Website & SEO',
        'icon': '🌐',
        'color': '#f0fdf4', # green-50
        'text_color': '#16a34a', # green-600
        'desc': 'Preserves HTML tags. Protects keywords and generates meta tags.'
    },
    'general': {
        'title': 'General / Bulk',
        'icon': '📄',
        'color': '#fff7ed', # orange-50
        'text_color': '#ea580c', # orange-600
        'desc': 'Utility tool for large documents without specific constraints.'
    }
}

# ==================== STATE MANAGEMENT ====================
if 'view' not in st.session_state: st.session_state.view = 'landing'
if 'scenario' not in st.session_state: st.session_state.scenario = None
if 'input_text' not in st.session_state: st.session_state.input_text = ""
if 'results' not in st.session_state: st.session_state.results = None

# ==================== HEADER ====================
def render_header():
    col1, col2 = st.columns([1, 1])
    with col1:
        st.markdown("""
        <div class="logo-text">
            <div class="logo-box">A</div>
            Andor LocalizeOS
        </div>
        """, unsafe_allow_html=True)
    with col2:
        if st.session_state.view == 'workspace':
            if st.button("← Back to Dashboard", use_container_width=False):
                st.session_state.view = 'landing'
                st.session_state.results = None
                st.rerun()

# ==================== HELPER FUNCTIONS ====================
def mock_translate(text, target_lang):
    # This is where your API logic goes
    return f"[{target_lang.upper()}] {text}"

def generate_db_format(source, target):
    return f'"{source}"="{target}";'

# ==================== VIEW: LANDING ====================
if st.session_state.view == 'landing':
    render_header()
    
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("<h1 style='text-align: center; font-size: 3rem; margin-bottom: 1rem;'>What are we localizing today?</h1>", unsafe_allow_html=True)
    st.markdown("<p style='text-align: center; color: #64748b; margin-bottom: 3rem;'>Select a context to ensure perfect tone and technical constraints.</p>", unsafe_allow_html=True)

    # Creating the Grid layout manually with columns
    cols = st.columns(3)
    keys = list(SCENARIOS.keys())
    
    # We iterate to place cards in the 3 columns
    for i, key in enumerate(keys):
        scen = SCENARIOS[key]
        col = cols[i % 3]
        
        with col:
            # We use a container with a border to mimic the card
            with st.container(border=True):
                st.markdown(f"""
                <div style="background-color: {scen['color']}; color: {scen['text_color']}; width: 48px; height: 48px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 1rem;">
                    {scen['icon']}
                </div>
                <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700;">{scen['title']}</h3>
                <p style="color: #64748b; font-size: 0.9rem; margin-top: 0.5rem; height: 60px;">{scen['desc']}</p>
                """, unsafe_allow_html=True)
                
                if st.button(f"Select {scen['title']}", key=f"btn_{key}", use_container_width=True):
                    st.session_state.scenario = key
                    st.session_state.view = 'workspace'
                    st.rerun()

# ==================== VIEW: WORKSPACE ====================
elif st.session_state.view == 'workspace':
    render_header()
    
    scen_data = SCENARIOS[st.session_state.scenario]
    
    # Workspace Layout: Sidebar (Left) + Main (Right)
    col_config, col_main = st.columns([1, 3])
    
    # --- CONFIGURATION COLUMN ---
    with col_config:
        st.markdown(f"### {scen_data['icon']} {scen_data['title']}")
        st.markdown("---")
        
        st.caption("TARGET LANGUAGES")
        langs = st.multiselect(
            "Select languages",
            ['Portuguese (BR)', 'Spanish', 'French', 'German', 'Indonesian', 'Thai'],
            default=['Portuguese (BR)', 'Spanish']
        )
        
        st.markdown("<br>", unsafe_allow_html=True)
        st.caption("SETTINGS")
        
        if st.session_state.scenario == 'app-store':
            st.checkbox("Enforce 80 char limit", value=True)
            st.checkbox("Enforce Subtitle limit", value=True)
            st.info("⚠️ Warnings will appear for long strings.")
            
        elif st.session_state.scenario == 'dev-strings':
            st.radio("Export Format", ["JSON", "XML", "Code (\"key\"=\"val\")"])
            
        elif st.session_state.scenario == 'marketing':
            st.select_slider("Tone", options=["Professional", "Casual", "Urgent"])
            
        else:
            st.write("No specific constraints.")
            
        st.markdown("---")
        
        # Action Button
        if st.button("🚀 Translate Content", type="primary", use_container_width=True):
            if st.session_state.input_text:
                with st.spinner("Processing..."):
                    time.sleep(1) # Fake loading
                    st.session_state.results = "done"
            else:
                st.error("Please enter text first.")

    # --- MAIN CONTENT COLUMN ---
    with col_main:
        # Input Tabs
        tab_input, tab_file = st.tabs(["✍️ Type / Paste", "📁 Upload File"])
        
        with tab_input:
            st.session_state.input_text = st.text_area(
                "Source Content (English)", 
                height=200, 
                placeholder="Unlimited Remove Background\nAI Duo Video\n%s-day free trial...",
                help="Enter one phrase per line"
            )
            
        with tab_file:
            st.file_uploader("Upload CSV/Excel", type=['csv', 'xlsx'])

        # --- RESULTS AREA ---
        if st.session_state.results == "done":
            st.markdown("---")
            st.subheader("📊 Results")
            
            # Process Data
            lines = [x.strip() for x in st.session_state.input_text.split('\n') if x.strip()]
            data = []
            
            # Simulate processing logic
            for line in lines:
                row = {'Source (English)': line}
                
                # Check constraints (Example: App Store limit)
                status = "✅"
                if st.session_state.scenario == 'app-store' and len(line) > 80:
                    status = "⚠️ Too Long"
                
                for lang in langs:
                    # Mock Translation
                    trans = mock_translate(line, lang[:2].lower())
                    row[lang] = trans
                    
                    # Create the specific Code format logic you requested
                    if st.session_state.scenario == 'dev-strings':
                        row[f'{lang} (Code)'] = generate_db_format(line, trans)
                
                row['Status'] = status
                data.append(row)
                
            df = pd.DataFrame(data)
            
            # 1. Show interactive table
            st.dataframe(df, use_container_width=True, hide_index=True)
            
            # 2. Export Actions
            c1, c2, c3 = st.columns(3)
            with c1:
                csv = df.to_csv(index=False).encode('utf-8')
                st.download_button("📥 Download CSV", data=csv, file_name="localized.csv", mime="text/csv", use_container_width=True)
            with c2:
                # Example JSON export
                json_str = df.to_json(orient="records")
                st.download_button("📥 Download JSON", data=json_str, file_name="localized.json", mime="application/json", use_container_width=True)
            with c3:
                if st.button("📋 Copy for Devs", use_container_width=True):
                    st.toast("Copied to clipboard! (Simulated)")
            
            # 3. Special View for Devs (The Format you wanted)
            if st.session_state.scenario == 'dev-strings':
                st.markdown("### 💻 Developer Snippet")
                st.info("Copy this directly into your codebase:")
                
                code_snippet = ""
                # Get the first selected language for the snippet
                target_lang = langs[0] if langs else "Spanish"
                
                for row in data:
                    code_snippet += f'"{row["Source (English)"]}"="{row[target_lang]}";\n'
                    
                st.code(code_snippet, language="java")

# ==================== FOOTER ====================
st.markdown("""
<div style="text-align: center; margin-top: 4rem; color: #cbd5e1; font-size: 0.8rem;">
    Andor Internal Tools | v2.0
</div>
""", unsafe_allow_html=True)