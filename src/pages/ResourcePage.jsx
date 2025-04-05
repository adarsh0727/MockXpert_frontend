import React, { useState,useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import ResourceCard from "../components/resourcePage/ResourceCard";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "../lib/axios";

import AddResourceCard from "../components/resourcePage/AddResource";
import { toast } from "sonner";


const ResourcePage = () => {
  const {authUser} = useAuthStore()
  const [isAdmin, setAdmin] = useState(authUser.isAdmin);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axiosInstance.get("/resources", { withCredentials: true });
        setResources( res.data  );
        // console.log(res.data)
      } catch (error) {
        console.error("Error fetching resources:", error);
        setResources([]);
      }
    };
    fetchResources();
  }, []);

  const deleteResource = async(id)=>{
    try {
      await axiosInstance.delete("/resources/"+id)
      setResources(resources.filter((resource)=>{
        return resource._id!==id;
      }))
      toast("resource deleted successfully")
      
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  }
  

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Enhanced header with background and better styling */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-lg shadow-lg p-6 mb-10 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 mr-4 bg-white p-2 rounded-lg shadow">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="7" width="6" height="10" rx="1" fill="#3034A9" />
                <rect x="9" y="5" width="6" height="14" rx="1" fill="#4045C9" />
                <rect x="16" y="9" width="6" height="6" rx="1" fill="#5156E5" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Resources Page</h1>
              <p className="text-blue-100 mt-1">
                Explore useful resources for learning and improving your skills.
              </p>
            </div>
          </div>
          
          {isAdmin && (
            <AddResourceCard
              resources={resources}
              setResources={setResources}
              isUpdate={false}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          // console.log(resources),
          <ResourceCard
            key={index}
            id={resource._id}
            href={resource.link}
            title={resource.title}
            description={resource.description}
            thumbnail={resource.thumbnail}
            isAdmin={isAdmin}
            deleteResource={deleteResource}
            resources={resources}
            setResources={setResources}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourcePage;