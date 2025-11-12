module BxBlockProfile
  class CourseSerializer < BaseSerializer
    attributes *[
      :course_name,
      :duration,
      :year
    ]
  end
end
