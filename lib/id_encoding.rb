# frozen_string_literal: true
class IdEncoding
  # Number System
  NS = ([*'0'..'9'] + [*'a'..'z'] + [*'A'..'Z'] + %w(- _)).freeze
  NS_BASE = NS.length

  def self.encode(id)
    code = ''
    while id > 0
      code = NS[id % NS_BASE] + code
      id = (id / NS_BASE).floor
    end
    code
  end

  def self.decode(code)
    id = 0
    code.split('').each_with_index do |letter, index|
      power = (code.length - index - 1)
      id += NS.index(letter) * NS_BASE**power
    end
    id
  end
end
