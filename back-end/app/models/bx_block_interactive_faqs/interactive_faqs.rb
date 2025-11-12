# == Schema Information
#
# Table name: interactive_faqs
#
#  id         :bigint           not null, primary key
#  title      :string
#  content    :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
module BxBlockInteractiveFaqs
  class InteractiveFaqs < BxBlockInteractiveFaqs::ApplicationRecord
    self.table_name = :interactive_faqs

    SERIALIZE_ATTRIBUTES = %w[id title content created_at updated_at].freeze

    def to_custom_hash
      result = {}

      SERIALIZE_ATTRIBUTES.each do |cur_attr|
        result[cur_attr] = send(cur_attr)
      end

      result
    end
  end
end
