import React from "react";
import { notFound } from "next/navigation";
import { SelectEvent } from "@/utils/db/schema";
import { getSimilarEventsBySlug } from "@/actions/events.actions";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ArrowBigLeft } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <>
    <h2>Tags</h2>
    <div className="flex flex-row gap-1 flex-wrap">
      {tags.map((tag) => (
        <div className="pill" key={tag}>
          {tag}
        </div>
      ))}
    </div>
  </>
);

const EventDetails = async ({ params }: { params: Promise<string> }) => {
  "use cache";
  cacheLife("hours");
  const slug = await params;

  let event;
  try {
    const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!request.ok) {
      if (request.status === 404) {
        return notFound();
      }
      throw new Error(`Failed to fetch event: ${request.statusText}`);
    }

    const response = await request.json();
    event = response.event;

    if (!event) {
      return notFound();
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    return notFound();
  }

  const {
    description,
    image,
    title,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = event;

  if (!description) return notFound();

  const bookings = 10;

  const similarEvents: SelectEvent[] =
    (await getSimilarEventsBySlug(slug)) || [];

  return (
    <section id="event">
      <Link
        href="/"
        className="text-xs mb-6 text-purple-600  flex gap-1  justify-start items-center "
      >
        <ArrowBigLeft size={12} />
        <strong> Back to Events</strong>
      </Link>
      <h1 className="text-3xl md:text-6xl space-y-6">{title}</h1>
      <p className=" mt-3 text-sm md:text-base text-pretty ">
        {description.split(". ")[0]}
      </p>
      <div className="details">
        {/*    Left Side - Event Content */}
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />

          <section className="w-full mt-3 md:mt-6 flex flex-col gap-2">
            <div className="">
              <h2 className="my-3">Overview</h2>
              <p className=" w-full text-xs md:text-base text-justify tracking-wide leading-8 ">
                {description}
              </p>
            </div>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <div className=" mt-3 grid grid-cols-2 gap-3">
              <EventDetailItem
                icon="/icons/calendar.svg"
                alt="calendar"
                label={date}
              />
              <EventDetailItem
                icon="/icons/clock.svg"
                alt="clock"
                label={time}
              />
              <EventDetailItem
                icon="/icons/pin.svg"
                alt="pin"
                label={location}
              />
              <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
              <EventDetailItem
                icon="/icons/audience.svg"
                alt="audience"
                label={audience}
              />
            </div>
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        {/*    Right Side - Booking Form */}
        <aside className="booking sticky top-12 ">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}

            <BookEvent eventId={event.id} />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvent) => (
              <EventCard key={similarEvent.title} {...similarEvent} />
            ))}
        </div>
        {similarEvents.length === 0 && <p>No similar events found</p>}
      </div>
    </section>
  );
};
export default EventDetails;
