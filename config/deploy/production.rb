# frozen_string_literal: true
server '5.45.97.194', roles: %w(web), user: 'root'

set :deploy_to, '/var/www/europeana.slidevision.io'
