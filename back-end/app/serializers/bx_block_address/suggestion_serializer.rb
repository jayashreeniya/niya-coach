module BxBlockAddress
	class SuggestionSerializer < BaseSerializer
		require 'open-uri'
      attributes :docs do |object, params| 
        filter_files(object, params, 'docs')
      end
      
      attributes :audios do |object, params|
        filter_files(object, params, 'audios')
      end
      
      attributes :videos do |object, params|
        filter_files(object, params, 'videos')
      end

    class << self
      private
      
      def filter_files(object, params, choose_file)
        top_focus_area = object.top_focus_areas.last
        files_data = BxBlockUpload::FileType.joins(:multiple_upload_file)
          .where(
            "multiple_upload_files.choose_file = :choose_file AND " +
            "(ARRAY_REMOVE(file_types.focus_areas, '')::varchar[] && ARRAY[:focus_areas]::varchar[] " +
            "OR ARRAY_REMOVE(file_types.well_being_focus_areas, '')::integer[] && ARRAY[:wellbeing_ids]::integer[])",
            focus_areas: top_focus_area&.select_focus_area_id,
            wellbeing_ids: top_focus_area&.wellbeingfocus_id,
            choose_file: BxBlockUpload::MultipleUploadFile.choose_files[choose_file]
          )
          .distinct

        files_data.each { |record| record.focus_areas.reject!(&:empty?) }
        media_details(files_data, params, choose_file)
      end

      def image_thumbnail(j, params)
        j.image.present? ? params[:url] + Rails.application.routes.url_helpers.rails_blob_path(j.image, only_path: true) : nil
      end

      def media_details(medias, params, choose_file)
        file = []
        medias.each do |j|
          focus_a = BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: j.focus_areas).map { |fa| { id: fa.id, focus_area: fa.answers } }
          image = image_thumbnail(j, params)
          if j.multiple_file.attached? && params[:url]
            file_details = {
              id: j.id,
              title: j.file_name,
              description: j.file_discription,
              focus_areas: j.focus_areas,
              user_focus_areas: focus_a,
              url: params[:url] + Rails.application.routes.url_helpers.rails_blob_path(j.multiple_file, only_path: true),
              content_type: j.multiple_file.content_type,
              thumbnail: image
            }
            file_details.merge!(file_content: j.file_content) if choose_file == 'docs'
            file << file_details
          end
        end
        file.sort_by! { |item| item[:title] }
      end
    end
  end
end
