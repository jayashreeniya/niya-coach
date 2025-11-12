module BxBlockProfile
  class DegreeSerializer < BaseSerializer
    attributes *[
     :id,
     :degree_name
    ]
  end
end
