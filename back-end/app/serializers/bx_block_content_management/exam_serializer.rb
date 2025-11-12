module BxBlockContentManagement
  class ExamSerializer < BaseSerializer
    attributes :id, :heading, :description, :created_at, :updated_at
  end
end
