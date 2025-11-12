class CoachAvailabilityWorker
  include Sidekiq::Worker
  require 'sidekiq-scheduler'
  
  def perform(id=nil)
    if id.present?
      (Date.today..6.months.from_now).each do |date|
        begin
          BxBlockAppointmentManagement::Availability.create!(start_time: "06:00", end_time: "23:00", availability_date: date.strftime("%d/%m/%Y"), service_provider_id: id)
        rescue => exception
          next
        end
      end
    else
      coaches = AccountBlock::Account.where(role_id: BxBlockRolesPermissions::Role.find_by_name(:coach).id)
      coaches.each do |coach|
        (Date.today..6.months.from_now).each do |date|
          begin
            BxBlockAppointmentManagement::Availability.create(start_time: "06:00", end_time: "23:00", availability_date: date.strftime("%d/%m/%Y"), service_provider_id:coach.id)
          rescue => exception
            next
          end
        end
      end
    end
  end
end

