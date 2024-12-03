import type { MetaFunction } from "@remix-run/cloudflare";
import { PlusCircle } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    // <div className="flex h-screen items-center justify-center">
    <Home />
    // </div>
  );
}

// This would typically come from a database or API
const reminders = [
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

function Home() {
  return (
    <main className="container mx-auto px-4 py-2 md:py-2">
      <h1 className="text-2xl text-left font-bold mb-2 md:mb-4">Souviens</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reminders.map((reminder) => (
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
                {reminder.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
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
  );
}

function CreateReminderButton() {
  const handleCreateReminder = () => {
    // This would typically open a modal or navigate to a create reminder page
    alert("Create new reminder");
  };

  return (
    <Button
      className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
      onClick={handleCreateReminder}
    >
      <PlusCircle className="w-6 h-6" />
      <span className="sr-only">Create new reminder</span>
    </Button>
  );
}
