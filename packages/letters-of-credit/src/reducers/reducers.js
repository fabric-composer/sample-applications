import {combineReducers} from 'redux'
import * as actions from '../actions/actions'

const initialState = {
  applicant: {
    name: 'Alice Hamilton',
    companyName: 'QuickFix IT',
    IBAN: 'AR22 9876 5321 9090',
    swiftCode: 'BKDOAR22',
    bankName: 'Bank of Dinero'
  },
  beneficiary: {
    name: 'Bob Appleton',
    companyName: 'Conga Computers',
    IBAN: 'BE05 1234 5678 0101',
    swiftCode: 'EWBKBE05',
    bankName: 'Eastwood Banking'
  },
  productDetails: {
    type: "",
    quantity: 0,
    pricePerUnit: 0,
    total: 0
  },
  rules: [
    {ruleText: "The correct quantity of product has been delivered."},
    {ruleText: "The product was received within 30 days of the placement of the order."},
    {ruleText: "The product is not damaged and functions as expected."}
  ]
}

const getLetterInputReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_APPLICANT:
      return { ...state, applicant: action.payload };
    case actions.GET_BENEFICIARY:
      return { ...state, beneficiary: action.payload };
    case actions.GET_PRODUCT_DETAILS:
      return { ...state, productDetails: action.payload };
    case actions.GET_RULES:
      return { ...state, rules: [...state.rules, action.payload] };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
   getLetterInputReducer
})

export default rootReducer;
