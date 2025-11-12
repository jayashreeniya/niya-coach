module BxBlockAssessmenttest
	class MotionsController < ApplicationController
		include BuilderJsonWebToken::JsonWebTokenValidation
		before_action :account_detail, only: [:emo_journey_status,:select_motion,:select_motion_answer]

		def index
			@motion = BxBlockAssessmenttest::Motion.all
			if @motion.present?
				render json: BxBlockContactUs::MotionSerializer.new(@motion).serializable_hash, status: :ok
			else
				render json: {errors: [{message: "Motion Not Found"}]}, status: :unprocessable_entity
			end			
		end



		def select_motion
			@motion = BxBlockAssessmenttest::Motion.find_by(id: params[:motion])	
			if @motion&.present? 
				motion_date = DateTime.now.strftime("%m")
				motion_status = BxBlockAssessmenttest::SelectMotion.where("date(motion_select_date) = ?", DateTime.now)

				motion_status = motion_status.where(account_id: @account&.id)

				if  motion_status.present?
					motion_status.update(motion_id: params[:motion])
					@select_motion = motion_status[0]
				else
					@select_motion = BxBlockAssessmenttest::SelectMotion.create(account_id: @account&.id, motion_id: params[:motion], motion_select_date: DateTime.now, select_date: motion_date)
				end

				render json: BxBlockContactUs::SelectMotionSerializer.new(@select_motion).serializable_hash, status: :created		
			else
				render json: {errors: [{message: "Motion Not Found"}]}, status: :unprocessable_entity
			end			
		end

		def select_motion_answer
			question = BxBlockAssessmenttest::MotionQuestion.find_by(id:  params[:motion_question_id])
			answer = question&.motion_answers&.where(id: params[:motion_answer_id])
			if question.present?
				if answer.present? 
					select_motion_id = BxBlockAssessmenttest::SelectMotion.where(account_id: @token.id).last.id

					@selected_answer = BxBlockAssessmenttest::ChooseMotionAnswer.new(select_motion_id: select_motion_id ,motion_question_id: params[:motion_question_id], motion_answer_id: params[:motion_answer_id], account_id: @token.id)
					if @selected_answer.save
            motion_name =  BxBlockAssessmenttest::MotionAnswer.find_by(id: @selected_answer.motion_answer_id)&.emo_answer 
						if (motion_name).downcase == "angry" || (motion_name).downcase == "dejected" || (motion_name).downcase == "frustrated"
							@choosen_game = MotionGame.create(selected_answer: motion_name, account_id: @token.id, game_choosen: "BUBBLE")
						elsif (motion_name).downcase == "sad" || (motion_name).downcase == "lonely" || (motion_name).downcase == "guilty" || (motion_name).downcase == "embarassed"
							@choosen_game= MotionGame.create(selected_answer: motion_name ,account_id: @token.id, game_choosen: "SEA SHELL")
						else
							@choosen_game= MotionGame.create(selected_answer: motion_name ,account_id: @token.id, game_choosen: "PUZZLE")
						end 

						render json: BxBlockContactUs::ChooseMotionAnswerSerializer.new(@selected_answer, meta: {game_choosen: @choosen_game}).serializable_hash, status: :created
					else
						render json: {errors: [{message: "account not found"}]}, status: :unprocessable_entity
					end
				else 
					render json: {errors: [{message: "answer not present "}]}, status: :unprocessable_entity
	      end 
			else 
				render json: {errors: [{message: "question id not found "}]}, status: :unprocessable_entity
			end 
		end

		def emo_journey_status
			if @account.present?
				# motion_date = DateTime.now.strftime("%m")
				motion_date =  DateTime.now
				previous =  motion_date - 30
                arr = []
                journey_status = []
				1.upto(30) do |i|
					arr<<previous + i

				end 

				arr.reverse.each do |i|
					date = @account.select_motions.where("date(motion_select_date) = ?", i.strftime("%Y-%m-%d"))[0] || {}
                    j_data  =  i.strftime("%Y-%m-%d")

                    if date.present?
                    	journey_status<< { "date": date} 
                    else
                    	journey_status<< { "date": {"motion_select_date":  j_data} }
                    end 
				end  

				# motion_status = BxBlockAssessmenttest::SelectMotion.where(account_id: @account.id)
			 #    motion_status = motion_status.where(select_date: motion_date)
                render json: { status: journey_status}
            else
            	render json: {errors: "account not found"}, status: :unprocessable_entity
			end
			
		end


		private

	    def account_detail
	      return unless @token
	      @account ||= AccountBlock::Account.find(@token.id)
	    end

	end
end
