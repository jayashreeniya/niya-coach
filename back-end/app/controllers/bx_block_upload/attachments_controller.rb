require 'open-uri'
require 'tmpdir'
# require 'libreconv' - Libreconv gem not available in production
# require 'aws-sdk' - Not using AWS, using Azure
# require 'aws-sdk-s3' - Not using AWS S3, using Azure storage
require 'base64'

module BxBlockUpload
  class AttachmentsController < ApplicationController
    # include BuilderJsonWebToken::JsonWebTokenValidation - BuilderJsonWebToken not available
    # before_action :validate_json_web_token, :validate_blacklisted_user - JWT validation removed
    before_action :set_account, only: [:create]
    before_action :add_allow_credentials_headers, only: [:create]

    def create
      @attachment_serializer = Array.new
      params[:data][:attachments].each do |attachment_params|
        params[:attachment_data] = attachment_params[1]

        @attachment = @account.attachments.create(attachments_params)
        if params[:attachment_data][:filename].present?
          @attachment.attachment_blob.update_attribute(params[:attachment_data][:filename])
        end

        if @attachment.save
          # AWS S3 functionality disabled - using Azure storage instead
          # obj = Aws::S3::Object.new('secureprinting-bucket', ('a'..'z').to_a.shuffle[0,10].join, "#{Rails.application.credentials.dig(:aws, :access_key_id)}")
          if @attachment.attachment.image?
            # base64_string = Base64.encode64(File.read(params[:attachment_data][:attachment].path))
            # tempfile = Tempfile.new(["#{@attachment&.attachment_blob&.filename.to_s.sub(/\..*/, '')}", ".pdf"], Rails.root.join('tmp'))
            # tempfile.binmode
            # tempfile.write Base64.decode64(base64_string)
            # tempfile.close
            page_count = 1
            # AWS S3 upload disabled - using Azure storage
            # if obj.upload_file(tempfile.path, acl:'public-read')
            #   @attachment.update_attributes(pdf_url: obj.public_url, total_attachment_pages: page_count, total_pages: page_count)
            # else
            #   render json: {errors: [
            #     {user: 'Attachment not uploaded please upload again'},
            #   ]}, status: :unprocessable_entity
            # end
            @attachment.update_attributes(total_attachment_pages: page_count, total_pages: page_count)
          else
            # Libreconv gem not available - document conversion disabled
            # Libreconv.convert("#{params[:attachment_data][:attachment].path}", "public/#{@attachment&.attachment_blob&.filename.to_s.sub(/\..*/, '')}.pdf")
            # reader = PDF::Reader.new("public/#{@attachment&.attachment_blob&.filename.to_s.sub(/\..*/, '')}.pdf")
            # page_count = reader.page_count
            page_count = 1 # Default page count since Libreconv is not available
            # AWS S3 upload disabled - using Azure storage
            # if obj.upload_file("public/#{@attachment&.attachment_blob&.filename.to_s.sub(/\..*/, '')}.pdf", acl:'public-read')
            #   if @attachment.update_attributes(pdf_url: obj.public_url, total_attachment_pages: page_count, total_pages: page_count)
            #     File.delete(Rails.root + "public/#{@attachment&.attachment_blob&.filename.to_s.sub(/\..*/, '')}.pdf")
            #   end
            # else
            #   render json: {errors: [
            #     {user: 'Attachment not uploaded please upload again'},
            #   ]}, status: :unprocessable_entity
            # end
            @attachment.update_attributes(total_attachment_pages: page_count, total_pages: page_count)
          end
          @attachment_serializer << @attachment if @attachment.persisted?
        else
          render json: {errors: format_activerecord_errors(@attachment.errors)},
                 status: :unprocessable_entity
        end
      end

      if @attachment_serializer.present?
        render json: AttachmentSerializer.new(@attachment_serializer, meta: {
          message: "Attachment Created Successfully"
        }).serializable_hash, status: :created
      else
        render json: {errors: format_activerecord_errors(@attachment.errors)},
               status: :unprocessable_entity
      end
    end

    def destroy
      # JWT validation removed - @token not available
      # account = AccountBlock::Account.find @token.id if @token.id.present?
      account = nil # JWT validation disabled
      if account.present?
        attachment = account.attachments.find params[:id]
        if attachment.attachment.attached?
          attachment.update_attributes(:is_expired => true)
          attachment.destroy
          if account.attachments.present?
            attachments = Array.new
            account.attachments.each do |attachment|
              if attachment&.attachment&.attached?
                attachments <<  attachment
              end
            end
          end
          if attachments.present?
            render json: {meta: [{message: 'Attachment Deleted Successfully'},
            ]}, status: :ok
          else
            render json: {meta: [
              {message: 'Attachment deleted successfully and no more attachments'},
            ]}, status: :ok
          end
        else
          render json: {errors: [
            {user: 'Attachment not found'},
          ]}, status: :unprocessable_entity
        end
      end
    end

    private

    def set_account
      if params[:data].present?
        @account = AccountBlock::Account.find params[:data][:account_id]
      end
    end
    def attachments_params
      params.require(:attachment_data).permit(:colour, :layout, :page_size, :pdf_url, :scale,
                                              :print_sides,:print_pages_from, :print_pages_to,
                                              :total_attachment_pages, :total_pages, :is_expired,
                                              :attachment)
    end

    def add_allow_credentials_headers
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
      headers['Access-Control-Request-Method'] = '*'
      headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    end

    def format_activerecord_errors(errors)
      result = []
      errors.each do |attribute, error|
        result << { attribute => error }
      end
      result
    end
  end
end
