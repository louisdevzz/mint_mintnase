/**
 * @file useMint.ts
 * @title Minting Hook for Images
 * @description Provides a React hook `useMintImage` for handling the minting process of images on the Mintbase platform.
 * This includes form handling, file uploading, and interacting with the Mintbase blockchain to mint the image as an NFT.
 * It utilizes the `@mintbase-js/react` and `@mintbase-js/storage` packages for wallet integration and file storage, respectively.
 * The hook returns an object containing the form handlers and a preview state for the image to be minted.
 */

"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMbWallet } from "@mintbase-js/react";

import { zodResolver } from "@hookform/resolvers/zod";

import { ArweaveResponse, uploadFile, uploadReference } from "@mintbase-js/storage"
import { formSchema } from "./formSchema";
import { MintbaseWalletSetup, proxyAddress } from "@/config/setup";
import { Wallet } from "@near-wallet-selector/core"

interface SubmitData {
  title: string;
  description: string;
  media: ((false | File) & (false | File | undefined)) | null;
}


const useUpdateMetadata = () => {
  const { selector, activeAccountId } = useMbWallet();
  const [preview, setPreview] = useState<string | File>("");

  const getWallet = async () => {
    try {
      return await selector.wallet();
    } catch (error) {
      console.error("Failed to retrieve the wallet:", error);
      throw new Error("Failed to retrieve the wallet");
    }
  };


  const onSubmit = async () => {
    const wallet = await getWallet();

  
    await handleMint(activeAccountId as string, wallet);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  async function handleMint(
    activeAccountId: string,
    wallet: Wallet
  ) {
    await wallet.signAndSendTransaction({
      signerId: activeAccountId,
      receiverId: "nft.joychi.testnet",
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "update_metadata_pet",
            args: {
              "tokenId": "26",
              "petAttributes": {
                  "petName": "Test",
                  "image": "abc.com",
                  "score": 100,
                  "level": 1,
                  "status": 0,
                  "star": 3,
              }
            },
            gas: "200000000000000",
            deposit: "0",
          },
        },
      ],
    });
  }

  return { form, onSubmit, preview, setPreview };
};

export default useUpdateMetadata;