module BxBlockProfile
  class TestScoreAndCourseSerializer < BaseSerializer
    attributes *[
      :title,
      :associated_with,
      :score,
      :test_date,
      :description,
      :make_public
    ]
  end
end
