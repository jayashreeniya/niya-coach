module AccountBlock
  class QuestionCategorySerializer < BaseSerializer
    include FastJsonapi::ObjectSerializer

    attributes :question_with_category do |object|
      question_answer(object)
    end
    

    class << self
      private
      def question_answer(object)
        all_question=[]
        all_question<<{category: object, questions: QuestionWellBeing.where("category_id= ?",object.id).where(subcategory_id: nil)}
        subcategories=WellBeingSubCategory.where(well_being_category_id: object.id)
        subcategories.each do |sub_cate|
          questions=QuestionWellBeing.where(subcategory_id: sub_cate.id)
          questions.each do |que|
            all_question<<{subcategory: sub_cate, questions: que, answers: que.answer_well_beings}
          end
        end
        all_question
      end
    end
  end
end
