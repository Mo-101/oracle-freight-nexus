import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns"

const Index = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `DeepCAL++ vΩ (count: ${count})`;
  }, [count]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepcal-dark via-slate-900 to-deepcal-purple">
      <Header />
      <div className="container mx-auto p-4">
        <Card className="oracle-card backdrop-blur-sm bg-black/40 border-deepcal-purple/30">
          <CardHeader>
            <CardTitle className="text-deepcal-light">DeepCAL++ Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">
              Welcome to the DeepCAL++ analytics dashboard. Here, you can monitor real-time data,
              track key performance indicators, and gain insights into the mystical world of freight forwarding.
            </p>
            <div className="mt-4">
              <Button onClick={() => setCount(count + 1)} className="bg-deepcal-purple hover:bg-deepcal-dark text-white">
                Increment Count: {count}
              </Button>
            </div>
            <div className="mt-4 grid gap-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input type="text" id="name" defaultValue="shadcn" className="col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input type="text" id="username" defaultValue="@shadcn" className="col-span-2" />
              </div>
            </div>
            <div className="mt-4">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4">
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode">Airplane mode</Label>
            </div>
            <div className="mt-4">
              <Textarea placeholder="Type your message here." />
            </div>
            <div className="mt-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !count && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {count ? format(count, "PPP") : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={count}
                    onSelect={setCount}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

import { CalendarIcon } from "@radix-ui/react-icons"
