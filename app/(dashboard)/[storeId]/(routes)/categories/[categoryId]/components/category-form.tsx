'use client'

import { useState } from "react";
import { Billboard, Category } from "@prisma/client";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
})

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ( {initialData, billboards} ) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

     // これもすばらしい書き方
    const title = initialData ? "Edit Category" : "New Category";
    const description = initialData ? "Edit your category" : "Create a new category";
    const toastMassage = initialData ? "Category updated" : "Category created";
    const action = initialData ? "Save Changes" : "Create Category";
    
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            billboardId: ""
        }
    });

    const onSubmit = async (values: CategoryFormValues) => {
        try{
            setLoading(true);
            if (initialData){
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, values);
            } else {
                await axios.post(`/api/${params.storeId}/categories`, values);
            }
            //mutateでなくrefreshすることで再取得できる
            router.refresh()
            router.push(`/${params.storeId}/categories`);
            toast({
                title: "Success",
                description: toastMassage,
            })

        }catch(error){
            toast({
                title: "Error",
                description: "Failed to update category settings",
            
            })
        }finally{
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try{
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast({
                title: "Success",
                description: "category deleted",
            })
        }catch(error){
            toast({
                title: "Error",
                description: "Failed to delete category",
            })
        } finally{
            setLoading(false);
            setOpen(false);
        
        }
    }

    console.log("watch", form.watch("billboardId"));

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
                    <div className="grid grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="category name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="billboardId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>billboard</FormLabel>
                                <Select
                                    disabled={loading} 
                                    onValueChange={field.onChange}
                                    value={field.value} 
                                    defaultValue={field.value}
                                 >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue 
                                                defaultValue={field.value}
                                                placeholder="Select a billboard"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            billboards.map((billboard) => (
                                            <SelectItem 
                                                key={billboard.id} 
                                                value={billboard.id}>
                                                {billboard.label}
                                            </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
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

