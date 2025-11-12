module AccountBlock
  class HrSerializer
    include FastJsonapi::ObjectSerializer
    attributes *[
      :full_name,
      :email,
      :full_phone_number,
      :access_code,
      :activated
    ]

    attributes :total_users do |object|
      if object.role_id == BxBlockRolesPermissions::Role.find_by_name(BxBlockRolesPermissions::Role.names[:hr])&.id
        obj = Company.where("employee_code = ? or hr_code = ?",object.access_code, object.access_code).last&.employee_code
        users = AccountBlock::Account.where(access_code: obj).count
      end
    end

    attributes :total_hours do |object|
      company = Company.where(hr_code: object&.access_code)&.last
      account_ids = BxBlockTimeTrackingBilling::TimeTrack.where(company_id: company&.id)
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
      company = Company.where(hr_code: object.access_code).last
      accounts=AccountBlock::Account.where(access_code: company.employee_code)
      company_employees_rating = BxBlockRating::AppRating.where(account_id: accounts.pluck(:id)).pluck(:app_rating)
      average_rating = company_employees_rating.reduce(0,:+)/company_employees_rating.count if company_employees_rating.present?
    end

    attributes :focus_areas do |object|
      emp_code = Company.where(hr_code: object.access_code).last&.employee_code
      count=AccountBlock::Account.where(access_code: emp_code).count
      accounts= AccountBlock::Account.where(access_code: emp_code)
      answers=[]
      focus_areas = []
      accounts.each do |account|
        focus_area = BxBlockAssessmenttest::SelectAnswer.where(account_id: account&.id).last
        answer = BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: focus_area&.multiple_answers)&.pluck(:answers)
        answers << answer
      end
      answers = answers.flatten 
      account_count = accounts.count
      common_answer = answers.uniq
      common_answer.each do |data|
        value_count = answers.count(data)
        cal = FocusAreaCal.find_by(name: data)
        if cal.nil?
          cal = FocusAreaCal.create(name: data)
        end
        cal.update(focus_area_count: value_count)
      end
      top_five_focus_area = FocusAreaCal.where(name: common_answer).order(focus_area_count: :desc).limit(5)
      fa = []
      top_five_focus_area.map do |obj|
        per = obj.focus_area_count.to_f/account_count.to_f * 100
        fa << {focus_area: obj.name, per: per}
      end
      fa
    end

    attributes :company_details do |object|
      if object.role_id == BxBlockRolesPermissions::Role.find_by_name(BxBlockRolesPermissions::Role.names[:hr])&.id
        cmp = Company.where("employee_code = ? or hr_code = ?", object.access_code, object.access_code).last
        company_details_for(cmp)
      end
    end

    attributes :employee_details do |object|
      if object.role_id == BxBlockRolesPermissions::Role.find_by_name(BxBlockRolesPermissions::Role.names[:hr])&.id
        obj = Company.where("employee_code = ? or hr_code = ?",object.access_code, object.access_code).last&.employee_code
        users = AccountBlock::Account.where(access_code: obj)
        employee_details_for(users)
      end
    end

    class << self
      private

      def company_details_for(object)
        {
          id: object.id,
          name: object&.name,
          email: object&.email,
          address: object&.address,
          employee_code: object.employee_code,
          hr_code: object.hr_code
        }
      end

      def employee_details_for(object)
        h1=[]
        object.each do |obj|
          h1<<({ id: obj.id,
            email: obj.email,
            full_name: obj&.full_name,
            first_name: obj&.first_name,
            last_name: obj&.last_name,
            gender: obj&.gender})
        end
        return h1
      end
    end
  end
end
