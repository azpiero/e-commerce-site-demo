'use client'

import { useState } from "react";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";


interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(1),
})

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({initialData} ) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData.name,
        }
    });
    
    const onSubmit = async (values: SettingsFormValues) => {
        try{
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, values);
            //mutateでなくrefreshすることで再取得できる
            router.refresh()
            toast({
                title: "Success",
                description: "Store settings updated",
            
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
            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push("/");
            toast({
                title: "Success",
                description: "Store deleted",
            
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
                    <Heading title="Settings" description="Settings for your store" />
                    <Button variant="destructive" size="sm" onClick={() =>{setOpen(true)}} disabled={loading}>
                        <Trash className="h-4 w-4" />
                    </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="store name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </div>
                    <Button disabled={loading} type="submit" className="ml-auto">Save Changes</Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert 
                title="NEXT_PUBLIC_API_URL" 
                description={`${origin}/api/${params.storeId}`} 
                variant="public" 
            />
        </>
    );
}

