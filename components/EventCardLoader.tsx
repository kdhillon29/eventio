import React from "react";
import { Skeleton } from "./ui/skeleton";

const EventCardLoader = () => {
  return (
    <div className="flex flex-col justify-start items-start gap-3 p-5">
      <Skeleton className="h-[200px] w-[300px] rounded-lg bg-gray-600" />
      <Skeleton className="h-[10px] w-[80px] rounded-full bg-gray-600 " />
      <Skeleton className="h-[15px] w-[150px] rounded-full bg-gray-600 my-3 " />
      <Skeleton className="h-[15px] w-[150px] rounded-full bg-gray-600" />
    </div>
  );
};

export default EventCardLoader;
