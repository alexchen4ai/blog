# Liquid filters used by llms.txt / llms-full.txt and the publications JSON-LD.
require 'bibtex'

module Jekyll
  module GeoFilters
    # Raw Markdown source of a document (front matter removed). Lets llms-full.txt expose
    # clean Markdown instead of rendered HTML.
    def raw_markdown(doc)
      path = doc.respond_to?(:path) ? doc.path : doc['path']
      source = @context.registers[:site].source
      file = File.expand_path(path, source)
      return '' unless File.file?(file)
      text = File.read(file, encoding: 'utf-8')
      text.sub(/\A---\s*\n.*?\n---\s*\n/m, '')
    end

    # Parses a BibTeX file into plain hashes sorted by year (newest first).
    def bib_entries(relative_path)
      source = @context.registers[:site].source
      file = File.expand_path(relative_path.to_s.sub(%r{\A/}, ''), source)
      return [] unless File.file?(file)
      text = File.read(file, encoding: 'utf-8').sub(/\A---\s*\n.*?\n---\s*\n/m, '')
      bib = BibTeX.parse(text)
      entries = bib.data.select { |e| e.is_a?(BibTeX::Entry) }
      entries.map { |e|
        authors = e.has_field?(:author) ? e.author.map { |a| [a.first, a.last].compact.join(' ') } : []
        authors = authors.reject { |a| a.strip.casecmp('others').zero? }
        {
          'key' => e.key.to_s,
          'type' => e.type.to_s,
          'title' => e[:title].to_s.gsub(/[{}]/, ''),
          'authors' => authors,
          'year' => e[:year].to_s,
          'venue' => (e[:booktitle] || e[:journal]).to_s.gsub(/[{}]/, ''),
          'arxiv' => e[:arxiv].to_s,
          'url' => e[:html].to_s,
          'note' => e[:note].to_s
        }
      }.sort_by { |h| -h['year'].to_i }
    end
  end
end

Liquid::Template.register_filter(Jekyll::GeoFilters)
