import { fetchApi } from './config';

export interface InquiryData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject?: string;
  message: string;
  inquiry_type: 'contact' | 'product' | 'b2b';
  product_name?: string;
}

export const submitInquiry = async (data: InquiryData) => {
  return await fetchApi('/inquiries/submit/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
