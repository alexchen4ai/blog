# Fixes jekyll-cache-bust's bust_css_cache, which hashes the non-existent
# assets/_sass directory (this repo keeps Sass in _sass/), producing the
# constant md5("") and never invalidating browser caches for main.css.
require "digest/md5"

module Jekyll
  module CacheBustFix
    SASS_GLOBS = ["_sass/**/*.scss", "assets/css/**/*.scss", "_config.yml"].freeze

    def bust_css_cache(file_name)
      contents = SASS_GLOBS.flat_map { |g| Dir[g] }.sort.map { |f| File.read(f) unless File.directory?(f) }.join
      "#{file_name}?v=#{Digest::MD5.hexdigest(contents)}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::CacheBustFix)
