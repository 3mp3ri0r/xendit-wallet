import type { NextPage } from 'next'
import Head from 'next/head'
import Script from 'next/script'
import { useEffect, useState } from "react";

enum InputType {
  CARD_NUMBER = 'card_number',
  EXPIRY_DATE = 'expiry_date',
  CVN_NUMBER = 'cvn_number'
}

const Checkout: NextPage = () => {
  const [xendit, setXendit] = useState<any>(null)
  useEffect(() => {
    if (xendit !== null) {
      xendit.xendit.setPublishableKey('xnd_public_development_c7w8RqLzrMbaZwDWVwlfpfu189J9hKZCtg41jin06cHpwtXNOnKsHuLXhn0K')
    }
  }, [xendit])

  const [cardNumber, setCardNumber] = useState('4000000000000002');
  const [expiryMonth, setExpiryMonth] = useState('12');
  const [expiryYear, setExpiryYear] = useState('2024');
  const [cardCVN, setCardCVN] = useState('123');
  const [cardToken, setCardToken] = useState();
  const [tokenStatus, setTokenStatus] = useState("Awaiting transaction");

  const handleVerification = (type: InputType, value: string, value2 = "") => {
    if (type === InputType.CARD_NUMBER) {
      if (!xendit.xendit?.card.validateCardNumber(value)) {
        console.log("Credit card number is invalid!");
      }
    } else if (type === InputType.EXPIRY_DATE) {
      if (!xendit.xendit?.card.validateExpiry(value, value2)) {
        console.log("Expiry date is invalid!");
      }
    } else if (type === InputType.CVN_NUMBER) {
      if (!xendit.xendit?.card.validateCvn(value)) {
        console.log("CVN number is invalid!");
      }
    }
    return;
  }

  const responseHandler = (err: any, creditCardCharge: any) => {
    if (err) {
      console.log(err);
      return;
    }

    if (creditCardCharge.status === "VERIFIED") {
      console.log("verified triggered");
      const token = creditCardCharge.id;
      setCardToken(token);
      setTokenStatus("Verified");
    } else if (creditCardCharge.status === "IN_REVIEW") {
      console.log("in review triggered");
      const authenticationUrl = creditCardCharge.payer_authentication_url;
      setCardToken(authenticationUrl);
      setTokenStatus("In Review");
      window.open(
        creditCardCharge.payer_authentication_url,
        "sample-inline-frame"
      );
    } else if (creditCardCharge.status === "FAILED") {
      console.log("failed triggered");
      setCardToken(creditCardCharge.failure_reason);
      setTokenStatus("Failed");
    }
  }

  const paymentHandler = () => {
    handleVerification(InputType.CARD_NUMBER, cardNumber)
    handleVerification(InputType.EXPIRY_DATE, expiryMonth, expiryYear)
    handleVerification(InputType.CVN_NUMBER, cardCVN)

    xendit.xendit?.card.createToken({
      amount: 100000,
      card_number: cardNumber,
      card_exp_month: expiryMonth,
      card_exp_year: expiryYear,
      card_cvn: cardCVN,
      is_multiple_use: false
    }, responseHandler)
  }

  return (
    <div>
      <Head>
        <title>Checkout Order</title>
      </Head>
      <Script
        type="text/javascript"
        src="https://js.xendit.co/v1/xendit.min.js"
        onLoad={(e) => {
          setXendit({xendit: (window as any).Xendit})}
        } />
      <article>
        <p>You ordered a new cloth with total amount: Rp 100.000,00</p>
        <div>
          <label htmlFor='CCN'>Credit card number:</label>
          <input
            placeholder='Input your credit card number'
            name='CCN'
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)} />
        </div>
        <div>
          <label htmlFor='expiryMonth'>Expiry month:</label>
          <input
            placeholder='Input your card expiration month'
            name='expiryMonth'
            value={expiryMonth}
            onChange={(e) => setExpiryMonth(e.target.value)} />
        </div>
        <div>
          <label htmlFor='expiryYear'>Expiry year:</label>
          <input
            placeholder='Input your card expiration year'
            name='expiryYear'
            value={expiryYear}
            onChange={(e) => setExpiryYear(e.target.value)} />
        </div>
        <div>
          <label htmlFor='CVN'>CVN number:</label>
          <input
            placeholder='Input your card CVN number'
            name='CVN'
            value={cardCVN}
            onChange={(e) => setCardCVN(e.target.value)} />
        </div>
        <button onClick={paymentHandler}>Pay With Credit Card!</button>
      </article>
    </div>
  )
}

export default Checkout
