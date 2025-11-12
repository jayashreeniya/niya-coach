module BxBlockTimeTrackingBilling
	class SummaryTracksController < ApplicationController
    before_action :validate_json_web_token , except: [:all_account,:month_wise_record]

    def index
      end_date = params[:end_date] ? Time.zone.parse(params[:end_date]).end_of_day : Time.zone.now.end_of_day
      time_tracks = if params[:start_date].present?
                      SummaryTrack.where(account_id: current_user.id).where('created_at >= ? AND created_at <= ?', Time.zone.parse(params[:start_date]).beginning_of_day ,  end_date)
                    else
                      SummaryTrack.where(account_id: current_user.id).where('created_at >= ? OR created_at <= ?', Time.zone.now.beginning_of_month, Time.zone.now.end_of_month)
                    end
      render json: SummaryTrackSerializer.new(time_tracks.order(created_at: :desc))
    end

    def all_account
      accounts = AccountBlock::Account.includes(:summary_tracks).pluck('account_id').compact.uniq
      accounts = AccountBlock::Account.where(id: accounts)
      @total_count = accounts.count
      accounts = pagination(accounts)
      render json: {data: accounts.map do|obj|{id: obj.id,full_name: obj.full_name } end , count: @total_count}, status: :ok
    end


    def month_wise_record
      return render json: {error: "account_id not present"},status: :unprocessable_entity if params[:account_id].blank?
      account = AccountBlock::Account.find(params[:account_id])
      account_summary_track = []
      account_summary_track = account.summary_tracks.group_by { |m| m.created_at.beginning_of_month }.sort.reverse.map do |key, value|
        time = value.pluck(:spend_time).sum.to_f / 60
        billing = (time >= 1 ? time.to_i : 0) * 80
        {
        year: key.year.to_s,
        month: key.strftime("%B"),
        spend_time: ActiveSupport::Duration.build(value.pluck(:spend_time).sum.to_i).inspect,
        billing: "#{billing / 80} USD"
        }
      end
      @total_count = account_summary_track.count
      account_summary_track = pagination(account_summary_track)
      render json: {account: account.id, data: account_summary_track ,count: @total_count}, status: :ok 
    end

    
    def pagination(data)
      if params[:page].present? && params[:limit].present?
        page = params[:page].to_i
        limit = params[:limit].to_i
        offset = page * limit
        data = data.slice(offset, limit)
      end
      return data
    end
    
    private
    def current_user
      return unless @token
      @current_user ||= AccountBlock::Account.find(@token.id)
    end
	end
end
