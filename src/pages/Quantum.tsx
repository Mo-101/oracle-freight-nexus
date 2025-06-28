import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useToast } from "@/components/ui/use-toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const Quantum = () => {
  const [sliderValue, setSliderValue] = useState(50);
  const [switchValue, setSwitchValue] = useState(false);
  const [progressValue, setProgressValue] = useState(25);
  const [textareaValue, setTextareaValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressValue((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepcal-dark via-slate-900 to-deepcal-purple">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-white mb-4">Quantum View</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Slider */}
          <Card className="bg-black/50 text-white">
            <CardHeader>
              <CardTitle>Slider Control</CardTitle>
              <CardDescription>Adjust the quantum entanglement level.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Label htmlFor="slider">Entanglement:</Label>
                <Slider
                  id="slider"
                  defaultValue={[sliderValue]}
                  max={100}
                  step={1}
                  onValueChange={(value) => setSliderValue(value[0])}
                />
                <span>{sliderValue}</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Switch */}
          <Card className="bg-black/50 text-white">
            <CardHeader>
              <CardTitle>Quantum State Switch</CardTitle>
              <CardDescription>Toggle the quantum superposition state.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Label htmlFor="switch">Superposition:</Label>
                <Switch
                  id="switch"
                  checked={switchValue}
                  onCheckedChange={(checked) => setSwitchValue(checked)}
                />
                <span>{switchValue ? 'On' : 'Off'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Badge */}
          <Card className="bg-black/50 text-white">
            <CardHeader>
              <CardTitle>Quantum Status</CardTitle>
              <CardDescription>Current status of the quantum process.</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">
                <i className="fas fa-atom mr-2"></i>
                Entangled
              </Badge>
            </CardContent>
          </Card>

          {/* Card 4: Tooltip */}
          <Card className="bg-black/50 text-white">
            <CardHeader>
              <CardTitle>Quantum Information</CardTitle>
              <CardDescription>Hover for a quantum fact.</CardDescription>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <i className="fas fa-question-circle mr-2"></i>
                      What is Quantum?
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Quantum mechanics is the branch of physics relating to the very small.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>

          {/* Card 5: Progress */}
          <Card className="bg-black/50 text-white">
            <CardHeader>
              <CardTitle>Quantum Progress</CardTitle>
              <CardDescription>Progress of the quantum computation.</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progressValue} />
              <span className="text-sm mt-2">Progress: {progressValue}%</span>
            </CardContent>
          </Card>

          {/* Card 6: Textarea */}
          <Card className="bg-black/50 text-white">
            <CardHeader>
              <CardTitle>Quantum Input</CardTitle>
              <CardDescription>Enter quantum state information.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type here..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Card 7: Input */}
          <Card className="bg-black/50 text-white">
            <CardHeader>
              <CardTitle>Quantum Value</CardTitle>
              <CardDescription>Enter a specific quantum value.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Card 8: Toast */}
          <Card className="bg-black/50 text-white">
            <CardHeader>
              <CardTitle>Quantum Alert</CardTitle>
              <CardDescription>Trigger a quantum alert.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => toast({
                title: "Quantum Alert!",
                description: "A quantum event has occurred.",
              })}>
                <i className="fas fa-bell mr-2"></i>
                Trigger Alert
              </Button>
            </CardContent>
          </Card>

          {/* Card 9: Accordion */}
          <Card className="bg-black/50 text-white">
            <CardHeader>
              <CardTitle>Quantum Details</CardTitle>
              <CardDescription>Expand for quantum details.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is Quantum Entanglement?</AccordionTrigger>
                  <AccordionContent>
                    Quantum entanglement is a phenomenon where particles become correlated in such a way that they share the same fate, no matter how far apart they are.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Quantum;
