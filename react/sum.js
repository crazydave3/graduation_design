import { useEffect, useRef } from 'react'
import { Dropin } from 'braintree-web-drop-in'
import { getBraintreeClientToken } from 'store/actions/fetchCart'
import braintree from 'braintree-web'

export type BraintreeFormDropInType = {
    orderUrl: string
    setBraintreeFormError: ({ message, error }: { message: string; error: any }) => void
    setDropInInstance: (instance: Dropin | undefined) => void
    shouldVaultCardInfo: boolean
    // Pass the userId if we want to get/set vaulted payments
    userId?: string
}

// We can make this locale configurable, but for now its set to U.S. English
const USER_LOCALE = 'en_US'

export const BraintreeFormDropInComponent = ({
    orderUrl,
    setBraintreeFormError,
    setDropInInstance,
    shouldVaultCardInfo,
    userId
}: BraintreeFormDropInType): JSX.Element => {
    const braintreeDropinRef = useRef(null)
    useEffect(() => {
        const braintreeInitialization = async () => {
            try {
                const braintreeClientToken = await getBraintreeClientToken(orderUrl)
                // braintree.create(
                //     {
                //         authorization: braintreeClientToken,
                //         card: {
                //             overrides: {
                //                 fields: {
                //                     number: {
                //                         placeholder: ''
                //                     },
                //                     expirationDate: {
                //                         placeholder: ''
                //                     },
                //                     cvv: {
                //                         placeholder: ''
                //                     }
                //                 }
                //             }
                //         },
                //         container: '#dropin-container',
                //         dataCollector: {
                //             kount: true
                //         },
                //         ...(userId ? { customer: { id: userId } } : {}),
                //         locale: USER_LOCALE,
                //         preselectVaultedPaymentMethod: shouldVaultCardInfo,
                //         vaultManager: true,
                //         // threeDSecure: true
                //         // As we are not currently accepting paypal, we should hide the customers paypal options if already vaulted.
                //         // hiddenVaultedPaymentMethodTypes: ['paypal', 'paypalCredit'],
                //     },
                //     (err, instance) => {
                //         if (err) {
                //             console.error(err)
                //             setBraintreeFormError({
                //                 message: 'Error creating the braintree instance',
                //                 error: err
                //             })
                //             return
                //         }
                //         console.log({ instance })
                //         setDropInInstance(instance)
                //     }
                // )
                braintree.client.create(
                    {
                        authorization: braintreeClientToken
                    },
                    (err, clientInstance) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        braintree.hostedFields.create(
                            {
                                client: clientInstance,
                                styles: {
                                    input: {
                                        // change input styles to match
                                        // bootstrap styles
                                        'font-size': '1rem',
                                        color: '#495057'
                                    }
                                },
                                fields: {
                                    number: {
                                        selector: '#cc-number',
                                        placeholder: '4111 1111 1111 1111'
                                    },
                                    cvv: {
                                        selector: '#cc-cvv',
                                        placeholder: '123'
                                    },
                                    expirationDate: {
                                        selector: '#cc-expiration',
                                        placeholder: 'MM / YY'
                                    }
                                }
                            },
                            (err, hostedFieldsInstance) => {
                                if (err) {
                                    console.error(err)
                                    return
                                }
                            }
                        )
                    }
                )
            } catch (e) {
                console.error('braintree create error: ', e)
            }
        }
        if (braintreeDropinRef.current !== null) {
            braintreeInitialization()
        }
    }, [
        braintreeDropinRef,
        orderUrl,
        setBraintreeFormError,
        setDropInInstance,
        shouldVaultCardInfo,
        userId
    ])

    return (
        // <div
        //     id="dropin-container"
        //     ref={braintreeDropinRef}
        // />
        <>
            <label
                className="hosted-fields--label"
                htmlFor="cc-number"
            >
                Card Number
            </label>
            <input
                id="cc-number"
                className="hosted-field"
            ></input>

            <label
                className="hosted-fields--label"
                htmlFor="cc-expiration"
            >
                Expiration Date
            </label>
            <input
                id="cc-expiration"
                className="hosted-field"
            ></input>

            <label
                className="hosted-fields--label"
                htmlFor="cc-cvv"
            >
                CVV
            </label>
            <input
                id="cc-cvv"
                className="hosted-field"
            ></input>
        </>
    )
}
