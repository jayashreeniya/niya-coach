module BxBlockCompanies
  class CompanyDetailSerializer < BaseSerializer
    include FastJsonapi::ObjectSerializer

    attributes :id, :name, :email, :address, :hr_code, :employee_code

    attributes :total_users do |object|
      AccountBlock::Account.where(access_code: object.employee_code).count
    end

    attributes :total_hours do |object|
      account_ids = BxBlockTimeTrackingBilling::TimeTrack.where(company_id: object.id)
      total_time = BxBlockTimeTrackingBilling::SummaryTrack.where(account_id: account_ids).pluck(:spend_time)
      seconds_diff = (total_time.reduce(0, :+) * 60).round
      hours = seconds_diff / 3600
      seconds_diff -= hours * 3600
      minutes = seconds_diff / 60
      seconds_diff -= minutes * 60
      seconds = seconds_diff
      "#{hours.to_s.rjust(2, '0')}:#{minutes.to_s.rjust(2, '0')}:#{seconds.to_s.rjust(2, '0')}"
    end

    attributes :feedback do |object|
      accounts=AccountBlock::Account.where(access_code: object.employee_code)
      company_employees_rating = BxBlockRating::AppRating.where(account_id: accounts.pluck(:id)).pluck(:app_rating)
      average_rating = company_employees_rating.reduce(0,:+)/company_employees_rating.count if company_employees_rating.present?
    end

    attributes :focus_areas do |object|
      count=AccountBlock::Account.where(access_code: object.employee_code).count
      accounts= AccountBlock::Account.where(access_code: object.employee_code)
      focus_areas = []
      accounts.each do |account|
        focus_area = BxBlockAssessmenttest::SelectAnswer.where(account_id: account&.id)
        focus_area.each do |f_area|
          if f_area.present?
            focus_areas<<f_area
          end
        end
      end
      answers=[]
      focus_areas.each do |focusarea|
        if focusarea.multiple_answers.present?
          answer = BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: focusarea&.multiple_answers)&.pluck(:answers)
          answers=answers+answer
        end
      end
      fa=[]
      freq=answers.inject(Hash.new(0)) { |h,v| h[v] += 1; h }
      5.times do
        focus=answers.max_by { |v| freq[v] }
        if focus.present?
          per=(freq[focus]/count.to_f)*100
          fa<<{focus_area: focus, per: per}
        end
        freq.delete(focus)
      end
      fa=fa.select{ |x| x[:per]!=0 }
      fa
    end

    attributes :user_logged_in do |object|
      logged_in=[]
      emp_code = object.employee_code
      hr_code = object.hr_code
      employees=AccountBlock::Account.where(access_code: emp_code)
      hrs= AccountBlock::Account.where(access_code: hr_code)
      Date::MONTHNAMES.each do |month|
        if !month.nil?
          m=Date.parse(month).month.to_s
          month_employees = StatusAudit.where(account_id: employees.pluck(:id)).where('extract(year from logged_time) = ?', Time.now.year).where(month: m).count
          month_hrs = StatusAudit.where(account_id: hrs.pluck(:id)).where(month: m).count
          logged_in<<{month: month, employees: month_employees, hrs: month_hrs}
        end
      end
      logged_in
    end

    attributes :employees do |object|
      users = AccountBlock::Account.where(access_code: object.employee_code)
      employees_details_for(users)
    end

    class << self
      private

      def employees_details_for(users)
        all_users=[]
        users.each do |user|
          all_users<<{ id: user.id, full_name: user.full_name, email: user.email }      
        end
        all_users
      end
    end
  end
end
