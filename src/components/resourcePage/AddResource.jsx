import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

const addResourceSchema = z.object({
    title: z.string().min(1, { message: "Required!" }),
    description: z.string().min(1, { message: "Required!" }),
    link:z.string().min(1, { message: "Required!" }),
    thumbnail: z.string()
        
});

const AddResourceCard = ({resources,setResources}) => {
    const [thumbNail,setThumbNail] = useState("");
    const [open, setOpen] = useState(false);
    
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
    };
    const addResourceForm = useForm({
        resolver: zodResolver(addResourceSchema),
        defaultValues: {
          title: "",
          description:"",
          link:"",
          thumbnail:"",
        },
    });
    
    const addResource = async(data) => {
        // console.log(thumbNail)
        try {
            const res = await axiosInstance.post("/resources", {title:data.title,description:data.description,link:data.link,thumbnail:thumbNail});
            toast("new resource added successfully");
            setResources([...resources,res.data.newResource])
            setThumbNail("");
            addResourceForm.reset();
            setOpen(false);
        } catch (error) {
            // console.log(error.response.data.m    essage)
            toast(error.response.data.message);
        }
        
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
            onClick={() => setOpen(true)}
            className="bg-white text-blue-700 hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2 hover:scale-105 rounded-full px-4 md:px-4 py-2 md:py-2 "
        >
            <Plus size={20} className="text-blue-700 font-bold" />
            <span className="hidden sm:inline">Add Resource</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new Resource</DialogTitle>
          <DialogDescription>
            Fill out the details required for Resource
          </DialogDescription>
        </DialogHeader>
        <Form {...addResourceForm}>
            <form
                onSubmit={addResourceForm.handleSubmit(addResource)}
                className="space-y-8"
            >
                <FormField
                    control={addResourceForm.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Title :</FormLabel>
                        <FormControl>
                            <Input placeholder="SD sheet" {...field} />
                        </FormControl>
                        <FormDescription>
                            Enter the title for Resource
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={addResourceForm.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description :</FormLabel>
                        <FormControl>
                            <Input placeholder="DSA course" {...field} />
                        </FormControl>
                        <FormDescription>
                            Enter about resource
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={addResourceForm.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Link :</FormLabel>
                        <FormControl>
                            <Input placeholder="gfg" {...field} />
                        </FormControl>
                        <FormDescription>
                            Enter link to Resource
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={addResourceForm.control}
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
                            Enter photo for thumbnail 
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button type="submit" className="w-full hover:cursor-pointer">
                    Add Resource
                </Button>
                
            </form>
        </Form>
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="name"
              defaultValue="SD Sheet"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Discription
            </Label>
            <Input
              id="name"
              defaultValue="DSA Course"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Link
            </Label>
            <Input
              id="name"
              defaultValue="link"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="picture" className="text-right">
                Thumbnail
            </Label>
            <Input 
                id="picture" 
                type="file" 
                className="col-span-3" 
            />
          </div>
        </div> */}
        {/* <DialogFooter>
          <Button type="submit">Add Resource</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>   

  );
}

export default AddResourceCard;