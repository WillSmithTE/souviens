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
  const { items } = useLoaderData<typeof loader>();
  const hasReminders = items.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="container mx-auto px-4 py-4 border-b border-gray-700/50">
        <h1 className="text-xl font-semibold text-orange-400">Souviens</h1>
      </header>
      <main className="container mx-auto px-4 py-8">
        {hasReminders ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {items.map((reminder) => (
              <Card
                key={reminder.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-orange-500 flex flex-col"
              >
                <CardHeader className="pb-3">
                  <h2 className="text-xl font-semibold text-gray-200 group-hover:text-orange-400 transition-colors">
                    {reminder.title}
                  </h2>
                </CardHeader>
                {reminder.imgUrl && (
                  <div className="relative overflow-hidden">
                    <img
                      src={reminder.imgUrl}
                      alt={reminder.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                {reminder.tags.length > 0 && (
                  <CardContent className="pt-4 flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {reminder.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="bg-orange-900/30 text-orange-300 hover:bg-orange-800/40 transition-colors border border-orange-700"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                )}
                <CardFooter className="bg-gray-900/50 border-t border-gray-700 p-3 mt-auto">
                  <p className="text-xs text-gray-500">
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
        ) : (
          <div className="text-center py-16 mb-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-900/30 to-orange-800/40 rounded-full flex items-center justify-center border border-orange-700">
              <PlusCircle className="w-12 h-12 text-orange-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-3">
              No reminders yet
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create your first reminder to get started.
            </p>
          </div>
        )}

        <CreateReminderButton />
      </main>

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-6 text-sm text-gray-300 border-t border-gray-700">
        <div className="container mx-auto text-center">
          <p>
            Made by{" "}
            <Link
              to="https://willsmithte.com"
              className="text-orange-400 hover:text-orange-300 underline transition-colors font-medium"
            >
              Will Smith
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

function CreateReminderButton() {
  return (
    <Link
      className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center group hover:scale-110"
      to="new"
    >
      <PlusCircle className="mx-auto my-auto w-7 h-7 text-white group-hover:rotate-90 transition-transform duration-300" />
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
