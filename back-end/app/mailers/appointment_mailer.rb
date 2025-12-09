class AppointmentMailer < ApplicationMailer
  default from: 'Niya Appointments <hello@niya.app>'

  def booking_confirmation_email(user, coach, booking_details)
    @user_name = user.full_name
    @coach_name = coach.full_name
    @booking_date = booking_details[:booking_date]
    @start_time = booking_details[:start_time]
    @end_time = booking_details[:end_time]
    @meeting_code = booking_details[:meeting_code]

    mail(
      to: user.email,
      subject: 'Your Appointment with Niya is Confirmed!'
    )
  end

  def coach_notification_email(coach, user, booking_details)
    @coach_name = coach.full_name
    @user_name = user.full_name
    @booking_date = booking_details[:booking_date]
    @start_time = booking_details[:start_time]
    @end_time = booking_details[:end_time]
    @meeting_code = booking_details[:meeting_code]

    mail(
      to: coach.email,
      subject: 'New Appointment Booked - Niya'
    )
  end
end

