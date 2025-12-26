// Copy to clipboard utility
export const copyToClipboard = async (text, format = 'text') => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

// Download file utility
export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Convert table data to CSV (Tab-separated for Excel)
export const tableToCSV = (tableData, languages) => {
  // Header: Source + all languages (tab-separated)
  const headers = ['Source', ...languages];
  const rows = [headers.join('\t')];
  
  // Each row: source + translations (tab-separated)
  tableData.forEach(row => {
    const values = [
      row.source,
      ...languages.map(lang => row.translations[lang] || '')
    ];
    rows.push(values.join('\t'));
  });
  
  // Add UTF-8 BOM for proper encoding
  return '\uFEFF' + rows.join('\n');
};

// Convert table data to JSON
export const tableToJSON = (tableData, languages) => {
  const result = tableData.map(row => {
    const entry = { source: row.source };
    languages.forEach(lang => {
      entry[lang] = row.translations[lang] || '';
    });
    return entry;
  });
  
  return JSON.stringify(result, null, 2);
};

// Convert table data to XML
export const tableToXML = (tableData, languages) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<localization>\n';
  
  tableData.forEach((row, idx) => {
    xml += `  <entry id="${idx + 1}">\n`;
    xml += `    <source>${escapeXml(row.source)}</source>\n`;
    languages.forEach(lang => {
      xml += `    <translation lang="${escapeXml(lang)}">${escapeXml(row.translations[lang] || '')}</translation>\n`;
    });
    xml += '  </entry>\n';
  });
  
  xml += '</localization>';
  return xml;
};

// Helper function to format key-value pairs consistently
const formatKeyValue = (key, value) => {
  return `"${key}"="${value}";`;
};

// Convert formatted table to iOS Strings format
export const tableToIOSStrings = (tableData, language) => {
  let strings = `/* ${language} Localizable.strings */\n\n`;
  tableData.forEach(row => {
    const key = row.source.replace(/"/g, '').replace(/\s+/g, '_').toLowerCase();
    const value = (row.translations[language] || '').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    strings += `"${key}" = "${value}";\n`;
  });
  return strings;
};

// Convert formatted table to Android XML format
export const tableToAndroidXML = (tableData, language) => {
  let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
  xml += `<!-- ${language} strings.xml -->\n`;
  xml += '<resources>\n';
  
  tableData.forEach(row => {
    const key = row.source.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');
    const value = escapeAndroidXml(row.translations[language] || '');
    xml += `    <string name="${key}">${value}</string>\n`;
  });
  
  xml += '</resources>\n';
  return xml;
};

// Helper to escape XML special characters
const escapeXml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Helper to escape Android XML special characters
const escapeAndroidXml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/@/g, '\\@')
    .replace(/\?/g, '\\?');
};

// Convert table to Excel (using simple CSV-like format for XLSX compatibility)
export const tableToExcel = (tableData, languages) => {
  // For now, return CSV format - in production you'd use a library like xlsx
  return tableToCSV(tableData, languages);
};
