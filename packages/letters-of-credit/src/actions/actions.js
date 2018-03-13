export const GET_APPLICANT = 'GET_APPLICANT';
export const GET_BENEFICIARY = 'GET_BENEFICIARY';
export const GET_PRODUCT_DETAILS = 'GET_PRODUCT_DETAILS';
export const GET_RULES = 'GET_RULES';

export function getApplicant(applicant) {
    return {
        type: GET_APPLICANT,
        payload: applicant
    };
}

export function getBeneficiary(beneficiary) {
    return {
        type: GET_BENEFICIARY,
        payload: beneficiary
    }
}

export function getProductDeatils(productDetails) {
   return {
      type: GET_PRODUCT_DETAILS,
      payload: productDetails
   };
}

export function getRules(rules) {
   return {
      type: GET_RULES,
      payload: rules
   };
}
