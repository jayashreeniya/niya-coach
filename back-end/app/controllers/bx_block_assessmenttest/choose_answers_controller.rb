module BxBlockAssessmenttest
	class ChooseAnswersController < ApplicationController
		include BuilderJsonWebToken::JsonWebTokenValidation
		before_action :validate_json_web_token
		def create
			question = BxBlockAssessmenttest::AssesmentTestQuestion.find_by(id:  params[:question_id])
			answer = question&.assesment_test_answers&.where(id: params[:answer_id])
			if question.present?
				if answer.present? && question.sequence_number == params[:sequence_number]
					@selected_answer = BxBlockAssessmenttest::ChooseAnswer.new(assesment_test_question_id: params[:question_id], assesment_test_answer_id: params[:answer_id], account_id: @token.id)
					if @selected_answer.save

						render json: BxBlockAddress::ChooseAnswerSerializer.new(@selected_answer).serializable_hash, status: :created
					else
						render json: {errors: [{message: "account not found"}]}
					end
				else 
					render json: {errors: [{message: "answer or sequence number not match with this question "}]}

	            end 
	        else 
					render json: {errors: [{message: "question id not found "}]}

	        end 

		end


		def index 
			ass_select_ans = BxBlockAssessmenttest::AssessYourselfChooseAnswer.where(account_id:  @token.id)
			selected_answer = BxBlockAssessmenttest::ChooseAnswer.where(account_id: @token.id)

			selected_upcoming_questions = BxBlockAssessmenttest::AssesmentTestQuestion.where.not(id: selected_answer.pluck(:assesment_test_question_id))
			ass_select_upcoming_questions = BxBlockAssessmenttest::AssessYourselfQuestion.where.not(id: ass_select_ans.pluck(:assess_yourself_question_id))

			question_hash = selected_answer.map { |v| choose_answer_hash(v) } + ass_select_ans.map { |v| ass_select_ans_hash(v) }
			upcoming_questions = selected_upcoming_questions.as_json + ass_select_upcoming_questions.as_json 

			render json: {data: question_hash, upcoming_question: upcoming_questions}, status: :ok
		end

		private 

		def choose_answer_hash(choose_answers)
			question = BxBlockAssessmenttest::AssesmentTestQuestion.find_by(id: choose_answers&.assesment_test_question_id)
			answer = BxBlockAssessmenttest::AssesmentTestAnswer.find_by(id: choose_answers&.assesment_test_answer_id)
			{
				question_id: question.id,
				question: question&.title,
				answer_id: answer.id,
				answer: answer&.answers,
				sequence_number: question&.sequence_number
			}
		end

		def ass_select_ans_hash(ass_select_ans)
			question = BxBlockAssessmenttest::AssessYourselfQuestion.find_by(id: ass_select_ans&.assess_yourself_question_id)
			answer = BxBlockAssessmenttest::AssessYourselfAnswer.find_by(id: ass_select_ans&.assess_yourself_answer_id)
			{
				question_id: question.id,
				question: question&.question_title,
				answer_id: answer.id,
				answer: answer&.answer_title,
				sequence_number: question&.sequence_number
			}
		end

	end
end
