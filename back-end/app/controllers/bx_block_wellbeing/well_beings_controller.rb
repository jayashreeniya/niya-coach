# require 'fcm' - FCM gem not available in production

module BxBlockWellbeing
  class WellBeingsController < ApplicationController

    # before_action :validate_current_user - JWT validation removed
    FCM_CREDENTIALS_PATH = Rails.root.join('config', 'fcm_push_notification.json').to_s

    def index
      if params[:category_id].present?
        # Fetch all questions in the category
        all_questions = QuestionWellBeing.where(category_id: params[:category_id]).order('updated_at asc')

        # Fetch the user's answers
        user_answers = current_user.user_question_answers.where(question_id: all_questions.pluck(:id)).index_by(&:question_id)

        # Prepare the list of questions with the answered status
        questions_with_status = all_questions.map do |question|
          question_data = AccountBlock::QuestionSerializer.new(question).serializable_hash[:data]
          question_data[:attributes][:question_answers][:answered] = user_answers.key?(question.id)
          question_data
        end

        user_question = current_user.user_question_answers&.order(updated_at: :desc)&.first
        question = QuestionWellBeing.find_by(id: user_question&.question_id)

        if question && params[:category_id]&.to_i == question.category_id
          render json: {
            data: questions_with_status,
            message: "You have worked on #{WellBeingCategory.find(question.category_id).category_name} on this #{question.updated_at}"
          }, status: :ok
        else
          render json: { data: questions_with_status }, status: :ok
        end
      else
        render json: { error: "Category ID not provided" }, status: :bad_request
      end
    end

    def question
      # if current_user
        question = QuestionWellBeing.find_by_id(params[:id])
        render json: { questions: [question, { answers: question.answer_well_beings }] }
      # end
    end

    def user_answer
      useranswer = nil
      # if current_user
        category_id = QuestionWellBeing.find_by_id(params[:question_id]).category_id
        UserQuestionAnswer.where(wellbeing_test_id: nil).delete_all
        wellbeing_test = WellbeingTest.where(category_id: category_id, account_id: current_user.id).last
        if wellbeing_test.present? &&  wellbeing_test.status == true
          UserQuestionAnswer.where(wellbeing_test_id: wellbeing_test.id).delete_all
          wellbeing_test.update(status: false)
        elsif wellbeing_test.nil?
          wellbeing_test = WellbeingTest.create(category_id: category_id, account_id: current_user.id) # status
        end
        useranswer = UserQuestionAnswer.where(wellbeing_test_id: wellbeing_test.id, question_id: params[:question_id],
                                              answer_id: params[:answer_id], account_id: current_user.id).last
        if useranswer.nil?
          useranswer = UserQuestionAnswer.create(wellbeing_test_id: wellbeing_test.id, question_id: params[:question_id],
                                                 answer_id: params[:answer_id], account_id: current_user.id)
        end
        last_question = QuestionWellBeing.where(category_id: category_id).order('updated_at desc')&.first&.id == params[:question_id]
        render json: { useranswer: useranswer, last_question: last_question }
      # end
    end

    def all_categories
      # if current_user
        categories = WellBeingCategory.all
        render json: categories
      # end
    end

    def question_categories
      # if current_user
        category = WellBeingCategory.find_by_id(params[:category_id])
        render json: AccountBlock::QuestionCategorySerializer.new(category)
      # end
    end

    def delete_answers
      UserQuestionAnswer.destroy_all
      render json: { message: 'All Answers deleted succesfully' }
    end

    def insights_data
      if params[:category_id].present?
        category_na = WellBeingCategory.find_by_id(params[:category_id])&.category_name
        user_time = UserQuestionAnswer.get_time_and_data(current_user.id, params[:category_id])
        render json: { data: { category_name: category_na, last_test_taken_on: user_time } }, status: :ok
      end
    end

    def get_result
      # if current_user
        get_result_notification(params[:value], current_user)
        value = params[:value]
        render json: AccountBlock::GetResultSerializer.new(current_user, params: { value: value }), status: :ok
      # end
    end

    def get_result_notification(value, current_user)
      value = value == 'true'
      if value
        # FCM functionality disabled - FCM gem not available
        # device_token = UserDeviceToken.find_by(account_id: current_user.id)&.device_token
        # fcm_client = FCM.new(Rails.root.join('config', 'fcm_push_notification.json').to_s, product_id_method)
        # options = {
        #   data: {
        #     type: 'wellbeing'
        #   },
        #   notification: {
        #     title: 'Assessment Completed',
        #     body: 'You have completed your assessment, kindly check your score.'
        #   }
        # }
        # message = options.merge(token: device_token)
        # response = fcm_client.send_v1(message)
        # Rails.logger.info("FCM Push Notification- #{response}")
        Rails.logger.info("FCM Push Notification disabled - FCM gem not available")
      end
    end

    def user_strength
      # if current_user
        data = []
        final_score = nil
        WellBeingCategory.all.each do |cate|
          sub_only_category_questions = QuestionWellBeing.where(category_id: cate.id).where(subcategory_id: nil).pluck(:id)
          sub_userquestionanswer = UserQuestionAnswer.where(question_id: sub_only_category_questions).where(account_id: current_user.id)
          sub_category_scores = AnswerWellBeing.where(id: sub_userquestionanswer.pluck(:answer_id)).pluck(:score)
          sub_category_scores = sub_category_scores.map(&:to_i) if sub_category_scores.present?
          WellBeingSubCategory.where(well_being_category_id: cate&.id).each do |sub_cate|
            cate_questions = QuestionWellBeing.where('category_id = ? and subcategory_id = ?', cate.id, sub_cate&.id)
            questions = UserQuestionAnswer.where('account_id = ?',
                                                 current_user.id).where(question_id: cate_questions.all.pluck(:id))
            answers = questions.all.pluck(:answer_id)
            scores = nil
            scores = AnswerWellBeing.where(id: answers).pluck(:score)
            scores = scores.map(&:to_i)
            count = scores.count
            final_score = scores.length.positive? ? scores.reduce(0, :+) : 0
            sub_user_answer_result = UserAnswerResult.where(category_id: cate.id).where(subcategory_id: sub_cate.id)
            sub_user_uar = nil
            score_level = nil
            sub_user_answer_result&.each do |uar|
              if (final_score >= uar&.min_score) && (final_score <= uar&.max_score)
                sub_user_uar = uar&.advice
                score_level = uar&.score_level
                break
              end
            end

            if sub_cate.sub_category_name != WellBeingSubCategory.where('lower(sub_category_name) LIKE ?',
                                                                        'Substance Use')&.last&.sub_category_name && (score_level == 'high')
              data << { id: sub_cate.id, title: sub_cate.sub_category_name }
            end
          end
        end
        render json: data
      # end
    end

    def insights
      render json: AccountBlock::InsightSerializer.new(current_user) if current_user
    end

    private

    # JWT validation methods removed - BuilderJsonWebToken not available
    # def current_user
    #   validate_json_web_token if request.headers[:token] || params[:token]
    #   return unless @token
    #   @current_user = AccountBlock::Account.find(@token.id)
    # end

    # def validate_current_user
    #   unless current_user
    #     render json: { message: 'Current User is not authorized' }, status: :unauthorized
    #   end
    # end

    def access_token_method
      scope = "https://www.googleapis.com/auth/firebase.messaging"
      authorizer = Google::Auth::ServiceAccountCredentials.make_creds(json_key_io: File.open(FCM_CREDENTIALS_PATH), scope: scope)
      authorizer.fetch_access_token!
      return authorizer.access_token
    end

    def product_id_method
      scope = "https://www.googleapis.com/auth/firebase.messaging"
      authorizer = Google::Auth::ServiceAccountCredentials.make_creds(json_key_io: File.open(FCM_CREDENTIALS_PATH), scope: scope)
      authorizer.project_id
    end
  end
end
