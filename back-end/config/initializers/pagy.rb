require "pagy/extras/array"
require 'pagy/extras/overflow'

Pagy::DEFAULT[:overflow] = :empty_page
Pagy::DEFAULT[:items] = 10
Pagy::DEFAULT[:page]  = 1