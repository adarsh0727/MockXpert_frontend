import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast } from "sonner";


// const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
// const ACCEPTED_FILE_TYPES = ['image/png'];

const updateResourceSchema = z.object({
    title: z.string().min(1, { message: "Required!" }),
    description: z.string().min(1, { message: "Required!" }),
    link:z.string().min(1, { message: "Required!" }),
        
});

const UpdateResource = ({resources,setResources,Title,Description,Link,id}) => {
    const [thumbNail,setThumbNail] = useState('');
    const [open, setOpen] = useState(false);
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
    };
    const updateResourceForm = useForm({
        resolver: zodResolver(updateResourceSchema),
        defaultValues: {
          title: Title,
          description:Description,
          link:Link,
        },
    });
    
    const updateResource = async(data) => {
        try {
            const res=await axiosInstance.put("/resources/"+id, {title:data.title,description:data.description,link:data.link,thumbnail:thumbNail});
            const response=res.data.resource
            console.log(response)
            setResources(resources.filter((resource)=>{
                if(resource._id===id){
                    resource.title=response.title;
                    resource.description=response.description;
                    resource.link=response.link
                    resource.thumbnail=response.thumbnail
                }
                return resource;
            }))
            toast("resource updated successfully");
            setOpen(false);
        } catch (error) {
            console.log(error)
            // toast(error.response.data.message);
        }
        
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setOpen(true)}
            className="p-2 shadow-md transition-all duration-300 hover:bg-gray-100 hover:scale-110 hover:shadow-lg cursor-pointer"
        >
            <Pencil className="text-gray-700 transition-colors duration-300 hover:text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Resource</DialogTitle>
          <DialogDescription>
            Update Resource details 
          </DialogDescription>
        </DialogHeader>
        <Form {...updateResourceForm}>
            <form
                onSubmit={updateResourceForm.handleSubmit(updateResource)}
                className="space-y-8"
            >
                <FormField
                    control={updateResourceForm.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Title :</FormLabel>
                        <FormControl>
                            <Input placeholder={Title} {...field} />
                        </FormControl>
                        <FormDescription>
                            Update the title for Resource
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={updateResourceForm.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description :</FormLabel>
                        <FormControl>
                            <Input placeholder={Description} {...field} />
                        </FormControl>
                        <FormDescription>
                            Update about resource
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={updateResourceForm.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Link :</FormLabel>
                        <FormControl>
                            <Input placeholder={Link} {...field} />
                        </FormControl>
                        <FormDescription>
                            Update link to Resource
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={updateResourceForm.control}
                    name="thumbnail"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Thumbnail :</FormLabel>
                        <FormControl>
                            <Input id="picture"
                                type="file"
                                accept="image/*"
                                onChange={async (event) => {
                                    const file = event.target.files[0];
                                    if (file) {
                                    field.onChange("done"); 
                                    // Convert to Base64
                                    const base64 = await convertToBase64(file);
                                    setThumbNail(base64); 
                                }}}
                            />
                        </FormControl>
                        <FormDescription>
                            Update thumbnail for Resource 
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" className="w-full hover:cursor-pointer">
                    Update Resource
                </Button>
                
            </form>
        </Form>
      </DialogContent>
    </Dialog>   

  );
}

export default UpdateResource;