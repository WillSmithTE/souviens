import type { MetaFunction } from "@remix-run/cloudflare";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { PlusCircle } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { getPrisma } from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return [{ title: "Souviens" }, { name: "description", content: "" }];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const prisma = getPrisma({ context });
  const items = await prisma.reminder.findMany({
    select: {
      id: true,
      title: true,
      tags: true,
      imgUrl: true,
      date: true,
      createdAt: true,
    },
    orderBy: {
      date: "asc",
    },
  });
  return { items };
};

export default function Index() {
  // <div className="flex h-screen items-center justify-center">

  const { items } = useLoaderData<typeof loader>();
  return (
    // <div className="flex h-screen items-center justify-center">
    <div>
      <main className="container mx-auto px-4 py-2 md:py-2">
        <h1 className="text-2xl text-left font-bold mb-2 md:mb-4">Souviens</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((reminder) => (
            <Card key={reminder.id} className="overflow-hidden">
              <CardHeader>
                <h2 className="text-xl font-semibold">{reminder.title}</h2>
              </CardHeader>
              {reminder.imgUrl && (
                <img
                  src={reminder.imgUrl}
                  alt={reminder.title}
                  width={400}
                  height={200}
                  className="w-full object-cover"
                />
              )}
              <CardContent className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {reminder.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Reminder set for:{" "}
                  {reminder.date.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
        <CreateReminderButton />
      </main>
      <footer className="bg-gray-800 px-6 py-2 text-sm text-gray-400">
        <p className="text-center">
          Made by{" "}
          <Link to="https://willsmithte.com" className="underline">
            Will Smith
          </Link>
        </p>
      </footer>
    </div>
  );
}

function CreateReminderButton() {
  return (
    <Link
      className="bg-orange-600 fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg flex items-center"
      to="new"
    >
      <PlusCircle className="mx-auto my-auto w-6 h-6" />
      <span className="sr-only">Create new reminder</span>
    </Link>
  );
}

// This would typically come from a database or API
const testReminders = [
  {
    id: 1,
    title: "Anna",
    tags: ["Baby names"],
    imgUrl: "/placeholder.svg?height=200&width=200",
    date: new Date("2034-12-25"),
  },
  {
    id: 2,
    title: "Buy Bitcoin",
    tags: ["Investments", "Crypto"],
    date: new Date("2025-01-01"),
  },
  {
    id: 3,
    title: "Learn Quantum Computing",
    tags: ["Education", "Technology"],
    imgUrl: "/placeholder.svg?height=200&width=200",
    date: new Date("2030-06-15"),
  },
];
