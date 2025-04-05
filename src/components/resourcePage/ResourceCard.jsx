import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import UpdateResource from "./UpdateResource";

const ResourceCard = ({ title, description, thumbnail, href, isAdmin, id,deleteResource,resources,setResources }) => {
  const handleDelete = ()=>{
    deleteResource(id)
  }
  
  
//   console.log(index)
  return (
    <div className="relative">
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <UpdateResource
            resources={resources}
            setResources={setResources}
            Title={title}
            Link={href}
            Description={description}
            id={id} 
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="p-2 shadow-md transition-all duration-300 hover:bg-red-50 hover:scale-110 hover:shadow-lg cursor-pointer"
            onClick = {handleDelete}
          >
            <Trash className="text-red-600 transition-colors duration-300 hover:text-red-700" />
          </Button>
        </div>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-50 p-6 rounded-md flex flex-col items-center text-center hover:shadow-md transition-shadow block"
      >
        <div className="w-50 mb-4">
          <AspectRatio ratio={16 / 9}>
            <img src={thumbnail} alt="Image" className="rounded-md object-cover" />
          </AspectRatio>
        </div>
        <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </a>
    </div>
  );
};

export default ResourceCard;