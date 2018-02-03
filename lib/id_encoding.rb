# frozen_string_literal: true
class IdEncoding
  # Number System
  NS = %w(0 1 2 3 4 5 6 7 8 9 a b c d e f g h i j k l m n o p q r s t u v w x y
          z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z _ -).freeze
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
