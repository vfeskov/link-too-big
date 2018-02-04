# frozen_string_literal: true
require 'eventmachine'
require './handler'

abort('SHORTENER_URL env variable is required') unless ENV['SHORTENER_URL']

class Server < EM::P::HeaderAndContentProtocol
  def receive_request(headers, content)
    Handler.new(self, headers).handle
  end
end

port = ENV['PORT'] || 10_000
EM.run do
  EM.start_server '127.0.0.1', port, Server
  puts "Listening on #{port}"
end
