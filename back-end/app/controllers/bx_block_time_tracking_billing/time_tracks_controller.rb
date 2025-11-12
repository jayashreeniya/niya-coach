module BxBlockTimeTrackingBilling
	class TimeTracksController < ApplicationController
    before_action :validate_json_web_token

    def index
      end_date = params[:end_date] ? Time.zone.parse(params[:end_date]).end_of_day : Time.zone.now.end_of_day
      time_tracks = if params[:start_date].present?
                      TimeTrack.where(account_id: current_user.id).where('created_at >= ? AND created_at <= ?', Time.zone.parse(params[:start_date]).beginning_of_day ,  end_date)
                    else
                      TimeTrack.where(account_id: current_user.id).where('created_at >= ? OR created_at <= ?', Time.zone.now.beginning_of_month, Time.zone.now.end_of_month)
                    end
      render json: TimeTrackSerializer.new(time_tracks.order(created_at: :desc))
    end

    private

    def current_user
      return unless @token
      @current_user ||= AccountBlock::Account.find(@token.id)
    end
	end
end
