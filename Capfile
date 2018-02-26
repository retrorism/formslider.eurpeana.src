require "capistrano/setup"
require "capistrano/deploy"
require "capistrano/scm/git_with_submodule_and_resolv_symlinks"

install_plugin Capistrano::SCM::GitWithSubmoduleAndResolvSymlinks

Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
