module BxBlockProfile
  class AwardSerializer < BaseSerializer
    attributes *[
      :title,
      :associated_with,
      :issuer,
      :issue_date,
      :description,
      :make_public
    ]
  end
end
