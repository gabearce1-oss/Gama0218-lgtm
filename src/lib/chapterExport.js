const hiddenFields = new Set(['id', 'created_date', 'updated_date', 'created_by_id']);

const csvCell = (value) => {
  const text = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
};

export function downloadChapterExport(chapters) {
  const fields = [...new Set(chapters.flatMap((chapter) => Object.keys(chapter)))].filter((field) => !hiddenFields.has(field));
  const rows = chapters
    .slice()
    .sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0))
    .map((chapter) => fields.map((field) => csvCell(chapter[field])).join(','));
  const csv = [fields.map(csvCell).join(','), ...rows].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Omega_Chapter_Architecture.csv';
  link.click();
  URL.revokeObjectURL(url);
}