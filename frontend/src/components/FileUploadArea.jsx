import React, { useRef, useState } from 'react';
import { Upload, AlertCircle, Check } from 'lucide-react';
import * as XLSX from 'xlsx';
import { showToast } from '../components/ToastContainer.jsx';

export default function FileUploadArea({ onFileContent, onFileInfo }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const supportedFormats = ['csv', 'xlsx', 'xls', 'txt', 'json', 'xml'];

  // Extract translatable strings from different formats
  const extractContent = {
    csv: (text) => {
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length === 0) return [];
      
      // Check if first line looks like a header (contains "source" or common column names)
      const firstLine = lines[0].toLowerCase();
      const isHeaderRow = firstLine.includes('source') || firstLine.includes('english') || firstLine.includes('language');
      
      const startIdx = isHeaderRow ? 1 : 0;
      
      return lines.slice(startIdx).map(line => {
        // Split by tab or comma
        const delimiter = line.includes('\t') ? '\t' : ',';
        const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
        // If header exists, take first column (source), otherwise take all non-empty
        if (isHeaderRow && values.length > 0) {
          return values[0]; // Source column
        }
        return values.filter(v => v && v.length > 0).join(' ');
      }).filter(line => line.trim().length > 0);
    },
    
    json: (text) => {
      try {
        const obj = JSON.parse(text);
        // Check if it's already a localization file with source fields
        if (Array.isArray(obj) && obj.length > 0 && obj[0].source) {
          return obj.map(item => item.source).filter(s => s && s.trim().length > 0);
        }
        // Otherwise extract all string values
        const extractStrings = (val) => {
          if (typeof val === 'string') return [val];
          if (Array.isArray(val)) return val.flatMap(extractStrings);
          if (typeof val === 'object' && val !== null) {
            return Object.values(val).flatMap(extractStrings);
          }
          return [];
        };
        const strings = extractStrings(obj);
        return strings.filter(s => s.trim().length > 0);
      } catch (e) {
        console.error('JSON parse error:', e);
        return [];
      }
    },
    
    xml: (text) => {
      try {
        // Extract text content from XML elements
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
          throw new Error('Invalid XML');
        }
        
        const strings = [];
        
        // Extract from specific Android strings format first
        const stringElements = xmlDoc.getElementsByTagName('string');
        if (stringElements.length > 0) {
          for (let elem of stringElements) {
            // Try to get name attribute first
            const name = elem.getAttribute('name');
            const value = elem.textContent.trim();
            if (name) {
              strings.push(name);
            }
            if (value && value !== name) {
              strings.push(value);
            }
          }
        } else {
          // Fallback to all text nodes
          const walker = document.createTreeWalker(
            xmlDoc.documentElement,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );
          let node;
          while (node = walker.nextNode()) {
            const text = node.nodeValue.trim();
            if (text && text.length > 0 && !text.match(/^\s*$/)) {
              strings.push(text);
            }
          }
        }
        
        return [...new Set(strings.filter(s => s && s.trim().length > 0))];
      } catch (e) {
        console.error('XML parse error:', e);
        return [];
      }
    },
    
    xlsx: (jsonData) => {
      if (!Array.isArray(jsonData) || jsonData.length === 0) return [];
      
      // Check if first row looks like a header
      const firstRow = jsonData[0];
      const isHeaderRow = firstRow && firstRow.some(cell => 
        typeof cell === 'string' && (
          cell.toLowerCase().includes('source') || 
          cell.toLowerCase().includes('english') ||
          cell.toLowerCase().includes('language')
        )
      );
      
      const startIdx = isHeaderRow ? 1 : 0;
      
      // Extract first column if header exists, otherwise all values
      return jsonData.slice(startIdx)
        .map(row => {
          if (!Array.isArray(row)) return '';
          if (isHeaderRow && row.length > 0) {
            return String(row[0]).trim();
          }
          return row
            .filter(cell => cell !== undefined && cell !== null && String(cell).trim().length > 0)
            .map(cell => String(cell).trim())
            .join(' ');
        })
        .filter(cell => cell && cell.trim().length > 0);
    },
    
    txt: (text) => {
      return text.split('\n').filter(line => line.trim().length > 0);
    }
  };

  const parseFile = async (file) => {
    setError('');
    console.log('File selected:', file.name, file.type, file.size);
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    console.log('File extension:', fileExtension);

    if (!supportedFormats.includes(fileExtension)) {
      const msg = `Unsupported file format. Please use: CSV, JSON, XML, XLSX, or TXT`;
      console.error(msg);
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    try {
      let content = '';
      let extractedStrings = [];

      if (fileExtension === 'json') {
        console.log('Reading as JSON...');
        const text = await file.text();
        extractedStrings = extractContent.json(text);
      } 
      else if (fileExtension === 'xml') {
        console.log('Reading as XML...');
        const text = await file.text();
        extractedStrings = extractContent.xml(text);
      } 
      else if (fileExtension === 'csv') {
        console.log('Reading as CSV...');
        const text = await file.text();
        extractedStrings = extractContent.csv(text);
      } 
      else if (fileExtension === 'txt') {
        console.log('Reading as TXT...');
        const text = await file.text();
        extractedStrings = extractContent.txt(text);
      } 
      else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        console.log('Reading as XLSX/XLS...');
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        console.log('Workbook sheets:', workbook.SheetNames);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        extractedStrings = extractContent.xlsx(jsonData);
      }

      // Remove duplicates and empty strings
      extractedStrings = [...new Set(extractedStrings.filter(s => s && s.trim().length > 0))];
      content = extractedStrings.join('\n');

      console.log('Extracted strings count:', extractedStrings.length);
      console.log('Content length:', content.length);

      if (!content.trim()) {
        const msg = 'File is empty or contains no translatable content. Please upload a file with content.';
        console.error(msg);
        setError(msg);
        showToast(msg, 'error');
        return;
      }

      console.log('File parsed successfully, calling onFileContent');
      onFileContent(content);
      
      // Call onFileInfo callback with file metadata
      if (onFileInfo) {
        onFileInfo({
          fileName: file.name,
          fileType: fileExtension,
          itemCount: extractedStrings.length,
          preview: extractedStrings.slice(0, 5)
        });
      }
      
      // Show success notification
      showToast(`✓ File parsed! Found ${extractedStrings.length} translatable strings.`, 'success');
    } catch (err) {
      const msg = `Error reading file: ${err.message}`;
      console.error(msg, err);
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleFileSelect = (e) => {
    console.log('handleFileSelect called');
    const file = e.target.files?.[0];
    console.log('File from input:', file);
    if (file) {
      parseFile(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      parseFile(files[0]);
    }
  };

  return (
    <div className="max-w-5xl">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls,.txt,.json,.xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl bg-white dark:bg-slate-800 h-96 flex flex-col items-center justify-center text-center p-8 transition-all cursor-pointer group shadow-md ${
          isDragging
            ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
            : 'border-slate-300 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-400 dark:hover:border-blue-600'
        }`}
      >
        <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-md mb-6 transition-all ${
          isDragging
            ? 'bg-green-100 dark:bg-green-900/40 scale-110'
            : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-slate-600 group-hover:scale-110'
        }`}>
          <Upload className={`${
            isDragging
              ? 'text-green-600 dark:text-green-400'
              : 'text-slate-500 dark:text-slate-300 group-hover:text-blue-600'
          }`} size={40} />
        </div>

        <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100">
          {isDragging ? 'Drop your file here' : 'Upload Your File'}
        </h3>

        <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
          Drop your file here or click to browse.<br/>
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Supports: CSV, XLSX, JSON, XML, TXT</span>
        </p>

        <button
          type="button"
          onClick={() => {
            console.log('Browse button clicked');
            fileInputRef.current?.click();
          }}
          className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-6 py-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
        >
          Browse Files
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
