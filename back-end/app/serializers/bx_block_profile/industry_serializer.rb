module BxBlockProfile
  class IndustrySerializer < BaseSerializer
    attributes *[
     :id,
     :industry_name
    ]
  end
end
