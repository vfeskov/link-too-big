# frozen_string_literal: true
require './db'

class Handler
  VALID_PATH = %r{^/\d+$}

  def initialize(connection, headers)
    @connection = connection
    @headers = headers
  end

  def handle
    method, @path = parse_headers
    return not_found unless method == 'GET' && @path =~ VALID_PATH
    link_deferrable = DB.get(id)
    link_deferrable.callback do |link|
      return not_found unless link
      redirect link
    end
    link_deferrable.errback { |e| internal_server_error(e) }
  end

  def parse_headers
    request = @headers.first
    puts request
    return ['', ''] unless request.is_a?(String)
    method, full_path = request.split(' ')
    path = full_path.split('?').first
    [method, path]
  end

  def id
    @path[1..-1]
  end

  def not_found
    respond 302, "Location: #{ENV['SHORTENER_URL']}\r\n"
  end

  def internal_server_error(e)
    puts e
    not_found
  end

  def redirect(link)
    respond 301, "Location: #{link}\r\n"
  end

  def respond(code, extra_headers = '')
    now = Time.now.utc.strftime('%a, %d %b %Y %H:%M:%S GMT')
    @connection.send_data "HTTP/1.1 #{code} Moved Permanently\r\n" \
                          "Content-Length: 0\r\n" \
                          "Connection: close\r\n" \
                          "Date: #{now}\r\n" \
                          "#{extra_headers}" \
                          "\r\n"
    @connection.close_connection_after_writing
  end
end
