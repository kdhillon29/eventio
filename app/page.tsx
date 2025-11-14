import ExploreBtn from "@/components/ExploreBtn";

import EventCard from "@/components/EventCard";

import { db } from "@/utils/drizzle";
import { events } from "@/utils/db/schema";
import { SelectEvent } from "@/utils/db/schema";
import { events as seedData } from "@/lib/constants";
import EventCardLoader from "@/components/EventCardLoader";

export default async function Home() {
  "use cache";
  const eventsData = await db.select().from(events);
  //  / const eventsData = seedData as SelectEvent[];
  // console.log(eventsData);
  return (
    <section>
      <h1 className="text-center max-sm:text-3xl">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-2 max-sm:text-sm">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />
      <div className="mt-3 space-y-7 md:mt-6">
        <h3>Featured Events</h3>

        <>
          {eventsData?.length === 0 && (
            <ul className="events">
              {[1, 2, 3, 4].map((_, index) => (
                <li key={index}>
                  <EventCardLoader />
                </li>
              ))}
            </ul>
          )}

          {eventsData?.length > 0 && (
            <ul className="events">
              {eventsData?.map((event) => (
                <li key={event.title}>
                  <EventCard {...event} />
                </li>
              ))}
            </ul>
          )}
        </>
      </div>
    </section>
  );
}
