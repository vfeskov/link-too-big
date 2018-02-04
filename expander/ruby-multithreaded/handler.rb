# frozen_string_literal: true
require 'redis'
require '../../lib/id_encoding'

class Handler
  VALID_PATH = Regexp.new("^/[#{IdEncoding::NS.join}]+$").freeze
  DB = Redis.new(url: ENV['REDIS_URL'])

  def initialize(client)
    @client = client
  end

  def handle
    method, @path = parse_request
    raise NotFound unless method == 'GET' && @path =~ VALID_PATH
    link = DB.get(id)
    raise NotFound unless link
    respond 301, "Location: #{link}\r\n"
  rescue NotFound
    not_found
  rescue Redis::BaseError => e
    puts e.message
    puts e.backtrace.inspect
    not_found
  end

  def parse_request
    request = @client.gets
    puts request
    return ['', ''] unless request.is_a?(String)
    method, full_path = request.split(' ')
    path = full_path.split('?').first
    [method, path]
  end

  def id
    code = @path[1..-1]
    IdEncoding.decode code
  end

  def not_found
    respond 302, "Location: #{ENV['SHORTENER_URL']}\r\n"
  end

  def respond(code, extra_headers = '')
    @client.print "HTTP/1.1 #{code}\r\n" \
                  "Content-Length: 0\r\n" \
                  "Connection: close\r\n" \
                  "#{extra_headers}" \
                  "\r\n"
    @client.close
  end
end

class NotFound < RuntimeError
end
