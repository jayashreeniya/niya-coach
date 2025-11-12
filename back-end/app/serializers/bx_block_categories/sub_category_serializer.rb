module BxBlockCategories
  class SubCategorySerializer < BaseSerializer
    attributes :id, :name, :created_at, :updated_at

    attribute :categories, if: Proc.new { |record, params|
      params && params[:categories] == true
    }
  end
end
