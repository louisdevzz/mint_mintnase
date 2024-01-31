"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ModalTemplate } from '@/components/Modal/Modal';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useMintImage from "@/hooks/useMint";
import { getImageData } from "@/hooks/utils";
import { useState } from "react";
import { useMbWallet } from "@mintbase-js/react";
import type {
    CodeResult,
  } from "near-api-js/lib/providers/provider";
import { providers, utils } from "near-api-js";


export default function Minter() {
  const { form, onSubmit, preview, setPreview } = useMintImage();
  const [petData, setPetData] = useState<any>(null);
  const [name, setName] = useState("");
  const [image,setImage]= useState("");
  const [isShow, setIsShow] = useState(false)

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
        const petList = JSON.parse(Buffer.from(res.result).toString());
        setPetData(petList)
        setName(petList[19].name)
        setImage(petList[19].pet_evolution[2].image)
    })
   
    
  return (
    <>
    {/* <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Mint your NFT</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="h-2"></div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="h-2"></div>
            {preview && (
              <img
                src={preview as string}
                alt="Selected Preview"
                style={{
                  maxWidth: "330px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              />
            )}
            <FormField
              control={form.control}
              name="media"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="picture"
                      type="file"
                      {...rest}
                      onChange={(event) => {
                        const { files, displayUrl } = getImageData(event);
                        setPreview(displayUrl);
                        onChange(files);
                      }}
                      className="file:bg-black file:text-white file:border file:border-solid file:border-grey-700 file:rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-center items-center">
            <Button type="submit">Mint Me </Button>
          </CardFooter>
        </Card>
      </form>
    </Form> */}
    <div
      className="p-2 bg-black bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 rounded-xl shadow-xl cursor-pointer"
      onClick={()=>setIsShow(true)}
    >
      <div className="w-full relative">
      <img
            src={image}
            alt={name}
            className="rounded-md w-full h-64 object-cover"
          />
      </div>
      <div className="flex flex-col mt-2">
        <div className="font-semibold text-md text-black">{name}</div>
      </div>
    </div>
    <ModalTemplate closeModal={isShow}>
      <div className="mt-5 font-semibold text-lg text-black">Pet name</div>
      <Input className="mt-2 focus:outline-none focus:border-none text-black outline-none bg-white" placeholder="Enter pet name" type="text"/>
      <Button type="button" className="mt-5 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Change</Button>
    </ModalTemplate>
    </>
  );
}
