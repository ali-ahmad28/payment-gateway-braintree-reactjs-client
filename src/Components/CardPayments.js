import react, { useEffect, useState } from 'react';

import "braintree-web";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";

const CardPayments = () => {

    const [clientToken, setClientToken] = useState();
    const [instance, setInstance] = useState();

    const buy = async () => {
        try {
            const nonce = await instance.requestPaymentMethod();
            console.log("nonce ",nonce)
            const response = await axios.post(
                "http://localhost:8000/api/braintree/v1/sandbox",
                nonce
            );
            console.log(response);
        }
        catch (err) {
            console.log(err);
        }
    }

    const getToken = async ()=>{
        try {
            console.log("here1")
            const response = await axios.get("http://localhost:8000/api/braintree/v1/getToken");
            console.log("here2")
            const clientToken = response.data.clientToken;
            setClientToken(clientToken)
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(()=>{
        getToken()
    }, [])


    return (
        <>
            {
                !clientToken?
                    (
                    <div>
                        <h1>Loading...</h1>
                    </div>
                    )
                    :
                    (
                    <div>
                        <DropIn
                            options={{
                                authorization: clientToken
                            }}
                            onInstance={(instance) => { setInstance(instance) }}
                        />
                        <button onClick={buy}>Buy</button>
                    </div>
                    )
            }
        </>
    )
}

export default CardPayments;