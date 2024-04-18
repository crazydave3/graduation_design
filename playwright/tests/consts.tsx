export const INFO = {
    address: "HeChen",
    cardInfo: {
        cardNumber: "4111111111111111",
        cvv: "111",
        expirationDate: "12/24",
    },
    city: "FoShan",
    country: "China",
    email: "huangjinming@aragoncs.com",
    firstName: "Huang",
    lastName: "jinMing",
    postalCode: "111111",
    phone: "15766273446",
    state: "Guangdong",
};

export const SELECT = {
    addressLine: "Address Line",
    button: "button" as "button",
    braintree: {
        cardNumberIframe: 'iframe[name="braintree-hosted-field-number"]',
        cvvNumberIframe: 'iframe[name="braintree-hosted-field-cvv"]',
        expirationDateIframe:
            'iframe[name="braintree-hosted-field-expirationDate"]',
        selectCardNumber: "Credit Card Number",
        selectCvv: "CVV",
        selectExpirationDate: "Expiration Date",
    },
    confirmEmailAddress: "Confirm Email Address",
    continueToCheckout: "Continue to Checkout",
    labelSelect: "Floating label select example",
    selectAddress: { name: "Address", exact: true },
    selectCity: { name: "City", exact: true },
    selectClose: { name: "Close" },
    selectContinue: { name: "Continue" },
    selectEmailAddress: "Email Address",
    selectEvent: { name: "BEACH-IT-2023-img BEACH IT!" },
    selectFirstName: "First Name",
    selectGroup: { hasText: "4 PeopleFrom $1,548.69 USD /" },
    selectLastName: "Last Name",
    selectPhoneNumber: { name: "Phone Number" },
    selectPostalCode: { name: "Postal Code" },
    selectRoom: { name: "Select Rooms" },
    selectHotel: { name: "Select This Hotel" },
    selectSubmitOrder: { name: "Submit Order" },
    selectTicket: {
        hasText:
            /^From \$2,064\.38 USD \/ Person\*Price shown based on 2 peopleSelect This Package$/,
    },
    textBox: "textbox" as "textbox",
};
