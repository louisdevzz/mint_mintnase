import { useState } from "react";
import { useMbWallet } from "@mintbase-js/react";
import type {
    AccountView,
    CodeResult,
  } from "near-api-js/lib/providers/provider";
  import { providers, utils } from "near-api-js";


const useGetMetadata = async() =>{
    const [petData, setPetData] = useState<any>(null);
    const { selector,activeAccountId } = useMbWallet();
    const {network} = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
    provider.query<CodeResult>({
        request_type: "call_function",
        account_id: "game.joychi.testnet",
        method_name: "get_all_pet_metadata",
        args_base64: 'e30=',
        finality: "optimistic",
      })
      .then((res:any) => {
        const petList = JSON.parse(Buffer.from(res.result).toString()).filter((pet:any) => pet );
        // /console.log(petList)
        setPetData(petList)
    })
    return petData;
    
}
export default useGetMetadata;