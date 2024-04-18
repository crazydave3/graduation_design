import { test, expect } from "@playwright/test";
import { SELECT, INFO } from "./consts";

const {
    address,
    cardInfo,
    city,
    country,
    email,
    firstName,
    lastName,
    postalCode,
    phone,
    state,
} = INFO;
const { cardNumber, cvv, expirationDate } = cardInfo;
const {
    addressLine,
    button,
    braintree,
    confirmEmailAddress,
    continueToCheckout,
    labelSelect,
    selectAddress,
    selectCity,
    selectClose,
    selectContinue,
    selectEmailAddress,
    selectEvent,
    selectFirstName,
    selectGroup,
    selectLastName,
    selectPhoneNumber,
    selectPostalCode,
    selectRoom,
    selectHotel,
    selectSubmitOrder,
    selectTicket,
    textBox,
} = SELECT;
const {
    cardNumberIframe,
    cvvNumberIframe,
    expirationDateIframe,
    selectCardNumber,
    selectCvv,
    selectExpirationDate,
} = braintree;
test("place order", async ({ page }) => {
    const continueButton = page.getByRole(button, selectContinue);
    await page.goto("http://localhost:3000");
    await page.evaluate(async () => {
        const scrollTo = setInterval(() => {
            window.scrollTo({ top: 6000 });
            console.log(window.scrollY, "window.scrollY");

            if (window.scrollY > 3500) {
                clearInterval(scrollTo);
            }
        }, 3000);
    });
    await page.getByRole(button, selectEvent).click();

    await page.locator("div").filter(selectTicket).getByRole(button).click();
    await page.locator("label").filter(selectGroup).click();
    await continueButton.click();
    await page.getByRole(button, selectHotel).nth(1).click();
    await page.getByRole(button, selectRoom).nth(2).click();
    await continueButton.click();
    await page.evaluate(async () => {
        const continueToClick = setInterval(() => {
            const title = document.getElementsByClassName("btn");
            if (
                title.length > 0 &&
                title[0].innerHTML.includes("Continue to Checkout")
            ) {
                window.location.href =
                    "http://localhost:3000/events/BEACH-IT-2023/checkout/submit";
                clearInterval(continueToClick);
            }
        }, 3000);
        // const title = document.querySelector("title");
        // if (title?.innerText.includes("add-ons")) {
        //     await continueButton.click();
        // } else {
        //     await page.getByText(continueToCheckout).click();
        // }
    });
    await page.getByLabel(addressLine).fill(email);
    await page.getByLabel(confirmEmailAddress).fill(email);
    const shippingAddress = page.locator("#shippingAddressError");
    await shippingAddress.getByPlaceholder(selectFirstName).fill(firstName);
    await shippingAddress.getByPlaceholder(selectLastName).fill(lastName);
    await page.getByRole(textBox, selectAddress).fill(address);
    await page.getByRole(textBox, selectCity).fill(city);
    await page.getByLabel(labelSelect).first().selectOption(country);
    await page.getByLabel(labelSelect).nth(1).first().selectOption(state);
    await page.getByRole(textBox, selectPostalCode).fill(postalCode);
    await page.getByRole(textBox, selectPhoneNumber).fill(phone);
    await page.getByRole("checkbox").nth(3).check();
    await page.getByPlaceholder(selectFirstName).nth(1).fill(firstName);
    await page.getByPlaceholder(selectLastName).nth(1).fill(lastName);
    await page.getByPlaceholder(selectEmailAddress).first().fill(email);
    await page.getByPlaceholder(selectFirstName).nth(2).fill(firstName);
    await page.getByPlaceholder(selectLastName).nth(2).fill(lastName);
    await page.getByPlaceholder(selectEmailAddress).nth(1).fill(email);
    await page
        .frameLocator(cardNumberIframe)
        .getByLabel(selectCardNumber)
        .fill(cardNumber);
    await page
        .frameLocator(expirationDateIframe)
        .getByLabel(selectExpirationDate)
        .fill(expirationDate);
    await page.frameLocator(cvvNumberIframe).getByLabel(selectCvv).fill(cvv);
    await page.getByRole(button, selectSubmitOrder).click();
    await page.getByRole(button, selectClose).click();
});

test("get started link", async ({ page }) => {
    await page.goto("http://localhost:3000");
    const a = page.getByRole("button", {
        name: "edc-2024-img EDC 2024 May 19",
    });
    console.log(a, "aaaaaaaa");
});
