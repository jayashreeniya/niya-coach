module AccountBlock
  class QuestionSerializer < BaseSerializer
    include FastJsonapi::ObjectSerializer

    attributes :question_answers do |object|
      question_answer(object)
    end
    

    class << self
      private
      def question_answer(object)
      		{question: object, answers: object.answer_well_beings}
      end

    end

  end
end
