module BxBlockUpload
	class AudiosController < ApplicationController
		include BuilderJsonWebToken::JsonWebTokenValidation
		before_action :validate_json_web_token
		before_action :account_user

		def audio_list
    		render_files('audios', BxBlockAddress::MultipleUploadFileSerializer)
  		end

		def video_list
			topfocusarea = TopfocusArea.where(account_id: @token.id).last
			focus_areas=BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: topfocusarea&.select_focus_area_id).pluck(:id).map{|x| x.to_s}	
			wellbeingids = topfocusarea&.wellbeingfocus_id			
			file_id = BxBlockUpload::MultipleUploadFile.where(choose_file: 'videos').pluck(:id)
			files=BxBlockUpload::FileType.joins(:multiple_upload_file).where(multiple_upload_file_id: file_id)
			file_data=[]
			file_data = all_data(files ,focus_areas ,wellbeingids, file_data)
			pagy, file_data = pagy_array(file_data, page: params[:page_no], items: params[:per_page])
			render json: BxBlockAddress::MultipleUploadFileSerializer.new(file_data, params: {url: request.base_url, count: file_data.size}, meta: pagy_metadata(pagy)).serializable_hash, status: :ok 	
		end

		def docs_list
    		render_files('docs', BxBlockAddress::DocItemSerializer)
  		end

		def suggestion
			render json: BxBlockAddress::SuggestionSerializer.new(@current_user, params: {url: request.base_url}), status: :ok
		end
		
		private 

		def account_user
			@current_user = AccountBlock::Account.find_by(id: @token.id)
		end
		
		def pagination(page,limit,file_data)
			page = page.to_i
			limit = limit.to_i
			offset = page * limit
			return file_data = file_data.slice(offset, limit) 
		end
		
		def all_data(files ,focus_areas ,wellbeingids ,file_data)
			files.each do |file|
				file.focus_areas.delete("")
				file.well_being_focus_areas.delete("")
				fc=file.focus_areas.map{|x| x.to_s}
				if !(fc.empty? && focus_areas)
					file_data<<file
				end
				fc=file.well_being_focus_areas.map{|x| x.to_i}
				if !(fc.empty? && wellbeingids)
					file_data<<file
				end
			end
			file_data.sort_by! { |file| file.file_name }
			return file_data.uniq
		end

		def render_files(file_type, serializer)
		    if @current_user.present?
		      topfocusarea = TopfocusArea.where(account_id: @token.id).last
		      focus_areas = BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: topfocusarea&.select_focus_area_id).pluck(:id).map(&:to_s)
		      wellbeingids = topfocusarea&.wellbeingfocus_id
		      file_id = BxBlockUpload::MultipleUploadFile.where(choose_file: file_type).pluck(:id)
		      files = BxBlockUpload::FileType.joins(:multiple_upload_file)
		                                     .where(multiple_upload_file_id: file_id)
		                                     .with_attached_multiple_file
		                                     .with_attached_image
		                                     .with_attached_text_file
		                                     .includes(:text_file_blob)

		      
		      file_data = all_data(files, focus_areas, wellbeingids, [])
		      pagy, file_data = pagy_array(file_data, page: params[:page_no], items: params[:per_page])
		      render json: serializer.new(file_data, params: {url: request.base_url, count: file_data.size}, meta: pagy_metadata(pagy)).serializable_hash, status: :ok 
		    end
  		end
	end
end
