# frozen_string_literal: true
require 'socket'
require './handler'

abort('SHORTENER_URL env variable is required') unless ENV['SHORTENER_URL']

port = ENV['PORT'] || 10_000
server = TCPServer.new('127.0.0.1', port)
puts "Listening on #{port}"

loop do
  Thread.start(server.accept_nonblock) do |client|
    Handler.new(client).handle
    client.close
  end
rescue IO::WaitReadable, Errno::EINTR
  IO.select([server])
  retry
end
