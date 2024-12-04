import { zodResolver } from "@hookform/resolvers/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect, useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { getPrisma } from "~/utils/db.server";
import { deserialise, jsonToFormData } from "~/utils/deserialise";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { date, title, imgUrl, tags } = await deserialise(
    request,
    CreateReminderDTO
  );
  console.debug(`creating new reminder`);
  const prisma = getPrisma({ context });

  const connectOrCreateTags = tags.map((it) => ({
    where: { name: it },
    create: { name: it },
  }));

  const newReminder = await prisma.reminder.create({
    data: {
      title,
      imgUrl,
      date: new Date(date),
      tags: {
        connectOrCreate: connectOrCreateTags,
      },
    },
  });

  console.debug(`Created new reminder (id=${newReminder.id})`);
  return redirect("/");
};

const ReminderForm = z.object({
  title: z.string().min(1, "Title is required"),
  tags: z.union([z.string(), z.literal("")]).optional(), // Allows string or empty string
  imgUrl: z
    .union([z.string().url("Must be a valid URL"), z.literal("")])
    .optional(), // Allows valid URL or empty string
  date: z.date(),
});
type ReminderForm = z.infer<typeof ReminderForm>;

const CreateReminderDTO = z.object({
  title: ReminderForm.shape.title,
  tags: z.array(z.string()),
  imgUrl: ReminderForm.shape.imgUrl,
  date: z.number(),
});
type CreateReminderDTO = z.infer<typeof CreateReminderDTO>;

export default function CreateReminder() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReminderForm>({
    resolver: zodResolver(ReminderForm),
    defaultValues: {
      title: "",
      tags: "",
      imgUrl: "",
      date: undefined,
    },
  });

  const date = watch("date");
  const fetcher = useFetcher();

  const onSubmit = (data: ReminderForm) => {
    console.log({
      ...data,
      tags: data.tags?.split(",").map((tag) => tag.trim()),
    });
    const dto: CreateReminderDTO = {
      ...data,
      date: data.date.getTime(),
      tags: data.tags?.split(",").map((tag) => tag.trim()) ?? [],
    };
    fetcher.submit(jsonToFormData(dto), { method: "post" });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[90%] max-w-md px-4 my-4"
    >
      <div className="flex flex-col items-start gap-2 md:gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          {...register("title")}
          className="col-span-3"
          autoFocus
        />
        <p className="col-span-4 text-red-500 text-sm">
          {errors.title?.message ?? <>&nbsp;</>}
        </p>
        <Label htmlFor="tags" className="text-right">
          Tags
        </Label>
        <Input
          id="tags"
          {...register("tags")}
          placeholder="Separate tags with commas"
          className="col-span-3"
        />

        <p className="col-span-4 text-red-500 text-sm">
          {errors.tags?.message ?? <>&nbsp;</>}
        </p>

        <Label htmlFor="imgUrl" className="text-right">
          Image URL
        </Label>
        <Input id="imgUrl" {...register("imgUrl")} className="col-span-3" />
        <p className="col-span-4 text-red-500 text-sm">
          {errors.imgUrl?.message ?? <>&nbsp;</>}
        </p>
        <Label htmlFor="date" className="text-right">
          Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) setValue("date", selectedDate);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <p className="col-span-4 text-red-500 text-sm">
          {errors.date?.message ?? <>&nbsp;</>}
        </p>
      </div>
      <div className="text-right">
        <Button type="submit">Create Reminder</Button>
      </div>
    </form>
  );
}
