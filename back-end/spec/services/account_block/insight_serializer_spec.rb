# spec/serializers/account_block/insight_serializer_spec.rb

require 'rails_helper'

RSpec.describe AccountBlock::InsightSerializer do
  let(:account) { Support::SharedHelper.new.current_user } # Assuming you have an Account factory
  # let(:wellbeing_category) { Support::SharedHelper.new.create_wellbeing } # Assuming you have a WellbeingCategory factory

  it 'serializes top_strength attribute correctly' do
    BxBlockAssessmenttest::StoringFocusArea.destroy_all
    # Create necessary records for WellbeingScoreReport, WellBeingSubCategory, etc.
    # You might need to adjust this based on your actual associations and attributes

    # Assuming you have a WellBeingScoreReport factory
    WellbeingScoreReport.create(
      category_id: 1,
      account_id: account.id,
      category_result: {
        "category_name" => "Physical Wellbeing",
        "score" => 36,
        "question_count" => 24,
        "percentage" => 33,
        "advice" => "NO significant risk in general health & wellbeing in the current scenario.",
        "submitted_at" => "2023-10-18",
        "score_level" => "high"
      },
      sub_category_result: [
        {
          "sub_category" => "Physical Wellbeing",
          "score" => 36,
          "question_count" => 12,
          "percentage" => 33
        },
        {
          "sub_category" => "Nutrition",
          "score" => 10,
          "question_count" => 2,
          "percentage" => 50,
          "advice" => "Great! you are conscious and eat healthy.",
          "score_level" => "high",
          "well_being_focus_area" => "Career progression",
          "top_strength" => "Nutrition"
        },
        # ... (other sub-categories)
      ],
      created_at: "2023-10-18 18:59:34",
      updated_at: "2023-10-18 18:59:34",
      submitted_at: "2023-10-18"
    )

    serialized_data = AccountBlock::InsightSerializer.new(account).serializable_hash

    # Add expectations based on your actual data and structure
    expect(serialized_data[:data][:attributes][:top_strength]).to be_an(Array)
    # Add more expectations based on your JSON structure
  end

 
end
