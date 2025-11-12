class UserQuestionAnswer < ApplicationRecord
  belongs_to :account, optional: true
	def self.get_time_and_data(account_id,category_id)
      question = QuestionWellBeing.where(category_id: category_id).pluck(:id)
      cat_user =  UserQuestionAnswer.where(question_id: question)
      categ_user = cat_user.find_by(account_id: account_id)  

      if categ_user.present?
      	u_time = categ_user.updated_at.strftime("%d %B %Y")
      else
      	u_time = ""
      end 
    end
end
