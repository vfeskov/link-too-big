# frozen_string_literal: true
require 'singleton'
require 'em-hiredis'

class DB
  include Singleton
  attr_reader :redis

  def initialize
    @redis = EM::Hiredis.connect(ENV['REDIS_URL'])
  end

  def self.get(id)
    instance.redis.get id
  end
end
