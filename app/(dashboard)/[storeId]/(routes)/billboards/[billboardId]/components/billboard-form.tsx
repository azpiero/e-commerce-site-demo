'use client'

import { useState } from "react";
import { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().url()
})

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ( {initialData} ) => {
    const params = useParams();
    const router = useRouter();

    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            imageUrl: ""
        }
    });

    // これもすばらしい書き方
    const title = initialData ? "Edit Billboard" : "New Billboard";
    const description = initialData ? "Edit your billboard" : "Create a new billboard";
    const toastMassage = initialData ? "Billboard updated" : "Billboard created";
    const action = initialData ? "Save Changes" : "Create Billboard";
    
    const onSubmit = async (values: BillboardFormValues) => {
        try{
            setLoading(true);
            if (initialData){
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values);
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, values);
            }
            //mutateでなくrefreshすることで再取得できる
            router.refresh()
            router.push(`/${params.storeId}/billboards`);
            toast({
                title: "Success",
                description: toastMassage,
            })

        }catch(error){
            toast({
                title: "Error",
                description: "Failed to update store settings",
            
            })
        }finally{
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try{
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast({
                title: "Success",
                description: "billboard deleted",
            })
        }catch(error){
            toast({
                title: "Error",
                description: "Failed to delete store",
            })
        } finally{
            setLoading(false);
            setOpen(false);
        
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading}/>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                { initialData && (
                    <Button variant="destructive" size="sm" onClick={() =>{setOpen(true)}} disabled={loading}>
                        <Trash className="h-4 w-4" />
                    </Button>)
                }  
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Background Image</FormLabel>
                                    <FormControl>
                                        <ImageUpload 
                                            disabled={loading} 
                                            value={field.value ? [field.value] : []} 
                                            onChange={field.onChange}
                                            onRemove={() => field.onChange("")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    <div className="grid grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="label"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>label</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="billboard label" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </div>
                    <Button disabled={loading} type="submit" className="ml-auto">{action}</Button>
                </form>
            </Form>        
        </>
    );
}

