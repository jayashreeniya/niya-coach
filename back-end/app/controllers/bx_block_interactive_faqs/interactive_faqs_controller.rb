module BxBlockInteractiveFaqs
  class InteractiveFaqsController < ApplicationController
    before_action :load_faq, only: [:show, :update, :destroy]

    def create
      faq = InteractiveFaqs.new(faqs_params)
      save_result = faq.save

      if save_result
        render json: serialized_response(faq.to_custom_hash), status: :created
      else
        render json: ErrorSerializer.new(faq).serializable_hash,
               status: :unprocessable_entity
      end
    end

    def show
      return if @faq.nil?

      render json: serialized_response(@faq.to_custom_hash), status: :ok
    end

    def index
      render json: serialized_response(InteractiveFaqs.all), status: :ok
    end

    def destroy
      return if @faq.nil?

      if @faq.destroy
        render json: { message: "FAQ deleted" }, status: :ok
      else
        render json: ErrorSerializer.new(@faq).serializable_hash,
               status: :unprocessable_entity
      end
    end

    def update
      return if @faq.nil?

      update_result = @faq.update(faqs_params)

      if update_result
        render json: serialized_response(@faq.to_custom_hash), status: :ok
      else
        render json: ErrorSerializer.new(@faq).serializable_hash,
               status: :unprocessable_entity
      end
    end

    private

    def load_faq
      @faq = InteractiveFaqs.find_by(id: params[:id])

      if @faq.nil?
        render json: {
            message: "FAQ with id #{params[:id]} doesn't exists"
        }, status: :not_found
      end
    end

    def faqs_params
      params.permit(:title, :content)
    end

    def serialized_response(faqs_data)
      {
          success: true,
          message: '',
          data: {
              faqs: faqs_data.is_a?(Hash) ? [faqs_data] : faqs_data
          },
          meta: [],
          errors: []
      }
    end
  end
end

