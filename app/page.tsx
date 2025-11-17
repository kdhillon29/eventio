import ExploreBtn from "@/components/ExploreBtn";

import EventCard from "@/components/EventCard";

import EventCardLoader from "@/components/EventCardLoader";
import { SelectEvent } from "@/utils/db/schema";
import { Suspense } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function EventsList() {
  const response = await fetch(`${BASE_URL}/api/events`);
  const { eventsData } = await response.json();

  return (
    <ul className="events">
      {eventsData?.map((event: SelectEvent) => (
        <li key={event.title}>
          <EventCard {...event} />
        </li>
      ))}
    </ul>
  );
}
export default async function Home() {
  // "use cache";
  // const response = await fetch(`${BASE_URL}/api/events`);
  // const { eventsData } = await response.json();

  // console.log(eventsData);
  return (
    <section>
      <h1 className="text-center max-sm:text-4xl text-6xl leading-10 tracking-wide">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-2 space-y-6 max-sm:text-sm max-sm:leading-8">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />
      <div className="mt-3 space-y-7 md:mt-6">
        <h3>Featured Events</h3>

        <Suspense
          fallback={
            <ul className="events">
              {Array.from({ length: 6 }).map((_, index) => (
                <li key={index}>
                  <EventCardLoader />
                </li>
              ))}
            </ul>
          }
        >
          <EventsList />
        </Suspense>
      </div>
    </section>
  );
}
