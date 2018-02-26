# frozen_string_literal: true
lock "~> 3.10.1"

set :application, 'slidevision_eurpeana'

set :repo_url, 'git@github.com:formslider/formslider.eurpeana.src.git'

# Default branch is :master
ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

set :keep_releases, 5
