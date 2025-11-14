/** Single QR record coming from backend (matches qr_codes table columns) */
export interface QRGenerateRecord {
  'uuid': string,
  'product_id': number | null,
  'verity_name': string | null,
  'hindi_input_text': any | null,
  'english_input_text': any | null,
  'gujarati_input_text': any | null,
  'pdf_path': any | null,
  'qr_image_path': any | null,
  'status': boolean | null,

}

export interface QRGenerateConfigurationRecord {
  data: {
    'uuid': string,
    'website_url': string,
    'company_name': string,
    'company_address': string,
    'manufacturing_address': string,
    'company_mobile_number': string,
    'company_email': string,
    'header_text': string,
    'footer_text': string,
    'header_background_color': string,
    'footer_background_color': string,
    'header_color': string,
    'footer_color': string,
    'logo_path': string,
    'show_logo': string,
    'qr_color': string,
    'facebook_id': string,
    'instagram_id': string,
    'twitter_id': string,
    'linkedin_id': string,
    'youtube_id': string,
  }
}

/** API payload wrapper you were using previously (data property) */
export interface QRGenerate {
  data: QRGenerateRecord;
}

/** Dropdown minimal shape for selects */
export interface QRGenerateDropdown {
  id: number;
  uuid: string;
  title: string;
}

/** Pagination block for list endpoints */
export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

/** Typical list response from backend */
export interface QRGenerateListResponse {
  success: boolean;
  message?: string;
  columns?: string[];
  visible_columns?: string[];
  data: PaginatedData<QRGenerateRecord>;
}

/** Single response */
export interface QRGenerateSingleResponse {
  success: boolean;
  message?: string;
  data: QRGenerateRecord;
}
